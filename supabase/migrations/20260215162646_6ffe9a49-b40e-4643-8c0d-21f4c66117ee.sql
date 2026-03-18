
CREATE TABLE public.trip_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id text NOT NULL,
  user_id uuid NOT NULL,
  rating smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trip_id, user_id),
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

ALTER TABLE public.trip_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone"
ON public.trip_ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own rating"
ON public.trip_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rating"
ON public.trip_ratings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rating"
ON public.trip_ratings FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_trip_ratings_updated_at
BEFORE UPDATE ON public.trip_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
