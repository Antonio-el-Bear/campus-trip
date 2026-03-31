import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  FileText,
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  Package,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileNavBar from '@/components/MobileNavBar';
import TripCard from '@/components/TripCard';
import MemberCard from '@/components/MemberCard';
import { MOCK_TRIPS, MOCK_MEMBERS } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';


const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredTrips, setFeaturedTrips] = useState(MOCK_TRIPS.slice(0, 3));
  const [featuredMembers, setFeaturedMembers] = useState(MOCK_MEMBERS.slice(0, 3));
  const navigate = useNavigate();

  // Add missing handleSearch function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    // Fetch trips from Supabase
    (async () => {
      const { data: tripsData, error: tripsError } = await supabase
        .from('ai_trips')
        .select('id, title, user_id, trip_data')
        .order('created_at', { ascending: false })
        .limit(3);
      if (tripsData && tripsData.length > 0) {
        // Map Supabase data to TripCard props (adjust as needed)
        setFeaturedTrips(
          tripsData.map((t) => ({
            id: t.id,
            title: t.title,
            ...((t.trip_data || {}) as any),
          }))
        );
      }
      // else fallback to mock (already set)
    })();

    // Fetch members from Supabase (if you have a members table, adjust accordingly)
    // For now, fallback to mock members
    // Example:
    // const { data: membersData } = await supabase.from('members').select('*').limit(3);
    // if (membersData && membersData.length > 0) setFeaturedMembers(membersData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 md:py-20">
          <div className="mb-10">
            <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-4">
              Passionate Travel Directory
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
              Structured Travel
              <br />
              Documentation
            </h1>
            <p className="text-sm md:text-base font-body text-primary-foreground/80 max-w-2xl leading-relaxed">
              Not a travel blog or social network — a platform where passionate,
              serious travelers document their journeys.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-xs font-body text-primary-foreground/60">
              {[
                'Structured Travel Knowledge Repository',
                'Comprehensive Trip Records',
                'Access to Experienced Travellers',
                'Practical Trip Planning Support',
                'Searchable and Decision-Oriented',
                'Professional Information Environment',
                'Direct Expert Engagement',
                'Monetise Your Travel Expertise',
                'AI-Powered Trip Builder',
              ].map((title) => (
                <span key={title} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
                  {title === 'Monetise Your Travel Expertise' ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="bg-accent/20 text-accent font-semibold px-3 py-1 rounded-md border border-accent/40 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-xs">
                          {title}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display text-lg">
                            Monetise Your Travel Expertise
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-sm text-muted-foreground font-body">
                          <p className="leading-relaxed">
                            TravelRecord provides several avenues for
                            experienced travelers to turn their knowledge and
                            documentation into income.
                          </p>

                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              Travel Consultancy
                            </h3>
                            <p className="text-xs leading-relaxed">
                              Offer paid consultancy services directly through
                              your member profile. Set your hourly or per-trip
                              rate, describe your areas of expertise, and let
                              subscribers contact you for personalised travel
                              advice. You control the pricing and scope of your
                              services.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              Priority Listing
                            </h3>
                            <p className="text-xs leading-relaxed">
                              Invest in priority listing slots (€35/slot/year)
                              to ensure your documented trips appear prominently
                              when users search for your specialised countries
                              and classifications. Each slot covers up to 2
                              countries and 2 trip classifications. Ideal for
                              professionals and travel consultants who want
                              maximum visibility.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              Reputation Building
                            </h3>
                            <p className="text-xs leading-relaxed">
                              Build a data-driven portfolio of travel
                              experience. Your shield rating (1–5), trip count,
                              and member ratings serve as credibility signals
                              that attract subscribers and consultancy clients.
                              The more you document, the stronger your
                              professional profile becomes.
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              How It Works Together
                            </h3>
                            <p className="text-xs leading-relaxed">
                              Document your trips → build your shield rating →
                              activate consultancy on your profile → boost
                              visibility with priority listing. Subscribers
                              discover your expertise through search, view your
                              detailed trip records, and contact you directly
                              for paid guidance.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border">
                            <Link
                              to="/subscription"
                              className="text-xs font-semibold text-accent hover:underline"
                            >
                              View Subscription & Priority Listing →
                            </Link>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : title === 'AI-Powered Trip Builder' ? (
                    <Link
                      to="/ai-trip-builder"
                      className="bg-accent/20 text-accent font-semibold px-3 py-1 rounded-md border border-accent/40 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-xs"
                    >
                      {title}
                    </Link>
                  ) : (
                    <span className="text-primary-foreground/70 font-medium">
                      {title}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, trips, members..."
                className="pl-9 bg-card text-card-foreground border-border font-body"
              />
            </div>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-gold-dark font-body"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { icon: FileText, label: 'Documented Trips', value: '2,840+' },
              { icon: Users, label: 'Registered Members', value: '1,120+' },
              { icon: Globe, label: 'Countries Covered', value: '147' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center px-4">
                <Icon className="h-4 w-4 text-accent mx-auto mb-1.5" />
                <p className="font-display text-xl font-bold text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured trips */}
      <section className="py-14">
        <div className="container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
                Recently Documented
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Featured Trips
              </h2>
            </div>
            <Link
              to="/search"
              className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 font-body"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTrips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-14 bg-secondary/30">
        <div className="container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
                Experienced Authors
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Featured Trip Authors
              </h2>
            </div>
            <Link
              to="/directory"
              className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 font-body"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredMembers.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription & Priority Listing */}
      <section className="py-14 border-b border-border">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
              Membership Options
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Subscribe, Boost, or Both
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-lg mx-auto">
              Three flexible options — subscribe, boost your trips, or get both
              in a single checkout.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subscription */}
            <div className="bg-card border-2 border-border rounded-lg p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-accent" />
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent">
                  Subscription
                </p>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Premium Membership
              </h2>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-1">
                Full access to member profiles, detailed itineraries, travel
                maps, contact information, and private messaging. No priority
                listing required.
              </p>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    €35
                    <span className="text-sm font-normal text-muted-foreground">
                      /year
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body">
                    One-time annual payment · No auto-renewal
                  </p>
                </div>
              </div>
              <Link to="/subscription">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
                  Subscribe Now
                </Button>
              </Link>
            </div>

            {/* Priority Listing */}
            <div className="bg-primary rounded-lg p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-accent" />
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent">
                  Priority Listing
                </p>
              </div>
              <h2 className="font-display text-xl font-bold text-primary-foreground mb-2">
                Boost Your Trips in Search
              </h2>
              <p className="text-sm text-primary-foreground/70 font-body leading-relaxed mb-4 flex-1">
                Get your documented trips to the top of search results. Reach
                more travellers, attract consultancy enquiries, and monetise
                your expertise. No subscription required.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-primary-foreground/60 font-body mb-4">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" /> Top
                  placement
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-accent" /> 2 countries + 2
                  classifications/slot
                </span>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="font-display text-2xl font-bold text-primary-foreground">
                    €35
                    <span className="text-sm font-normal text-primary-foreground/60">
                      /slot/year
                    </span>
                  </p>
                  <p className="text-[10px] text-primary-foreground/40 font-body">
                    Independent from subscription · Add as many slots as needed
                  </p>
                </div>
              </div>
              <Link to="/subscription">
                <Button
                  variant="outline"
                  className="w-full border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground font-body text-sm"
                >
                  Get Priority Listing
                </Button>
              </Link>
            </div>

            {/* Both */}
            <div className="bg-card border-2 border-accent/50 rounded-lg p-6 md:p-8 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground font-body text-[10px] px-2">
                  Best Value
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-accent" />
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent">
                  Both
                </p>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Subscribe + Boost
              </h2>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-1">
                Get premium membership and priority listing together in a single
                checkout. Full access plus top placement in search results.
              </p>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    €70
                    <span className="text-sm font-normal text-muted-foreground">
                      +/year
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body">
                    €35 subscription + €35/slot · One checkout
                  </p>
                </div>
              </div>
              <Link to="/subscription">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
                  Get Both
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Trip Builder CTA */}
      <section className="py-14 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-accent" />
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent">
                  Premium Feature
                </p>
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">
                AI Trip Builder
              </h2>
              <p className="text-sm text-primary-foreground/70 font-body leading-relaxed mb-4">
                Design your ideal trip and let AI generate a complete,
                research-based travel plan. Input your departure, destination,
                transport, budget, and tourism preferences — and receive an
                optimized day-by-day itinerary with accommodation options, food
                recommendations, budget breakdown, and practical travel tips.
              </p>
              <ul className="space-y-1.5 text-xs text-primary-foreground/60 font-body mb-5">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent" /> Structured
                  day-by-day itinerary with activities & logistics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent" /> Up to 5
                  accommodation options per night at varied price ranges
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent" /> 5 food
                  recommendations per day matched to your tourism type
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent" /> Budget-aligned cost
                  breakdown and practical travel tips
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent" /> Included with
                  Premium Membership (€35/year)
                </li>
              </ul>
              <Link to="/ai-trip-builder">
                <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body">
                  <Sparkles className="h-4 w-4 mr-2" /> Launch AI Trip Builder
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-14">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Document Your Travel Experience
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 font-body leading-relaxed">
            Create a structured record of your journeys. Share itineraries,
            costs, and logistics with a passionate community of experienced
            travelers.
          </p>
          <Link to="/register">
            <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body">
              Register as a Member
            </Button>
          </Link>
        </div>
      </section>

      {/* What We Offer – detailed explanations */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            What We Offer
          </p>
          <h2 className="font-display text-2xl font-bold mb-8">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {[
              {
                title: 'Structured Travel Knowledge Repository',
                desc: 'An organized platform that documents travel experiences curated by passionate travellers and independent travel consultants.',
              },
              {
                title: 'Comprehensive Trip Records',
                desc: 'Members can explore detailed travel documentation including itineraries, cost, attractions, logistics, and practical planning information.',
              },
              {
                title: 'Access to Experienced Travellers',
                desc: 'Engage with individuals who have completed the documented trips and may be available to provide guidance or consultation, either voluntarily or for a fee.',
              },
              {
                title: 'Practical Trip Planning Support',
                desc: 'The platform supports users in designing and organizing personalized travel experiences.',
              },
              {
                title: 'Searchable and Decision-Oriented',
                desc: 'Trips are systematically presented and searchable by relevant criteria, enabling users to identify suitable travel experiences efficiently.',
              },
              {
                title: 'Professional Information Environment',
                desc: 'The platform is not a social network, blog, or storytelling space. Its primary purpose is the structured presentation of travel knowledge to support informed travel decision-making.',
              },
              {
                title: 'Direct Expert Engagement',
                desc: 'Where appropriate, users may contact the authors of documented travel experiences for practical insights and expert guidance.',
              },
              {
                title: 'Monetise Your Travel Expertise',
                desc: 'Experienced travelers can offer paid consultancy services through their profile, set hourly or per-trip rates, and use priority listing to boost visibility. Combined with a strong shield rating and documented trip history, the platform helps turn travel knowledge into a credible, data-driven portfolio that attracts clients and subscribers.',
              },
              {
                title: 'AI-Powered Trip Builder',
                desc: 'Premium subscribers can use our AI Trip Builder to generate complete, research-based travel plans. Input your departure, destination, transport type, tourism classification, and budget — and receive a structured day-by-day itinerary with accommodation options, food recommendations, budget breakdown, and practical travel tips.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="border-l-2 border-accent/40 pl-3">
                <p className="font-semibold text-primary-foreground text-sm mb-0.5">
                  {title}
                </p>
                <p className="text-primary-foreground/60 text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileNavBar />
      <SiteFooter />
    </div>
  );
};

export default Index;
