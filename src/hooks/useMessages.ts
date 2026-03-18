import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMyMember } from './useConnections';
import { useEffect } from 'react';

export interface PrivateMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export function useConversation(otherMemberId: string | null) {
  const { data: myMember } = useMyMember();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', myMember?.id, otherMemberId],
    enabled: !!myMember?.id && !!otherMemberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .or(
          `and(sender_id.eq.${myMember!.id},receiver_id.eq.${otherMemberId}),and(sender_id.eq.${otherMemberId},receiver_id.eq.${myMember!.id})`
        )
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as PrivateMessage[];
    },
    refetchInterval: 5000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!myMember?.id || !otherMemberId) return;
    const channel = supabase
      .channel(`messages-${myMember.id}-${otherMemberId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages' },
        (payload) => {
          const msg = payload.new as PrivateMessage;
          if (
            (msg.sender_id === myMember.id &&
              msg.receiver_id === otherMemberId) ||
            (msg.sender_id === otherMemberId && msg.receiver_id === myMember.id)
          ) {
            qc.invalidateQueries({
              queryKey: ['messages', myMember.id, otherMemberId],
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myMember?.id, otherMemberId, qc]);

  return query;
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { data: myMember } = useMyMember();

  return useMutation({
    mutationFn: async ({
      receiverId,
      content,
    }: {
      receiverId: string;
      content: string;
    }) => {
      if (!myMember) throw new Error('Not logged in');
      const { error } = await supabase
        .from('private_messages')
        .insert({ sender_id: myMember.id, receiver_id: receiverId, content });
      if (error) throw error;
    },
    onSuccess: (_, { receiverId }) => {
      qc.invalidateQueries({
        queryKey: ['messages', myMember?.id, receiverId],
      });
    },
  });
}
