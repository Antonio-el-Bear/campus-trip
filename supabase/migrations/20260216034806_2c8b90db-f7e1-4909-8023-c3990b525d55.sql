
-- Add consultancy fields to members table
ALTER TABLE public.members
  ADD COLUMN consultancy_available boolean NOT NULL DEFAULT false,
  ADD COLUMN consultancy_type text NOT NULL DEFAULT 'free',
  ADD COLUMN consultancy_rate numeric DEFAULT NULL,
  ADD COLUMN consultancy_currency text NOT NULL DEFAULT 'EUR',
  ADD COLUMN consultancy_description text DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN public.members.consultancy_type IS 'One of: free, paid, both';
COMMENT ON COLUMN public.members.consultancy_rate IS 'Hourly or per-session rate if paid';
