import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MemberShieldRating from '@/components/MemberShieldRating';
import MemberAvatar from '@/components/MemberAvatar';
import {
  MOCK_TRIPS,
  MOCK_MEMBERS,
  getClassificationLabel,
  formatDate,
  getCostRange,
  Trip,
  Member,
} from '@/lib/mockData';

const SmallTripCard = ({ trip }: { trip: Trip }) => (
  <Link to={`/trip/${trip.id}`} className="block group">
    <div className="bg-card border border-border rounded-md p-3 hover:border-accent/40 transition-colors">
      <h4 className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors mb-1 leading-snug">
        {trip.title}
      </h4>
      <p className="text-[11px] text-muted-foreground font-body mb-1.5">
        by {trip.memberName} ·{' '}
        {trip.countries.map((country, i) => (
          <span key={country}>
            <Link
              to={`/results?type=country&value=${encodeURIComponent(country)}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-accent hover:underline transition-colors"
            >
              {country}
            </Link>
            {i < trip.countries.length - 1 && ', '}
          </span>
        ))}
      </p>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-body">
        <span>{trip.totalDays} days</span>
        <span>{getCostRange(trip.totalCost)}</span>
        <span>{formatDate(trip.startDate)}</span>
      </div>
    </div>
  </Link>
);

const SmallMemberCard = ({ member }: { member: Member }) => (
  <Link to={`/member/${member.id}`} className="block group">
    <div className="bg-card border border-border rounded-md p-3 hover:border-accent/40 transition-colors flex items-start gap-3">
      <MemberAvatar
        currentUrl={member.avatarUrl}
        fallbackInitials={member.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)}
        size="sm"
      />
      <div className="min-w-0">
        <h4 className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
          {member.fullName}
        </h4>
        <p className="text-[11px] text-muted-foreground font-body flex flex-wrap items-center gap-0.5">
          {member.countriesVisited.slice(0, 3).map((country, i) => (
            <span key={country}>
              <Link
                to={`/results?type=country&value=${encodeURIComponent(country)}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-accent hover:underline transition-colors"
              >
                {country}
              </Link>
              {i < Math.min(member.countriesVisited.length, 3) - 1 && ', '}
            </span>
          ))}
          {member.countriesVisited.length > 3 && (
            <span>+{member.countriesVisited.length - 3}</span>
          )}
          <span>· {member.tripCount} trips</span>
        </p>
        <div className="flex items-center justify-between gap-2 mt-1.5">
          {member.consultancyAvailable ? (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-1">
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
            <span className="text-[9px] text-muted-foreground">
              No consultancy
            </span>
          )}
          <MemberShieldRating memberId={member.id} compact />
        </div>
      </div>
    </div>
  </Link>
);

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // "classification" or "country"
  const value = searchParams.get('value') || '';

  let pageTitle = '';
  let matchedTrips: Trip[] = [];
  let matchedMembers: Member[] = [];

  if (type === 'classification') {
    pageTitle = getClassificationLabel(value);
    matchedTrips = MOCK_TRIPS.filter((t) => t.classifications.includes(value));
    matchedMembers = MOCK_MEMBERS.filter((m) =>
      m.classifications.includes(value)
    );
  } else if (type === 'country') {
    pageTitle = value;
    matchedTrips = MOCK_TRIPS.filter((t) => t.countries.includes(value));
    matchedMembers = MOCK_MEMBERS.filter((m) =>
      m.countriesVisited.includes(value)
    );
  } else if (type === 'location') {
    pageTitle = value;
    matchedTrips = MOCK_TRIPS.filter((t) => t.locations.includes(value));
    matchedMembers = [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-6 font-body"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div className="mb-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
            {type === 'classification'
              ? 'Trip Classification'
              : type === 'location'
                ? 'Location'
                : 'Country'}
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {pageTitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trips */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Trips ({matchedTrips.length})
              </h2>
            </div>
            {matchedTrips.length > 0 ? (
              <div className="space-y-2">
                {matchedTrips.map((trip) => (
                  <SmallTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body bg-card border border-border rounded-md p-4">
                No trips found for this{' '}
                {type === 'classification'
                  ? 'classification'
                  : type === 'location'
                    ? 'location'
                    : 'country'}
                .
              </p>
            )}
          </section>

          {/* Members */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Specialist Members ({matchedMembers.length})
              </h2>
            </div>
            {matchedMembers.length > 0 ? (
              <div className="space-y-2">
                {matchedMembers.map((member) => (
                  <SmallMemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body bg-card border border-border rounded-md p-4">
                No members specialize in this{' '}
                {type === 'classification'
                  ? 'classification'
                  : type === 'location'
                    ? 'location'
                    : 'country'}
                .
              </p>
            )}
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default ResultsPage;
