
CREATE TABLE public.ai_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  trip_data jsonb NOT NULL,
  form_inputs jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI trips"
  ON public.ai_trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI trips"
  ON public.ai_trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI trips"
  ON public.ai_trips FOR DELETE
  USING (auth.uid() = user_id);
