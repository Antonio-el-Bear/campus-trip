import { useState, useRef, useEffect } from 'react';
import { Send, UserPlus, Check, X, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileNavBar from '@/components/MobileNavBar';
import {
  useMyMember,
  useConnections,
  useRespondToConnection,
} from '@/hooks/useConnections';
import { useConversation, useSendMessage } from '@/hooks/useMessages';
import { format } from 'date-fns';

const MessagesPage = () => {
  const { data: myMember, isLoading: memberLoading } = useMyMember();
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const respond = useRespondToConnection();

  const acceptedConnections =
    connections?.filter((c) => c.status === 'accepted') || [];
  const pendingReceived =
    connections?.filter(
      (c) => c.status === 'pending' && c.receiver_id === myMember?.id
    ) || [];

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Auto-select first accepted connection
  useEffect(() => {
    if (!selectedMemberId && acceptedConnections.length > 0 && myMember) {
      const first = acceptedConnections[0];
      setSelectedMemberId(
        first.requester_id === myMember.id
          ? first.receiver_id
          : first.requester_id
      );
    }
  }, [acceptedConnections, myMember, selectedMemberId]);

  const { data: messages } = useConversation(selectedMemberId);
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getOtherMember = (conn: (typeof acceptedConnections)[0]) => {
    if (!myMember) return null;
    return conn.requester_id === myMember.id ? conn.receiver : conn.requester;
  };

  const selectedName = acceptedConnections.find((c) => {
    const other = getOtherMember(c);
    return other?.id === selectedMemberId;
  });

  if (memberLoading || connectionsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body text-sm">Loading...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!myMember) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-body text-sm">
              Please sign in to access messages.
            </p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMemberId) return;
    sendMessage.mutate({
      receiverId: selectedMemberId,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <div className="mb-6">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
            Private
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Messages
          </h1>
        </div>

        {/* Pending connection requests */}
        {pendingReceived.length > 0 && (
          <div className="mb-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connection Requests ({pendingReceived.length})
            </h3>
            {pendingReceived.map((conn) => (
              <div
                key={conn.id}
                className="flex items-center justify-between bg-card border border-border rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-accent" />
                  <span className="text-sm font-body font-medium text-foreground">
                    {conn.requester?.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    wants to connect
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs gap-1"
                    onClick={() =>
                      respond.mutate({ connectionId: conn.id, accept: true })
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
                      respond.mutate({ connectionId: conn.id, accept: false })
                    }
                    disabled={respond.isPending}
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
          {/* Conversation list */}
          <aside className="md:col-span-1 bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Connections
              </h3>
            </div>
            <div className="divide-y divide-border">
              {acceptedConnections.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground font-body">
                    No connections yet. Visit member profiles to send connection
                    requests.
                  </p>
                </div>
              ) : (
                acceptedConnections.map((conn) => {
                  const other = getOtherMember(conn);
                  if (!other) return null;
                  return (
                    <button
                      key={conn.id}
                      onClick={() => setSelectedMemberId(other.id)}
                      className={`w-full text-left p-3 transition-colors ${
                        selectedMemberId === other.id
                          ? 'bg-secondary'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground font-body">
                        {other.full_name}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        Connected
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Message thread */}
          <main className="md:col-span-2 bg-card border border-border rounded-lg flex flex-col">
            {selectedMemberId ? (
              <>
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground font-body">
                    {
                      acceptedConnections
                        .map(getOtherMember)
                        .find((m) => m?.id === selectedMemberId)?.full_name
                    }
                  </h3>
                </div>

                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {(!messages || messages.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-8 font-body">
                      No messages yet. Start the conversation!
                    </p>
                  )}
                  {messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === myMember.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_id === myMember.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-xs font-body">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            msg.sender_id === myMember.id
                              ? 'text-primary-foreground/60'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-border">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="font-body text-sm"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-accent text-accent-foreground hover:bg-gold-dark flex-shrink-0"
                      disabled={!newMessage.trim() || sendMessage.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground font-body">
                  Select a connection to start chatting.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <MobileNavBar />
      <SiteFooter />
    </div>
  );
};

export default MessagesPage;
