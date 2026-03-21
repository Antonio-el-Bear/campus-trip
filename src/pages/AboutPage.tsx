import { Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileNavBar from '@/components/MobileNavBar';
import { Globe, Star, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-12 flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            About TravelRecord
          </h1>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Our Mission
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              TravelRecord is a passionate directory for structured travel
              documentation. We provide a knowledge-oriented repository where
              experienced travelers document their journeys with standardized
              data — itineraries, costs, logistics, and assessments — making
              travel knowledge searchable, verifiable, and useful.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              What We Are Not
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              TravelRecord is not a social network, travel blog, or
              photo-sharing platform. We do not support images, videos, or
              unstructured content. Our platform is built for passionate
              travelers who value structured data, reliable documentation, and
              institutional-quality travel records.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              How It Works
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground font-body">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  1.
                </span>
                <span>
                  <strong className="text-foreground">Register</strong> as a
                  member and select your travel specializations (up to 10 trip
                  classifications).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  2.
                </span>
                <span>
                  <strong className="text-foreground">Document</strong> your
                  trips with structured fields: itineraries, accommodations,
                  costs, and references.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  3.
                </span>
                <span>
                  <strong className="text-foreground">Discover</strong> trips
                  and members through our search engine — filter by country,
                  classification, duration, and budget.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  4.
                </span>
                <span>
                  <strong className="text-foreground">Connect</strong> with
                  fellow travelers through our private messaging system
                  (subscribers only).
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Membership Tiers
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  Public Access
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Search trips, view summary cards and limited member previews.
                </p>
              </div>
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  Registered Member{' '}
                  <span className="text-muted-foreground font-normal">
                    (Free)
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Create and manage your profile, document trips, appear in
                  search results.
                </p>
              </div>
              <div className="border border-accent/20 rounded-md p-3 bg-accent/5">
                <h3 className="font-body text-sm font-semibold text-accent">
                  Subscriber (Premium) — $5/year
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Full access to profiles, detailed itineraries, maps, contact
                  info, and private messaging.
                </p>
                <Link to="/subscription">
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs"
                  >
                    Subscribe Now
                  </Button>
                </Link>
              </div>
              <div className="border border-accent/20 rounded-md p-3 bg-primary">
                <h3 className="font-body text-sm font-semibold text-primary-foreground">
                  Priority Listing — $10/slot/year
                </h3>
                <p className="text-xs text-primary-foreground/70 mt-1 mb-2">
                  Boost your trips to the top of search results. Available
                  independently — no subscription required. Each slot covers up
                  to 2 countries and 2 classifications.
                </p>
                <Link to="/subscription">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground font-body text-xs"
                  >
                    Get Priority Listing
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              How Priority Listing Works
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
              TravelRecord offers a{' '}
              <strong className="text-foreground">Priority Listing</strong>{' '}
              subscription that allows registered members to boost the
              visibility of their trips in search results. This is a voluntary,
              paid feature designed to help serious documentarians reach a wider
              audience.
            </p>

            <h3 className="font-body text-sm font-semibold text-foreground mb-2">
              Step by Step
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground font-body mb-4 list-none">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  1.
                </span>
                <span>
                  Go to your{' '}
                  <strong className="text-foreground">Dashboard</strong> and
                  click{' '}
                  <strong className="text-foreground">
                    "Get Priority Listing"
                  </strong>
                  .
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  2.
                </span>
                <span>
                  Purchase{' '}
                  <strong className="text-foreground">Priority Slots</strong> at{' '}
                  <strong className="text-foreground">$10/year each</strong>.
                  Each slot lets you select up to{' '}
                  <strong className="text-foreground">2 countries</strong> and{' '}
                  <strong className="text-foreground">
                    2 trip classifications
                  </strong>
                  . No subscription required.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  3.
                </span>
                <span>
                  Choose which countries and classifications you want to target.
                  These define the search queries where your trips will be
                  prioritised.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  4.
                </span>
                <span>
                  Once active, all your trips matching the selected countries
                  and classifications will appear{' '}
                  <strong className="text-foreground">
                    at the top of search results
                  </strong>
                  , marked with a subtle priority indicator.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  5.
                </span>
                <span>
                  You can purchase{' '}
                  <strong className="text-foreground">additional slots</strong>{' '}
                  to cover more countries and classifications.
                </span>
              </li>
            </ol>

            <h3 className="font-body text-sm font-semibold text-foreground mb-2">
              Key Details
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-body mb-4">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  Subscriptions are billed annually with{' '}
                  <strong className="text-foreground">no auto-renewal</strong> —
                  full transparency, no surprises.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  Priority listing does not affect trip content, ratings, or
                  shield scores — it only boosts placement in search results.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  Combined with{' '}
                  <strong className="text-foreground">paid consultancy</strong>,
                  priority listing helps you reach travellers actively searching
                  for expertise in your specialised destinations and trip types.
                </span>
              </li>
            </ul>

            <h3 className="font-body text-sm font-semibold text-foreground mb-2">
              When Multiple Members Target the Same Country or Classification
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-body mb-3">
              There is no limit to how many members can hold a priority slot for
              the same country or classification. When multiple members target
              the same search criteria, their prioritised trips all appear above
              standard results. The order among priority-listed trips is
              determined as follows:
            </p>
            <ol className="space-y-2 text-sm text-muted-foreground font-body mb-4 list-none">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  1.
                </span>
                <span>
                  <strong className="text-foreground">Shield Rating</strong> —
                  Members with a higher shield rating (1–5 shields) are ranked
                  first among priority results.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  2.
                </span>
                <span>
                  <strong className="text-foreground">Trip Count</strong> — If
                  shield ratings are equal, the member with more documented
                  trips is ranked higher.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  3.
                </span>
                <span>
                  <strong className="text-foreground">Member Rating</strong> —
                  If still tied, the average member rating (as given by other
                  members) is used as a tiebreaker.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[24px]">
                  4.
                </span>
                <span>
                  <strong className="text-foreground">Subscription Date</strong>{' '}
                  — As a final tiebreaker, the member who subscribed earliest is
                  placed first.
                </span>
              </li>
            </ol>
            <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
              This ranking system rewards members who invest in building a
              strong, well-documented travel record. Priority listing guarantees
              visibility above standard results, but the position among other
              priority members is earned through merit and activity on the
              platform.
            </p>

            <h3 className="font-body text-sm font-semibold text-foreground mb-2">
              Technical Transparency
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  <strong className="text-foreground">Matching logic:</strong> A
                  trip is boosted when the search query includes at least one
                  country <em>and/or</em> one classification that matches the
                  member's active priority slot. Partial matches count — you do
                  not need to match all 2 countries and all 2 classifications.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  <strong className="text-foreground">
                    No bidding system:
                  </strong>{' '}
                  Priority listing is a flat-rate fee (€35/year per slot). There
                  is no auction, no pay-per-click, and no variable pricing. All
                  priority members pay the same amount.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  <strong className="text-foreground">No exclusivity:</strong>{' '}
                  Multiple members can hold priority slots for the same
                  countries and classifications. TravelRecord does not limit or
                  cap the number of priority members per category.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  <strong className="text-foreground">
                    Slot independence:
                  </strong>{' '}
                  Each slot operates independently. If you purchase two slots,
                  each with its own set of countries and classifications, they
                  do not combine — each one applies separately to its own
                  matching criteria.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-[6px]">
                  •
                </span>
                <span>
                  <strong className="text-foreground">Expiration:</strong> Slots
                  expire exactly 12 months after purchase. There is no
                  auto-renewal. A notification is sent before expiration, and
                  the member can manually renew if desired.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground font-body">
                  Ready to boost your trips?
                </span>
              </div>
              <Link to="/subscription">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs"
                >
                  Get Priority Listing
                </Button>
              </Link>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Monetise Your Expertise
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
              TravelRecord provides several avenues for experienced travelers to
              monetise their knowledge and documentation:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  Travel Consultancy
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Offer paid consultancy services directly through your member
                  profile. Set your hourly or per-trip rate, describe your areas
                  of expertise, and let subscribers contact you for personalised
                  travel advice.
                </p>
              </div>
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  Priority Visibility
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Invest in priority listing slots to ensure your documented
                  trips appear prominently when users search for your
                  specialised countries and classifications — ideal for
                  professionals and travel consultants.
                </p>
              </div>
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  Reputation Building
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Build a data-driven portfolio of travel experience. Your
                  shield rating, trip count, and member ratings serve as
                  credibility signals that attract subscribers and consultancy
                  clients.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card border-2 border-accent/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                AI Trip Builder
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
              Premium subscribers have access to the{' '}
              <strong className="text-foreground">AI Trip Builder</strong> — an
              intelligent tool that generates complete, research-based travel
              plans from simple inputs.
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  How It Works
                </h3>
                <ol className="space-y-1.5 text-xs text-muted-foreground font-body mt-1 list-none">
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground min-w-[20px]">
                      1.
                    </span>{' '}
                    Enter your departure location, destination, and preferred
                    transport type.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground min-w-[20px]">
                      2.
                    </span>{' '}
                    Set the total trip duration (including travel days) and
                    select your tourism classification (cultural, gastronomy,
                    adventure, etc.).
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground min-w-[20px]">
                      3.
                    </span>{' '}
                    Define your maximum budget per person and currency.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground min-w-[20px]">
                      4.
                    </span>{' '}
                    Click "Generate Trip Proposal" — the AI produces a complete
                    travel plan.
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">
                  What You Get
                </h3>
                <ul className="space-y-1 text-xs text-muted-foreground font-body mt-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-accent mt-0.5 shrink-0" />{' '}
                    Structured day-by-day itinerary with activities,
                    attractions, and logistics
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-accent mt-0.5 shrink-0" /> Up
                    to 5 accommodation options per night across varied price
                    ranges
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-accent mt-0.5 shrink-0" /> 5
                    food recommendations per day matched to your tourism type
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-accent mt-0.5 shrink-0" />{' '}
                    Complete budget breakdown (transport, accommodation, food,
                    activities)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-accent mt-0.5 shrink-0" />{' '}
                    Practical travel tips for your specific destination
                  </li>
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground font-body mb-3">
                  Included with Premium Membership (€35/year). No additional
                  cost per trip generated.
                </p>
                <Link to="/ai-trip-builder">
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs"
                  >
                    <Sparkles className="h-3 w-3 mr-1.5" /> Launch AI Trip
                    Builder
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Disclaimer
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              TravelRecord is not involved in the consultancy, organisation, or
              execution of any trip. All consultancy and assistance arrangements
              are exclusively between the trip author and the client.
              TravelRecord bears no responsibility for any outcomes, disputes,
              or issues arising from such consultancy or assistance. The sole
              role of TravelRecord is to display trips, present trip authors,
              and facilitate contact between them and other registered members.
            </p>
          </section>
        </div>
      </div>

      <MobileNavBar />
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
