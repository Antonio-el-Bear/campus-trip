import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  ArrowLeft,
  Car,
  MessageSquare,
  Sparkles,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TripRouteMap } from '@/components/TravelMap';
import MapErrorBoundary from '@/components/MapErrorBoundary';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SubscriberGate from '@/components/SubscriberGate';
import TripStarRating from '@/components/TripStarRating';
import MemberShieldRating from '@/components/MemberShieldRating';
import {
  MOCK_TRIPS,
  MOCK_MEMBERS,
  formatDate,
  formatCurrency,
  getClassificationLabel,
} from '@/lib/mockData';

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trip = MOCK_TRIPS.find((t) => t.id === id);
  const member = trip
    ? MOCK_MEMBERS.find((m) => m.id === trip.memberId)
    : undefined;

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body">Trip not found.</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // Set to true to allow full preview for testing
  const isSubscriber = true;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <Link
          to="/search"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-6 font-body"
        >
          <ArrowLeft className="h-3 w-3" /> Back to search
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {trip.title}
            </h1>
            {trip.source === 'ai' ? (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium gap-1 shrink-0">
                <Sparkles className="h-3 w-3" /> AI-Built Trip
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs font-medium gap-1 shrink-0"
              >
                <User className="h-3 w-3" /> Member Trip
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-body mb-4">
            <span>
              Documented by{' '}
              <Link
                to={`/member/${trip.memberId}`}
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                {trip.memberName}
              </Link>
            </span>
            {member && <MemberShieldRating memberId={member.id} compact />}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {trip.countries.map((country, i) => (
                <span key={country}>
                  <Link
                    to={`/results?type=country&value=${encodeURIComponent(country)}`}
                    className="hover:text-accent hover:underline transition-colors"
                  >
                    {country}
                  </Link>
                  {i < trip.countries.length - 1 && ', '}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {trip.totalDays} days
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              {formatCurrency(trip.totalCost)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {trip.classifications.map((cls) => (
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

          {trip.transport && trip.transport.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-body flex items-center gap-1 mr-1">
                <Car className="h-3 w-3" /> Transport:
              </span>
              {trip.transport.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-[10px] font-medium px-2 py-0.5"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Locations */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Locations Visited
              </h2>
              <div className="flex flex-wrap gap-2">
                {trip.locations.map((loc) => (
                  <Link
                    key={loc}
                    to={`/results?type=location&value=${encodeURIComponent(loc)}`}
                    className="bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1.5 rounded-md hover:bg-accent/20 hover:text-accent transition-colors"
                  >
                    {loc}
                  </Link>
                ))}
              </div>
            </section>

            <Separator />

            {/* Description */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Trip Description
              </h2>
              {isSubscriber ? (
                <p className="text-sm text-muted-foreground leading-relaxed font-body whitespace-pre-line">
                  {trip.description}
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
                    {trip.description.slice(0, 200)}...
                  </p>
                  <SubscriberGate feature="Full trip descriptions" />
                </>
              )}
            </section>

            <Separator />

            {/* Itinerary */}
            <section>
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Day-by-Day Itinerary
              </h2>
              {isSubscriber ? (
                trip.itinerary.length > 0 ? (
                  <div className="space-y-4">
                    {trip.itinerary.map((day) => (
                      <div
                        key={day.dayNumber}
                        className="bg-card border border-border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-sm font-semibold text-foreground">
                            Day {day.dayNumber}
                          </h3>
                          <span className="text-xs text-muted-foreground font-body">
                            {formatDate(day.date)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              Locations
                            </p>
                            <p>{day.locations.join(', ')}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              Activities
                            </p>
                            <p>{day.activities.join(', ')}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              Notes
                            </p>
                            <p>{day.notes || '—'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-body">
                    No itinerary details available.
                  </p>
                )
              ) : (
                <SubscriberGate feature="Detailed day-by-day itinerary" />
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Accommodations */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Accommodations
              </h3>
              {isSubscriber ? (
                trip.accommodations.length > 0 ? (
                  <ul className="space-y-3">
                    {trip.accommodations.map((acc, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">
                          {acc.name}
                        </p>
                        <p>
                          {acc.location} · {acc.nights} night
                          {acc.nights !== 1 ? 's' : ''}
                        </p>
                        {acc.url && (
                          <a
                            href={acc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            Visit <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No accommodations listed.
                  </p>
                )
              ) : (
                <SubscriberGate feature="Accommodation details" />
              )}
            </div>

            {/* References */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                External References
              </h3>
              {isSubscriber ? (
                trip.references.length > 0 ? (
                  <ul className="space-y-2">
                    {trip.references.map((ref, i) => (
                      <li key={i}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline inline-flex items-center gap-1"
                        >
                          {ref.label} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {ref.category}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No references listed.
                  </p>
                )
              ) : (
                <SubscriberGate feature="External reference links" />
              )}
            </div>

            {/* Consultancy */}
            {member?.consultancyAvailable && (
              <div className="bg-card border border-accent/30 rounded-lg p-5">
                <h3 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-accent" />
                  Consultancy & Assistance
                </h3>
                <p className="text-xs text-muted-foreground font-body mb-3">
                  The author of this trip is available for consultancy and/or
                  assistance to help you talk through or organise this trip.
                </p>

                <div className="space-y-2 text-xs font-body">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Availability</span>
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
                        <span className="text-muted-foreground">Rate</span>
                        <span className="font-medium text-foreground">
                          {member.consultancyCurrency} {member.consultancyRate}
                          /session
                        </span>
                      </div>
                    )}

                  {member.consultancyDescription && (
                    <p className="text-muted-foreground pt-1 border-t border-border mt-2 leading-relaxed">
                      {member.consultancyDescription}
                    </p>
                  )}
                </div>

                {isSubscriber ? (
                  <Link
                    to={`/member/${member.id}`}
                    className="mt-3 block text-center text-xs font-medium bg-accent text-accent-foreground rounded-md py-2 hover:bg-accent/90 transition-colors"
                  >
                    Contact {member.fullName.split(' ')[0]}
                  </Link>
                ) : (
                  <div className="mt-3">
                    <SubscriberGate feature="Contact trip author" />
                  </div>
                )}
              </div>
            )}

            {/* Rating */}
            <TripStarRating tripId={trip.id} />

            {/* Map */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                Route Map
              </h3>
              <MapErrorBoundary fallbackHeight="280px">
                <TripRouteMap locations={trip.locations} />
              </MapErrorBoundary>
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default TripDetail;
