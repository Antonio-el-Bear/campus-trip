
-- Members table (links to auth users)
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  countries_visited TEXT[] DEFAULT '{}',
  classifications TEXT[] DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  trip_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members are viewable by everyone" ON public.members FOR SELECT USING (true);
CREATE POLICY "Users can update their own member profile" ON public.members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own member profile" ON public.members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Priority subscriptions table
CREATE TABLE public.priority_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  countries TEXT[] NOT NULL DEFAULT '{}',
  classifications TEXT[] NOT NULL DEFAULT '{}',
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 80.00,
  currency TEXT NOT NULL DEFAULT 'EUR',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 year'),
  payment_status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.priority_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscriptions are viewable by everyone" ON public.priority_subscriptions FOR SELECT USING (true);
CREATE POLICY "Members can insert their own subscriptions" ON public.priority_subscriptions FOR INSERT WITH CHECK (
  member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
);
CREATE POLICY "Members can update their own subscriptions" ON public.priority_subscriptions FOR UPDATE USING (
  member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
