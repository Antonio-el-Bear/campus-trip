import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Sparkles,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Trip,
  formatDate,
  getCostRange,
  getClassificationLabel,
} from '@/lib/mockData';

interface TripCardProps {
  trip: Trip;
  index?: number;
  isPriority?: boolean;
}

const TripCard = ({ trip, index = 0, isPriority = false }: TripCardProps) => {
  const navigate = useNavigate();

  const handleClassificationClick = (e: React.MouseEvent, cls: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/results?type=classification&value=${encodeURIComponent(cls)}`);
  };

  const handleCountryClick = (e: React.MouseEvent, country: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/results?type=country&value=${encodeURIComponent(country)}`);
  };

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="block group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article
        className={`bg-card border rounded-lg p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-sm animate-fade-in ${isPriority ? 'border-accent/30 ring-1 ring-accent/10' : 'border-border'}`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-base font-semibold text-card-foreground group-hover:text-accent transition-colors leading-snug">
            {trip.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {trip.source === 'ai' ? (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium gap-1">
                <Sparkles className="h-2.5 w-2.5" /> AI-Built
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] font-medium gap-1"
              >
                <User className="h-2.5 w-2.5" /> Member
              </Badge>
            )}
            {isPriority && (
              <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] font-medium gap-1">
                <Star className="h-2.5 w-2.5" /> Priority
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          by{' '}
          <span className="font-medium text-foreground">{trip.memberName}</span>
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {trip.countries.map((country, i) => (
              <span key={country}>
                <button
                  onClick={(e) => handleCountryClick(e, country)}
                  className="hover:text-accent hover:underline transition-colors"
                >
                  {country}
                </button>
                {i < trip.countries.length - 1 && ', '}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {trip.totalDays} days
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {getCostRange(trip.totalCost)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {trip.classifications.slice(0, 3).map((cls) => (
            <Badge
              key={cls}
              variant="secondary"
              className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 cursor-pointer hover:bg-accent/20 hover:text-accent transition-colors"
              onClick={(e) => handleClassificationClick(e, cls)}
            >
              {getClassificationLabel(cls)}
            </Badge>
          ))}
        </div>
      </article>
    </Link>
  );
};

export default TripCard;
