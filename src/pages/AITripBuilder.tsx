import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  MapPin,
  Utensils,
  Hotel,
  Lightbulb,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  X,
  ExternalLink,
  AlertTriangle,
  Train,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClassificationPicker from '@/components/ClassificationPicker';
import { supabase } from '@/integrations/supabase/client';
import { getClassificationLabel } from '@/lib/mockData';
import { COUNTRIES_LIST } from '@/lib/countries';
import CountryPicker from '@/components/CountryPicker';

const TRANSPORT_TYPES = [
  { value: 'flight', label: 'Flight' },
  { value: 'train', label: 'Train' },
  { value: 'bus', label: 'Bus' },
  { value: 'ship', label: 'Ship / Boat' },
  { value: 'car', label: 'Car' },
  { value: 'motorbike', label: 'Motorbike' },
  { value: 'other', label: 'Other' },
];

const CURRENCY_OPTIONS = ['EUR', 'USD', 'GBP', 'CHF', 'AUD', 'CAD', 'JPY'];

interface TripPlan {
  title: string;
  description: string;
  countries: string[];
  locations: string[];
  transport: string[];
  totalCost: number;
  mainTransportLinks: { service: string; url: string; notes: string }[];
  itinerary: {
    dayNumber: number;
    locations: string[];
    attractions: string[];
    activities: string[];
    notes: string;
    transportBetweenLocations: {
      from: string;
      to: string;
      mode: string;
      service: string;
      url: string;
      duration: string;
      cost: number;
    }[];
    accommodations: {
      name: string;
      location: string;
      pricePerNight: number;
      url: string;
    }[];
    foodRecommendations: {
      name: string;
      cuisine: string;
      priceRange: string;
      notes: string;
      url: string;
    }[];
  }[];
  budgetBreakdown: {
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    other: number;
    total: number;
  };
  tips: string[];
}

const AITripBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [departure, setDeparture] = useState('');
  const [destinations, setDestinations] = useState<
    { country: string; cities: string }[]
  >([{ country: '', cities: '' }]);
  const [transportType, setTransportType] = useState('');
  const [customTransport, setCustomTransport] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [tourismTypes, setTourismTypes] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Result state
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  const toggleTourismType = (value: string) => {
    setTourismTypes((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 3) return prev;
      return [...prev, value];
    });
  };

  const addDestination = () => {
    setDestinations((prev) => [...prev, { country: '', cities: '' }]);
  };

  const removeDestination = (index: number) => {
    if (destinations.length <= 1) return;
    setDestinations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDestination = (
    index: number,
    field: 'country' | 'cities',
    value: string
  ) => {
    setDestinations((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validDestinations = destinations.filter((d) => d.country);
    if (
      !departure ||
      validDestinations.length === 0 ||
      !transportType ||
      !totalDays ||
      tourismTypes.length === 0 ||
      !maxBudget
    ) {
      toast({
        title: 'Missing fields',
        description:
          'Please fill in all required fields including at least one destination country.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setTripPlan(null);

    try {
      const transport =
        transportType === 'other'
          ? customTransport || 'Other'
          : TRANSPORT_TYPES.find((t) => t.value === transportType)?.label ||
            transportType;

      const destinationText = validDestinations
        .map((d) => (d.cities ? `${d.cities} (${d.country})` : d.country))
        .join('; ');

      const { data, error } = await supabase.functions.invoke(
        'ai-trip-builder',
        {
          body: {
            departure,
            destination: destinationText,
            destinations: validDestinations,
            transportType: transport,
            totalDays: parseInt(totalDays),
            tourismTypes: tourismTypes.map(getClassificationLabel),
            maxBudget: parseFloat(maxBudget),
            currency,
            additionalNotes,
          },
        }
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setTripPlan(data.tripPlan);

      // Auto-save to user's archive
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('ai_trips').insert({
          user_id: user.id,
          title:
            data.tripPlan.title ||
            `Trip to ${validDestinations.map((d) => d.country).join(', ')}`,
          trip_data: data.tripPlan,
          form_inputs: {
            departure,
            destinations: validDestinations,
            transportType: transport,
            totalDays: parseInt(totalDays),
            tourismTypes,
            maxBudget: parseFloat(maxBudget),
            currency,
            additionalNotes,
          },
        } as any);
      }

      toast({
        title: 'Trip generated!',
        description:
          'Your AI-powered travel plan is ready and saved to your archive.',
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      toast({
        title: 'Generation failed',
        description: err.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-6 font-body"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            AI Trip Builder
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Design your ideal trip and let AI generate a complete, research-based
          travel plan.
        </p>

        <Alert className="mb-8 border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Disclaimer:</strong> This trip
            proposal is generated entirely by artificial intelligence and is
            provided for informational and inspirational purposes only. All
            information — including prices, availability, URLs, transport
            schedules, accommodation details, and restaurant recommendations —
            must be independently verified by the user before making any booking
            or travel decision. TravelRecord and its owners cannot guarantee the
            accuracy, completeness, or reliability of any AI-generated content
            and accept no responsibility or liability for any loss, expense, or
            inconvenience arising from the use of this tool.
          </AlertDescription>
        </Alert>

        {!tripPlan ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Travel logistics */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  Travel & Destination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium">
                    Departure Location *
                  </Label>
                  <Input
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="mt-1 font-body"
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Label className="text-xs font-medium">
                        Destinations *
                      </Label>
                      <p className="text-[10px] text-muted-foreground">
                        Add all countries and cities you want to visit
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDestination}
                      className="font-body text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Destination
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {destinations.map((dest, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                          <div>
                            <Label className="text-[10px] font-medium text-muted-foreground">
                              Country
                            </Label>
                            <Select
                              value={dest.country}
                              onValueChange={(v) =>
                                updateDestination(index, 'country', v)
                              }
                            >
                              <SelectTrigger className="mt-1 font-body text-sm">
                                <SelectValue placeholder="Select country..." />
                              </SelectTrigger>
                              <SelectContent className="bg-popover z-50 max-h-60">
                                {COUNTRIES_LIST.map((c) => (
                                  <SelectItem
                                    key={c}
                                    value={c}
                                    className="text-xs"
                                  >
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-[10px] font-medium text-muted-foreground">
                              Cities / Regions (optional)
                            </Label>
                            <Input
                              value={dest.cities}
                              onChange={(e) =>
                                updateDestination(
                                  index,
                                  'cities',
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Tokyo, Kyoto, Osaka"
                              className="mt-1 font-body text-sm"
                            />
                          </div>
                        </div>
                        {destinations.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDestination(index)}
                            className="text-destructive h-8 w-8 p-0 mt-5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {destinations.filter((d) => d.country).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {destinations
                        .filter((d) => d.country)
                        .map((d, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {d.country}
                            {d.cities ? `: ${d.cities}` : ''}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium">
                      Transport Type *
                    </Label>
                    <Select
                      value={transportType}
                      onValueChange={setTransportType}
                    >
                      <SelectTrigger className="mt-1 font-body">
                        <SelectValue placeholder="Select transport..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {TRANSPORT_TYPES.map((t) => (
                          <SelectItem
                            key={t.value}
                            value={t.value}
                            className="text-sm"
                          >
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {transportType === 'other' && (
                      <Input
                        value={customTransport}
                        onChange={(e) => setCustomTransport(e.target.value)}
                        placeholder="Specify transport..."
                        className="mt-2 font-body text-sm"
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-medium">
                      Total Days (incl. travel) *
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={90}
                      value={totalDays}
                      onChange={(e) => setTotalDays(e.target.value)}
                      placeholder="e.g. 10"
                      className="mt-1 font-body"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tourism Type */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  Tourism Classification *
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Select up to 3 · {tourismTypes.length}/3 selected
                </p>
              </CardHeader>
              <CardContent>
                <ClassificationPicker
                  selected={tourismTypes}
                  onToggle={toggleTourismType}
                  max={3}
                  placeholder="Select tourism type..."
                />
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium">
                      Max Budget Per Person *
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="e.g. 2500"
                      className="mt-1 font-body"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="mt-1 font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {CURRENCY_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any preferences, dietary requirements, mobility considerations, must-see places..."
                  rows={3}
                  className="font-body"
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-display text-base font-semibold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Your Trip Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Trip Proposal
                </>
              )}
            </Button>
          </form>
        ) : (
          <TripPlanResult
            plan={tripPlan}
            currency={currency}
            transportType={
              transportType === 'other'
                ? customTransport || 'Other'
                : TRANSPORT_TYPES.find((t) => t.value === transportType)
                    ?.label || transportType
            }
            onReset={() => setTripPlan(null)}
          />
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

/* ─── Result Display ─── */

const TripPlanResult = ({
  plan,
  currency,
  transportType,
  onReset,
}: {
  plan: TripPlan;
  currency: string;
  transportType: string;
  onReset: () => void;
}) => {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {plan.title}
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {plan.countries?.map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px]">
                {c}
              </Badge>
            ))}
            {plan.transport?.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px]">
                {t}
              </Badge>
            ))}
            <Badge className="text-[10px] bg-accent/10 text-accent border-accent/20 gap-1">
              <Train className="h-2.5 w-2.5" /> Preferred: {transportType}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="font-body text-xs"
        >
          Build Another Trip
        </Button>
      </div>

      <Alert className="border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-xs text-muted-foreground">
          <strong className="text-foreground">Reminder:</strong> All details
          below are AI-generated. Please verify prices, availability, and links
          independently before booking.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground font-body leading-relaxed whitespace-pre-line">
            {plan.description}
          </p>
        </CardContent>
      </Card>

      {/* Main Transport Links */}
      {plan.mainTransportLinks && plan.mainTransportLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Train className="h-4 w-4 text-accent" /> Main Transport to
              Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.mainTransportLinks.map((link, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded p-2 text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {link.service}
                    </p>
                    <p className="text-muted-foreground">{link.notes}</p>
                  </div>
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 ml-2 shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Breakdown */}
      {plan.budgetBreakdown && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" /> Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Transport', val: plan.budgetBreakdown.transport },
                {
                  label: 'Accommodation',
                  val: plan.budgetBreakdown.accommodation,
                },
                { label: 'Food', val: plan.budgetBreakdown.food },
                { label: 'Activities', val: plan.budgetBreakdown.activities },
                { label: 'Other', val: plan.budgetBreakdown.other },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-secondary/50 rounded-md p-3 text-center"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="font-display font-semibold text-foreground text-sm">
                    {fmt(item.val || 0)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right">
              <span className="text-xs text-muted-foreground">Total: </span>
              <span className="font-display font-bold text-foreground">
                {fmt(plan.budgetBreakdown.total || plan.totalCost || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day-by-Day Itinerary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" /> Day-by-Day Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="day-1">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
              {plan.itinerary?.map((day) => (
                <TabsTrigger
                  key={day.dayNumber}
                  value={`day-${day.dayNumber}`}
                  className="text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  Day {day.dayNumber}
                </TabsTrigger>
              ))}
            </TabsList>

            {plan.itinerary?.map((day) => (
              <TabsContent
                key={day.dayNumber}
                value={`day-${day.dayNumber}`}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground text-xs mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Locations
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {day.locations?.join(', ') || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-xs mb-1">
                      Attractions
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {day.attractions?.join(', ') || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-xs mb-1">
                      Activities
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {day.activities?.join(', ') || '—'}
                    </p>
                  </div>
                </div>

                {day.notes && (
                  <p className="text-xs text-muted-foreground bg-secondary/30 rounded p-2 italic">
                    {day.notes}
                  </p>
                )}

                {/* Transport between locations */}
                {day.transportBetweenLocations &&
                day.transportBetweenLocations.length > 0 ? (
                  <div>
                    <p className="font-medium text-foreground text-xs mb-2 flex items-center gap-1">
                      <Train className="h-3 w-3 text-accent" /> Transport
                      Between Locations
                    </p>
                    <div className="space-y-1.5">
                      {day.transportBetweenLocations.map((t, i) => (
                        <div
                          key={i}
                          className="bg-accent/5 border border-accent/20 rounded p-2 text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {t.from} → {t.to}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-accent">
                                {t.mode}
                              </span>
                              {t.service ? ` · ${t.service}` : ''}
                              {t.duration ? ` · ~${t.duration}` : ''}
                              {t.cost ? ` · ${fmt(t.cost)}` : ''}
                            </p>
                          </div>
                          {t.url && (
                            <a
                              href={t.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-accent hover:text-accent/80 ml-2 shrink-0 text-[10px] underline underline-offset-2"
                            >
                              <ExternalLink className="h-3 w-3" /> Book
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/30 rounded p-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Train className="h-3 w-3" /> No inter-location transport on
                    this day
                  </div>
                )}

                {/* Accommodations */}
                {day.accommodations && day.accommodations.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground text-xs mb-2 flex items-center gap-1">
                      <Hotel className="h-3 w-3 text-accent" /> Accommodation
                      Options
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {day.accommodations.map((acc, i) => (
                        <div
                          key={i}
                          className="bg-card border border-border rounded p-2 text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {acc.name}
                            </p>
                            <p className="text-muted-foreground">
                              {acc.location} · {fmt(acc.pricePerNight)}/night
                            </p>
                          </div>
                          {acc.url && (
                            <a
                              href={acc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent/80 ml-2 shrink-0"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Food */}
                {day.foodRecommendations &&
                  day.foodRecommendations.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground text-xs mb-2 flex items-center gap-1">
                        <Utensils className="h-3 w-3 text-accent" /> Food
                        Recommendations
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {day.foodRecommendations.map((food, i) => {
                          const foodUrl =
                            food.url ||
                            `https://maps.google.com/?q=${encodeURIComponent(food.name + ' restaurant')}`;
                          return (
                            <div
                              key={i}
                              className="bg-card border border-border rounded p-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-foreground">
                                  {food.name}
                                </p>
                                <Badge variant="outline" className="text-[9px]">
                                  {food.priceRange}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">
                                {food.cuisine}
                                {food.notes ? ` · ${food.notes}` : ''}
                              </p>
                              <a
                                href={foodUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-accent hover:text-accent/80 mt-1 text-[10px] underline underline-offset-2"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />{' '}
                                {food.url ? 'Visit website' : 'Search on Maps'}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" /> Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground font-body flex items-start gap-2"
                >
                  <span className="text-accent font-semibold mt-px">
                    {i + 1}.
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITripBuilder;
