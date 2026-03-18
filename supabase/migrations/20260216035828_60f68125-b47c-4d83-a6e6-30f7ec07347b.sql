
-- Create member_ratings table for shield ratings (1-5)
CREATE TABLE public.member_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (member_id, user_id)
);

-- Enable RLS
ALTER TABLE public.member_ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Ratings are viewable by everyone"
  ON public.member_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own rating"
  ON public.member_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rating"
  ON public.member_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rating"
  ON public.member_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_member_ratings_updated_at
  BEFORE UPDATE ON public.member_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
