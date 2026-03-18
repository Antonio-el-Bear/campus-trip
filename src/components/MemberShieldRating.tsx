import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MemberShieldRatingProps {
  memberId: string;
  compact?: boolean;
}

const MemberShieldRating = ({
  memberId,
  compact = false,
}: MemberShieldRatingProps) => {
  const { toast } = useToast();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredShield, setHoveredShield] = useState<number>(0);
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
  }, [memberId, userId]);

  const isValidUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const fetchRatings = async () => {
    if (!isValidUuid(memberId)) {
      setAverageRating(0);
      setTotalRatings(0);
      return;
    }

    const { data: ratings } = await supabase
      .from('member_ratings')
      .select('rating, user_id')
      .eq('member_id', memberId);

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
        description: 'Please sign in to rate this member.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      if (userRating) {
        await supabase
          .from('member_ratings')
          .update({ rating })
          .eq('member_id', memberId)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('member_ratings')
          .insert({ member_id: memberId, user_id: userId, rating });
      }
      setUserRating(rating);
      await fetchRatings();
      toast({
        title: 'Rating saved',
        description: `You rated this author ${rating}/5 shields.`,
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

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((level) => {
            const filled = level <= Math.round(averageRating);
            return (
              <Shield
                key={level}
                className={`h-3.5 w-3.5 transition-colors ${
                  filled
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>
        {averageRating > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {averageRating} ({totalRatings})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-display text-sm font-semibold text-foreground mb-3">
        Author Rating
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((level) => {
            const filled =
              level <=
              (hoveredShield || userRating || Math.round(averageRating));
            return (
              <button
                key={level}
                type="button"
                disabled={loading}
                onClick={() => handleRate(level)}
                onMouseEnter={() => setHoveredShield(level)}
                onMouseLeave={() => setHoveredShield(0)}
                className="p-0.5 transition-colors disabled:opacity-50"
                aria-label={`Rate ${level} shield${level > 1 ? 's' : ''}`}
              >
                <Shield
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
          Your rating: {userRating}/5 shields
        </p>
      )}
      {!userId && (
        <p className="text-xs text-muted-foreground font-body">
          Sign in to rate this author.
        </p>
      )}
    </div>
  );
};

export default MemberShieldRating;
