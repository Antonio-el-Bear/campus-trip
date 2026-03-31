import React from 'react';
import { UserPlus, UserCheck, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useConnectionStatus,
  useSendConnectionRequest,
  useRespondToConnection,
  useConnections,
  useMyMember,
} from '@/hooks/useConnections';

interface ConnectionButtonProps {
  targetMemberId: string;
}

const ConnectionButton = ({ targetMemberId }: ConnectionButtonProps) => {
  const status = useConnectionStatus(targetMemberId);
  const sendRequest = useSendConnectionRequest();
  const respond = useRespondToConnection();
  const { data: myMember } = useMyMember();
  const { data: connections } = useConnections();

  if (!myMember || status === 'self') return null;

  if (status === 'connected') {
    return (
      <Button
        variant="secondary"
        size="sm"
        className="font-body text-xs gap-1.5"
        disabled
      >
        <UserCheck className="h-3.5 w-3.5" /> Connected
      </Button>
    );
  }

  if (status === 'pending_sent') {
    return (
      <Button
        variant="outline"
        size="sm"
        className="font-body text-xs gap-1.5"
        disabled
      >
        <Clock className="h-3.5 w-3.5" /> Request Sent
      </Button>
    );
  }

  if (status === 'pending_received') {
    const conn = connections?.find(
      (c) =>
        c.requester_id === targetMemberId &&
        c.receiver_id === myMember.id &&
        c.status === 'pending'
    );
    return (
      <div className="flex gap-1.5">
        <Button
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs gap-1"
          onClick={() =>
            conn && respond.mutate({ connectionId: conn.id, accept: true })
          }
          disabled={respond.isPending}
        >
          <Check className="h-3.5 w-3.5" /> Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="font-body text-xs gap-1"
          onClick={() =>
            conn && respond.mutate({ connectionId: conn.id, accept: false })
          }
          disabled={respond.isPending}
        >
          <X className="h-3.5 w-3.5" /> Decline
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs gap-1.5"
      onClick={() => sendRequest.mutate(targetMemberId)}
      disabled={sendRequest.isPending}
    >
      <UserPlus className="h-3.5 w-3.5" /> Connect
    </Button>
  );
};

export default ConnectionButton;
