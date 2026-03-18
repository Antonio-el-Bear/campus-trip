
-- Connections table for member-to-member connection requests
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (requester_id, receiver_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see their own connections
CREATE POLICY "Users can view their own connections"
  ON public.connections FOR SELECT
  USING (
    requester_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );

-- Users can send connection requests
CREATE POLICY "Users can insert connection requests"
  ON public.connections FOR INSERT
  WITH CHECK (
    requester_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );

-- Users can update connections they are part of (accept/reject)
CREATE POLICY "Users can update their own connections"
  ON public.connections FOR UPDATE
  USING (
    receiver_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );

-- Users can delete their own connections
CREATE POLICY "Users can delete their own connections"
  ON public.connections FOR DELETE
  USING (
    requester_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );

-- Trigger for updated_at
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Private messages table (only between connected members)
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON public.private_messages FOR SELECT
  USING (
    sender_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );

-- Users can send messages only to accepted connections
CREATE POLICY "Users can send messages to connections"
  ON public.private_messages FOR INSERT
  WITH CHECK (
    sender_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.connections
      WHERE status = 'accepted'
      AND (
        (requester_id = sender_id AND receiver_id = private_messages.receiver_id)
        OR (receiver_id = sender_id AND requester_id = private_messages.receiver_id)
      )
    )
  );

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can mark received messages as read"
  ON public.private_messages FOR UPDATE
  USING (
    receiver_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;
