import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  User,
  MessageSquare,
  Settings,
  Plus,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Pencil,
  Package,
  Sparkles,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileNavBar from '@/components/MobileNavBar';
import TripCard from '@/components/TripCard';
import MemberAvatar from '@/components/MemberAvatar';
import { MOCK_MEMBERS, MOCK_TRIPS, formatDate } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DashboardPage = () => {
  // Simulate logged-in member (first member for demo)
  const member = MOCK_MEMBERS[0];
  const memberTrips = MOCK_TRIPS.filter((t) => t.memberId === member.id);

  // AI trips from database
  const [aiTrips, setAiTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchAiTrips = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = (await supabase
        .from('ai_trips')
        .select('*')
        .order('created_at', { ascending: false })) as any;
      if (data) setAiTrips(data);
    };
    fetchAiTrips();
  }, []);

  const handleDeleteAiTrip = async (tripId: string) => {
    await (supabase.from('ai_trips') as any).delete().eq('id', tripId);
    setAiTrips((prev) => prev.filter((t) => t.id !== tripId));
    toast({
      title: 'AI trip deleted',
      description: 'The trip has been removed from your archive.',
    });
  };

  // Consultancy state
  const [isEditing, setIsEditing] = useState(false);
  const [consultancyAvailable, setConsultancyAvailable] = useState(
    member.consultancyAvailable
  );
  const [consultancyType, setConsultancyType] = useState(
    member.consultancyType
  );
  const [consultancyRate, setConsultancyRate] = useState(
    member.consultancyRate?.toString() || ''
  );
  const [consultancyCurrency, setConsultancyCurrency] = useState(
    member.consultancyCurrency
  );
  const [consultancyDescription, setConsultancyDescription] = useState(
    member.consultancyDescription || ''
  );

  const handleSaveConsultancy = () => {
    setIsEditing(false);
    toast({
      title: 'Consultancy settings updated',
      description: 'Your consultancy preferences have been saved.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <MemberAvatar
              currentUrl={member.avatarUrl}
              memberId={member.id}
              fallbackInitials={member.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
              size="lg"
              editable
              onUploaded={(url) =>
                toast({
                  title: 'Photo updated',
                  description: 'Your profile picture has been saved.',
                })
              }
            />
            <div>
              <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
                Dashboard
              </p>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Welcome, {member.fullName.split(' ')[0]}
              </h1>
              <p className="text-sm text-muted-foreground font-body mt-1">
                Member since {formatDate(member.joinedDate)}
              </p>
            </div>
          </div>
          <Link to="/trip/new">
            <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
              <Plus className="h-4 w-4 mr-1.5" /> New Trip
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: FileText,
              label: 'Trips Documented',
              value: memberTrips.length,
            },
            {
              icon: User,
              label: 'Countries Visited',
              value: member.countriesVisited.length,
            },
            { icon: MessageSquare, label: 'Messages', value: 3 },
            { icon: Settings, label: 'Profile Views', value: 142 },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-lg p-4"
            >
              <Icon className="h-4 w-4 text-accent mb-2" />
              <p className="font-display text-xl font-bold text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground font-body">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Link
            to={`/member/${member.id}`}
            className="bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-colors"
          >
            <h3 className="font-display text-sm font-semibold text-foreground mb-1">
              View Profile
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              See your public profile as others see it.
            </p>
          </Link>
          <Link
            to="/messages"
            className="bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-colors"
          >
            <h3 className="font-display text-sm font-semibold text-foreground mb-1">
              Messages
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              View and send private messages.
            </p>
          </Link>
          <Link
            to="/trip/new"
            className="bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-colors"
          >
            <h3 className="font-display text-sm font-semibold text-foreground mb-1">
              New Trip
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Document a new travel experience.
            </p>
          </Link>
          <Link
            to="/ai-trip-builder"
            className="bg-card border-2 border-accent/30 rounded-lg p-4 hover:border-accent/50 transition-colors"
          >
            <h3 className="font-display text-sm font-semibold text-accent mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Trip Builder
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Generate a complete travel plan with AI.
            </p>
          </Link>
          <Link
            to="/subscription"
            className="bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-colors"
          >
            <h3 className="font-display text-sm font-semibold text-foreground mb-1">
              ⭐ Subscription & Priority
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              Subscribe, boost trips, or get both in one checkout.
            </p>
          </Link>
        </div>

        {/* Consultancy Settings Card */}
        <div className="bg-card border border-border rounded-lg p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Consultancy & Assistance
              </h2>
            </div>
            {!isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-xs font-body gap-1"
              >
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">
                    Available for Consultancy
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Let travellers contact you for trip guidance
                  </p>
                </div>
                <Switch
                  checked={consultancyAvailable}
                  onCheckedChange={setConsultancyAvailable}
                />
              </div>

              {consultancyAvailable && (
                <>
                  <div>
                    <Label className="text-xs font-medium">Type</Label>
                    <Select
                      value={consultancyType}
                      onValueChange={(v) =>
                        setConsultancyType(v as 'free' | 'paid' | 'both')
                      }
                    >
                      <SelectTrigger className="mt-1 font-body text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="both">Both (Free & Paid)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(consultancyType === 'paid' ||
                    consultancyType === 'both') && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium">
                          Rate per Session
                        </Label>
                        <Input
                          type="number"
                          value={consultancyRate}
                          onChange={(e) => setConsultancyRate(e.target.value)}
                          placeholder="e.g. 45"
                          className="mt-1 font-body"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Currency</Label>
                        <Select
                          value={consultancyCurrency}
                          onValueChange={setConsultancyCurrency}
                        >
                          <SelectTrigger className="mt-1 font-body text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CHF">CHF</SelectItem>
                            <SelectItem value="AUD">AUD (A$)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs font-medium">Description</Label>
                    <Textarea
                      value={consultancyDescription}
                      onChange={(e) =>
                        setConsultancyDescription(e.target.value)
                      }
                      placeholder="Describe the consultancy and assistance you offer..."
                      className="mt-1 font-body"
                      rows={2}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleSaveConsultancy}
                  className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="font-body text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {consultancyAvailable ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {consultancyType === 'free' && 'Free'}
                      {consultancyType === 'paid' && 'Paid'}
                      {consultancyType === 'both' && 'Free & Paid'}
                    </Badge>
                    {(consultancyType === 'paid' ||
                      consultancyType === 'both') &&
                      consultancyRate && (
                        <span className="text-xs font-medium text-foreground font-body">
                          {consultancyCurrency} {consultancyRate}/session
                        </span>
                      )}
                  </div>
                  {consultancyDescription && (
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">
                      {consultancyDescription}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground font-body">
                  Consultancy is currently <strong>disabled</strong>. Enable it
                  to let travellers contact you for guidance on your trips.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Subscription & Priority — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Subscription */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-foreground mb-2">
                  Premium Subscription — €35/year
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
                  Unlock full access to member profiles, detailed itineraries,
                  travel maps, contact information, and private messaging.
                </p>
                <Link to="/subscription">
                  <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
                    Subscribe — €35/year
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Priority Listing */}
          <div className="bg-primary border border-accent/20 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-primary-foreground mb-2">
                  Priority Listing — €35/slot/year
                </h3>
                <p className="text-sm text-primary-foreground/70 font-body leading-relaxed mb-3">
                  Boost your trips to the top of search results. Each slot
                  covers up to 2 countries and 2 classifications. Fully
                  independent from subscription.
                </p>
                <Link to="/subscription">
                  <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
                    Get Priority Listing — €35/slot
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Both */}
          <div className="bg-card border-2 border-accent/50 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent text-accent-foreground font-body text-[10px] px-2">
                Best Value
              </Badge>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-foreground mb-2">
                  Both — From €100/year
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
                  Get subscription + priority listing in a single checkout. Full
                  access plus top search placement.
                </p>
                <Link to="/subscription">
                  <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
                    Get Both
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* My Trips */}
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Your Trips
          </h2>
          {memberTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memberTrips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground font-body mb-3">
                You haven't documented any trips yet.
              </p>
              <Link to="/trip/new">
                <Button className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm">
                  Create Your First Trip
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* AI Trips Archive */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Your AI-Built Trips
            </h2>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
              Private
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-4">
            These trips are only visible to you. They are generated by AI and
            saved to your personal archive.
          </p>
          {aiTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-card border border-border rounded-lg p-5 relative group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium gap-1">
                        <Sparkles className="h-2.5 w-2.5" /> AI-Built
                      </Badge>
                      <h3 className="font-display text-sm font-semibold text-card-foreground leading-snug">
                        {trip.title}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-7 w-7 p-0"
                      onClick={() => handleDeleteAiTrip(trip.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {trip.trip_data?.countries && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {trip.trip_data.countries.join(', ')}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />
                    Generated {new Date(trip.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card border border-border rounded-lg">
              <Sparkles className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-body mb-3">
                No AI-built trips yet.
              </p>
              <Link to="/ai-trip-builder">
                <Button variant="outline" className="font-body text-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Build Your First
                  AI Trip
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <MobileNavBar />
      <SiteFooter />
    </div>
  );
};

export default DashboardPage;
