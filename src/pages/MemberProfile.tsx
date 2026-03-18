import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  FileText,
  Calendar,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import TripCard from '@/components/TripCard';
import SubscriberGate from '@/components/SubscriberGate';
import MemberShieldRating from '@/components/MemberShieldRating';
import MemberAvatar from '@/components/MemberAvatar';
import ConnectionButton from '@/components/ConnectionButton';
import { MemberTravelMap } from '@/components/TravelMap';
import {
  MOCK_MEMBERS,
  MOCK_TRIPS,
  formatDate,
  getClassificationLabel,
} from '@/lib/mockData';

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const member = MOCK_MEMBERS.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body">Member not found.</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const isSubscriber = true;
  const memberTrips = MOCK_TRIPS.filter((t) => t.memberId === member.id);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <Link
          to="/directory"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-6 font-body"
        >
          <ArrowLeft className="h-3 w-3" /> Back to directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile info */}
          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <MemberAvatar
                currentUrl={member.avatarUrl}
                fallbackInitials={member.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
                size="lg"
              />

              <div className="flex items-center justify-between mb-2">
                <h1 className="font-display text-xl font-bold text-foreground">
                  {member.fullName}
                </h1>
                <ConnectionButton targetMemberId={member.id} />
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {member.countriesVisited.length} countries visited
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {member.tripCount} trips
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
                {isSubscriber
                  ? member.description
                  : member.description.slice(0, 120) + '...'}
              </p>

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <Calendar className="h-3 w-3" />
                Member since {formatDate(member.joinedDate)}
              </div>

              {/* Classifications */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {member.classifications.map((cls) => (
                    <Link
                      key={cls}
                      to={`/results?type=classification&value=${encodeURIComponent(cls)}`}
                    >
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 cursor-pointer hover:bg-accent/20 hover:text-accent transition-colors"
                      >
                        {getClassificationLabel(cls)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Countries Visited
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {member.countriesVisited
                    .slice(0, isSubscriber ? undefined : 5)
                    .map((c) => (
                      <Link
                        key={c}
                        to={`/results?type=country&value=${encodeURIComponent(c)}`}
                      >
                        <span className="bg-secondary text-secondary-foreground text-[10px] font-medium px-2 py-1 rounded cursor-pointer hover:bg-accent/20 hover:text-accent transition-colors">
                          {c}
                        </span>
                      </Link>
                    ))}
                  {!isSubscriber && member.countriesVisited.length > 5 && (
                    <span className="text-[10px] text-muted-foreground px-2 py-1">
                      +{member.countriesVisited.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Consultancy */}
              {member.consultancyAvailable && (
                <div className="mb-4 p-3 border border-accent/30 rounded-md">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-accent" />
                    Consultancy & Assistance
                  </h3>
                  <div className="space-y-1 text-xs text-muted-foreground font-body">
                    <div className="flex items-center justify-between">
                      <span>Type</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {member.consultancyType === 'free' && 'Free'}
                        {member.consultancyType === 'paid' && 'Paid'}
                        {member.consultancyType === 'both' && 'Free & Paid'}
                      </Badge>
                    </div>
                    {(member.consultancyType === 'paid' ||
                      member.consultancyType === 'both') &&
                      member.consultancyRate && (
                        <div className="flex items-center justify-between">
                          <span>Rate</span>
                          <span className="font-medium text-foreground">
                            {member.consultancyCurrency}{' '}
                            {member.consultancyRate}/session
                          </span>
                        </div>
                      )}
                    {member.consultancyDescription && (
                      <p className="pt-1 border-t border-border mt-1 leading-relaxed">
                        {member.consultancyDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Author Shield Rating */}
              <div className="mb-4">
                <MemberShieldRating memberId={member.id} />
              </div>

              {/* Contact */}
              {isSubscriber ? (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Contact
                  </h3>
                  {member.contactEmail && (
                    <p className="text-xs text-foreground">
                      {member.contactEmail}
                    </p>
                  )}
                  {member.contactPhone && (
                    <p className="text-xs text-foreground mt-1">
                      {member.contactPhone}
                    </p>
                  )}
                  {member.website && (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline mt-1 block"
                    >
                      {member.website}
                    </a>
                  )}
                </div>
              ) : (
                <SubscriberGate feature="Contact information" />
              )}
            </div>
          </aside>

          {/* Trips */}
          <main className="lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Documented Trips ({memberTrips.length})
            </h2>

            {memberTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberTrips.map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">
                No trips documented yet.
              </p>
            )}

            {/* Map */}
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Travel Map
              </h2>
              <MemberTravelMap countries={member.countriesVisited} />
            </div>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default MemberProfile;
