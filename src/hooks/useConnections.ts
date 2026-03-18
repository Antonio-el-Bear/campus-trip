import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  requester?: { id: string; full_name: string; avatar_url: string | null };
  receiver?: { id: string; full_name: string; avatar_url: string | null };
}

export function useMyMember() {
  return useQuery({
    queryKey: ['my-member'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('members')
        .select('id, full_name, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
  });
}

export function useConnections() {
  const { data: myMember } = useMyMember();

  return useQuery({
    queryKey: ['connections', myMember?.id],
    enabled: !!myMember?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connections')
        .select(
          '*, requester:members!connections_requester_id_fkey(id, full_name, avatar_url), receiver:members!connections_receiver_id_fkey(id, full_name, avatar_url)'
        )
        .or(`requester_id.eq.${myMember!.id},receiver_id.eq.${myMember!.id}`);
      if (error) throw error;
      return data as Connection[];
    },
  });
}

export function useConnectionStatus(targetMemberId: string | undefined) {
  const { data: myMember } = useMyMember();
  const { data: connections } = useConnections();

  if (!myMember || !targetMemberId || !connections) return null;
  if (targetMemberId === myMember.id) return 'self';

  const conn = connections.find(
    (c) =>
      (c.requester_id === myMember.id && c.receiver_id === targetMemberId) ||
      (c.receiver_id === myMember.id && c.requester_id === targetMemberId)
  );

  if (!conn) return 'none';
  if (conn.status === 'accepted') return 'connected';
  if (conn.status === 'pending' && conn.requester_id === myMember.id)
    return 'pending_sent';
  if (conn.status === 'pending' && conn.receiver_id === myMember.id)
    return 'pending_received';
  return 'none';
}

export function useSendConnectionRequest() {
  const qc = useQueryClient();
  const { data: myMember } = useMyMember();

  return useMutation({
    mutationFn: async (receiverMemberId: string) => {
      if (!myMember) throw new Error('Not logged in');
      const { error } = await supabase
        .from('connections')
        .insert({ requester_id: myMember.id, receiver_id: receiverMemberId });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['connections'] });
      toast({ title: 'Connection request sent' });
    },
    onError: (e: any) => {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    },
  });
}

export function useRespondToConnection() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      connectionId,
      accept,
    }: {
      connectionId: string;
      accept: boolean;
    }) => {
      if (accept) {
        const { error } = await supabase
          .from('connections')
          .update({ status: 'accepted' })
          .eq('id', connectionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('connections')
          .delete()
          .eq('id', connectionId);
        if (error) throw error;
      }
    },
    onSuccess: (_, { accept }) => {
      qc.invalidateQueries({ queryKey: ['connections'] });
      toast({ title: accept ? 'Connection accepted' : 'Connection declined' });
    },
    onError: (e: any) => {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    },
  });
}
