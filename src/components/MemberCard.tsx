import { Link, useNavigate } from 'react-router-dom';
import { MapPin, FileText, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Member, getClassificationLabel } from '@/lib/mockData';
import MemberShieldRating from '@/components/MemberShieldRating';
import MemberAvatar from '@/components/MemberAvatar';

interface MemberCardProps {
  member: Member;
  index?: number;
}

const MemberCard = ({ member, index = 0 }: MemberCardProps) => {
  const navigate = useNavigate();

  const handleClassificationClick = (e: React.MouseEvent, cls: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/results?type=classification&value=${encodeURIComponent(cls)}`);
  };

  const handleCountryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to first country as example — or could show all
  };

  return (
    <Link
      to={`/member/${member.id}`}
      className="block group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article className="bg-card border border-border rounded-lg p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-sm animate-fade-in">
        <div className="flex items-start gap-3 mb-3">
          <MemberAvatar
            currentUrl={member.avatarUrl}
            fallbackInitials={member.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
            size="md"
          />
          <div>
            <h3 className="font-display text-base font-semibold text-card-foreground group-hover:text-accent transition-colors">
              {member.fullName}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1 flex-wrap">
                <MapPin className="h-3 w-3" />
                {member.countriesVisited.slice(0, 3).map((country, i) => (
                  <span key={country}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(
                          `/results?type=country&value=${encodeURIComponent(country)}`
                        );
                      }}
                      className="hover:text-accent hover:underline transition-colors"
                    >
                      {country}
                    </button>
                    {i < Math.min(member.countriesVisited.length, 3) - 1 &&
                      ', '}
                  </span>
                ))}
                {member.countriesVisited.length > 3 && (
                  <span className="text-muted-foreground">
                    +{member.countriesVisited.length - 3}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {member.tripCount} trips
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {member.description}
        </p>

        {/* Consultancy & Shields */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            {member.consultancyAvailable ? (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 gap-1"
              >
                <MessageSquare className="h-2.5 w-2.5 text-accent" />
                {member.consultancyType === 'free'
                  ? 'Free'
                  : member.consultancyType === 'paid'
                    ? 'Paid'
                    : 'Free & Paid'}
                {(member.consultancyType === 'paid' ||
                  member.consultancyType === 'both') &&
                  member.consultancyRate && (
                    <span className="ml-0.5">
                      {member.consultancyCurrency} {member.consultancyRate}/s
                    </span>
                  )}
              </Badge>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                No consultancy
              </span>
            )}
          </div>
          <MemberShieldRating memberId={member.id} compact />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {member.classifications.slice(0, 4).map((cls) => (
            <Badge
              key={cls}
              variant="secondary"
              className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 cursor-pointer hover:bg-accent/20 hover:text-accent transition-colors"
              onClick={(e) => handleClassificationClick(e, cls)}
            >
              {getClassificationLabel(cls)}
            </Badge>
          ))}
          {member.classifications.length > 4 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{member.classifications.length - 4} more
            </span>
          )}
        </div>
      </article>
    </Link>
  );
};

export default MemberCard;
