import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TripStarRatingProps {
  tripId: string;
}

const TripStarRating = ({ tripId }: TripStarRatingProps) => {
  const { toast } = useToast();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [tripId, userId]);

  const fetchRatings = async () => {
    const { data: ratings } = await supabase
      .from('trip_ratings')
      .select('rating, user_id')
      .eq('trip_id', tripId);

    if (ratings && ratings.length > 0) {
      const avg =
        ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      setAverageRating(Math.round(avg * 10) / 10);
      setTotalRatings(ratings.length);
      if (userId) {
        const mine = ratings.find((r) => r.user_id === userId);
        setUserRating(mine?.rating ?? null);
      }
    } else {
      setAverageRating(0);
      setTotalRatings(0);
    }
  };

  const handleRate = async (rating: number) => {
    if (!userId) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to rate trips.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      if (userRating) {
        await supabase
          .from('trip_ratings')
          .update({ rating })
          .eq('trip_id', tripId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('trip_ratings')
          .insert({ trip_id: tripId, user_id: userId, rating });
      }
      setUserRating(rating);
      await fetchRatings();
      toast({
        title: 'Rating saved',
        description: `You rated this trip ${rating}/5.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save rating.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-display text-sm font-semibold text-foreground mb-3">
        Trip Rating
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled =
              star <= (hoveredStar || userRating || Math.round(averageRating));
            return (
              <button
                key={star}
                type="button"
                disabled={loading}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-0.5 transition-colors disabled:opacity-50"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`h-5 w-5 transition-colors ${
                    filled
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground/40'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <span className="text-sm font-medium text-foreground">
          {averageRating > 0 ? averageRating : '—'}
        </span>
        <span className="text-xs text-muted-foreground">
          ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
        </span>
      </div>

      {userRating && (
        <p className="text-xs text-muted-foreground font-body">
          Your rating: {userRating}/5
        </p>
      )}
      {!userId && (
        <p className="text-xs text-muted-foreground font-body">
          Sign in to rate this trip.
        </p>
      )}
    </div>
  );
};

export default TripStarRating;
