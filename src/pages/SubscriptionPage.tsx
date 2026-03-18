import { useState } from 'react';
import {
  Check,
  Star,
  CreditCard,
  Plus,
  Trash2,
  Users,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { TRIP_CLASSIFICATIONS } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import ClassificationPicker from '@/components/ClassificationPicker';
import CountryPicker from '@/components/CountryPicker';

const AVAILABLE_COUNTRIES = [
  'Peru',
  'Colombia',
  'Ecuador',
  'Bolivia',
  'Thailand',
  'Vietnam',
  'Cambodia',
  'Laos',
  'Myanmar',
  'Indonesia',
  'Georgia',
  'Armenia',
  'Azerbaijan',
  'Uzbekistan',
  'Kyrgyzstan',
  'Kazakhstan',
  'Tajikistan',
  'Turkey',
  'Iran',
  'Japan',
  'South Korea',
  'Taiwan',
  'Italy',
  'Spain',
  'Greece',
  'Morocco',
  'Portugal',
  'France',
  'Kenya',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Ethiopia',
  'Malawi',
  'Mozambique',
  'Madagascar',
];

const SUBSCRIPTION_COST = 35;
const COST_PER_SLOT = 35;
const MAX_COUNTRIES_PER_SLOT = 2;
const MAX_CLASSIFICATIONS_PER_SLOT = 2;

interface Slot {
  countries: string[];
  classifications: string[];
}

const SubscriptionPage = () => {
  // Subscription state
  const [isProcessingSubscription, setIsProcessingSubscription] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Priority listing state
  const [slots, setSlots] = useState<Slot[]>([
    { countries: [], classifications: [] },
  ]);
  const [isProcessingPriority, setIsProcessingPriority] = useState(false);
  const [isPriorityActive, setIsPriorityActive] = useState(false);

  // Combined state
  const [isProcessingBoth, setIsProcessingBoth] = useState(false);
  const [isBothActive, setIsBothActive] = useState(false);
  const [bothSlots, setBothSlots] = useState<Slot[]>([
    { countries: [], classifications: [] },
  ]);

  const priorityCost = slots.length * COST_PER_SLOT;
  const bothPriorityCost = bothSlots.length * COST_PER_SLOT;
  const bothTotalCost = SUBSCRIPTION_COST + bothPriorityCost;

  const toggleCountry = (slotIndex: number, country: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== slotIndex) return slot;
        const has = slot.countries.includes(country);
        if (has)
          return {
            ...slot,
            countries: slot.countries.filter((c) => c !== country),
          };
        if (slot.countries.length >= MAX_COUNTRIES_PER_SLOT) return slot;
        return { ...slot, countries: [...slot.countries, country] };
      })
    );
  };

  const toggleClassification = (slotIndex: number, value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== slotIndex) return slot;
        const has = slot.classifications.includes(value);
        if (has)
          return {
            ...slot,
            classifications: slot.classifications.filter((c) => c !== value),
          };
        if (slot.classifications.length >= MAX_CLASSIFICATIONS_PER_SLOT)
          return slot;
        return { ...slot, classifications: [...slot.classifications, value] };
      })
    );
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { countries: [], classifications: [] }]);
  };

  const removeSlot = (index: number) => {
    if (slots.length <= 1) return;
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubscriptionPayment = async () => {
    setIsProcessingSubscription(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingSubscription(false);
    setIsSubscribed(true);
    toast({
      title: 'Subscription activated!',
      description: 'Your premium membership is now active for one year.',
    });
  };

  const handlePriorityPayment = async () => {
    const hasEmpty = slots.some(
      (s) => s.countries.length === 0 && s.classifications.length === 0
    );
    if (hasEmpty) {
      toast({
        title: 'Selection required',
        description:
          'Each slot must have at least one country or classification selected.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingPriority(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingPriority(false);
    setIsPriorityActive(true);
    toast({
      title: 'Priority listing activated!',
      description: `${slots.length} priority listing slot${slots.length > 1 ? 's' : ''} activated successfully.`,
    });
  };

  // Both-tab slot helpers
  const toggleBothCountry = (slotIndex: number, country: string) => {
    setBothSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== slotIndex) return slot;
        const has = slot.countries.includes(country);
        if (has)
          return {
            ...slot,
            countries: slot.countries.filter((c) => c !== country),
          };
        if (slot.countries.length >= MAX_COUNTRIES_PER_SLOT) return slot;
        return { ...slot, countries: [...slot.countries, country] };
      })
    );
  };

  const toggleBothClassification = (slotIndex: number, value: string) => {
    setBothSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== slotIndex) return slot;
        const has = slot.classifications.includes(value);
        if (has)
          return {
            ...slot,
            classifications: slot.classifications.filter((c) => c !== value),
          };
        if (slot.classifications.length >= MAX_CLASSIFICATIONS_PER_SLOT)
          return slot;
        return { ...slot, classifications: [...slot.classifications, value] };
      })
    );
  };

  const addBothSlot = () => {
    setBothSlots((prev) => [...prev, { countries: [], classifications: [] }]);
  };

  const removeBothSlot = (index: number) => {
    if (bothSlots.length <= 1) return;
    setBothSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBothPayment = async () => {
    const hasEmpty = bothSlots.some(
      (s) => s.countries.length === 0 && s.classifications.length === 0
    );
    if (hasEmpty) {
      toast({
        title: 'Selection required',
        description:
          'Each slot must have at least one country or classification selected.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingBoth(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingBoth(false);
    setIsBothActive(true);
    setIsSubscribed(true);
    setIsPriorityActive(true);
    toast({
      title: 'Subscription & Priority Listing activated!',
      description: `Premium membership and ${bothSlots.length} priority slot${bothSlots.length > 1 ? 's' : ''} activated successfully.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
              Membership Options
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Subscription & Priority Listing
            </h1>
            <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
              Choose one or both — subscribe for premium access and/or purchase
              priority slots to boost your trips. They are fully independent.
            </p>
          </div>

          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="subscription" className="font-body text-sm">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="priority" className="font-body text-sm">
                <Star className="h-3.5 w-3.5 mr-1.5" />
                Priority Listing
              </TabsTrigger>
              <TabsTrigger value="both" className="font-body text-sm">
                <Package className="h-3.5 w-3.5 mr-1.5" />
                Both
              </TabsTrigger>
            </TabsList>

            {/* ─── SUBSCRIPTION TAB ─── */}
            <TabsContent value="subscription">
              {isSubscribed ? (
                <div className="max-w-lg mx-auto text-center py-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Subscription Active
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    Your premium membership is active. Enjoy full access to
                    member profiles, detailed itineraries, travel maps, contact
                    information, and private messaging.
                  </p>
                  <p className="text-sm text-muted-foreground font-body">
                    Paid:{' '}
                    <span className="font-semibold text-foreground">
                      €{SUBSCRIPTION_COST}.00
                    </span>{' '}
                    · Valid for 1 year
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-card border-2 border-accent/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-accent" />
                      <span className="font-display text-lg font-semibold text-foreground">
                        Premium Membership
                      </span>
                    </div>

                    <div className="text-center p-4 bg-secondary/50 rounded-lg mb-4">
                      <p className="font-display text-3xl font-bold text-foreground">
                        €{SUBSCRIPTION_COST}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        /year · One-time annual payment · No auto-renewal
                      </p>
                    </div>

                    <ul className="text-xs text-muted-foreground font-body space-y-1.5 mb-6">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Full access to{' '}
                        <strong className="text-foreground">
                          member profiles
                        </strong>{' '}
                        and{' '}
                        <strong className="text-foreground">
                          contact details
                        </strong>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Complete{' '}
                        <strong className="text-foreground">itineraries</strong>
                        , travel maps, and trip documentation
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        <strong className="text-foreground">
                          Private messaging
                        </strong>{' '}
                        with trip authors and members
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Independent from priority listing — purchase either or
                        both
                      </li>
                    </ul>

                    <Button
                      onClick={handleSubscriptionPayment}
                      disabled={isProcessingSubscription}
                      className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm h-11"
                    >
                      {isProcessingSubscription ? (
                        'Processing payment...'
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscribe — €{SUBSCRIPTION_COST}/year
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground font-body text-center mt-3">
                      This is a simulated payment. No real charges will be made.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ─── PRIORITY LISTING TAB ─── */}
            <TabsContent value="priority">
              {isPriorityActive ? (
                <div className="max-w-lg mx-auto text-center py-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Priority Listing Active
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mb-6">
                    Your trips are now prioritised in search results for the
                    selected criteria. Valid for one year.
                  </p>

                  <div className="space-y-4 text-left mb-6">
                    {slots.map((slot, i) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-lg p-5"
                      >
                        <h3 className="font-display text-sm font-semibold text-foreground mb-2">
                          Slot {i + 1} — €{COST_PER_SLOT}/year
                        </h3>
                        {slot.countries.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              Countries
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slot.countries.map((c) => (
                                <Badge
                                  key={c}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {slot.classifications.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Classifications
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slot.classifications.map((cls) => (
                                <Badge
                                  key={cls}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {TRIP_CLASSIFICATIONS.find(
                                    (c) => c.value === cls
                                  )?.label ?? cls}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground font-body">
                    Total paid:{' '}
                    <span className="font-semibold text-foreground">
                      €{priorityCost}.00
                    </span>{' '}
                    · {slots.length} slot{slots.length > 1 ? 's' : ''} × €
                    {COST_PER_SLOT} · Valid for 1 year
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Explanation */}
                  <div className="bg-card border-2 border-accent/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-accent" />
                      <span className="font-display text-lg font-semibold text-foreground">
                        Priority Listing
                      </span>
                    </div>

                    <div className="text-center p-4 bg-secondary/50 rounded-lg mb-4">
                      <p className="font-display text-3xl font-bold text-foreground">
                        €{COST_PER_SLOT}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        /slot/year · One-time annual payment · No auto-renewal
                      </p>
                    </div>

                    <ul className="text-xs text-muted-foreground font-body space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Each slot includes up to{' '}
                        <strong className="text-foreground">2 countries</strong>{' '}
                        and{' '}
                        <strong className="text-foreground">
                          2 trip classifications
                        </strong>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Your trips appear{' '}
                        <strong className="text-foreground">at the top</strong>{' '}
                        of relevant search results
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Add as many slots as you need to cover all your
                        destinations
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Independent from subscription — purchase either or both
                      </li>
                    </ul>
                  </div>

                  {/* Slots */}
                  <div className="space-y-6">
                    {slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="bg-card border border-border rounded-lg p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-display text-base font-semibold text-foreground">
                            Slot {slotIndex + 1}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              — €{COST_PER_SLOT}/year
                            </span>
                          </h2>
                          {slots.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSlot(slotIndex)}
                              className="text-destructive h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>

                        {/* Country selection */}
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-foreground mb-1">
                            Countries{' '}
                            <span className="text-muted-foreground font-normal">
                              ({slot.countries.length}/{MAX_COUNTRIES_PER_SLOT})
                            </span>
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-body mb-2">
                            Select up to {MAX_COUNTRIES_PER_SLOT} countries for
                            this slot.
                          </p>
                          <CountryPicker
                            selected={slot.countries}
                            onToggle={(country) =>
                              toggleCountry(slotIndex, country)
                            }
                            max={MAX_COUNTRIES_PER_SLOT}
                            countries={AVAILABLE_COUNTRIES.sort()}
                          />
                        </div>

                        {/* Classification selection */}
                        <div>
                          <h3 className="text-xs font-semibold text-foreground mb-1">
                            Classifications{' '}
                            <span className="text-muted-foreground font-normal">
                              ({slot.classifications.length}/
                              {MAX_CLASSIFICATIONS_PER_SLOT})
                            </span>
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-body mb-2">
                            Select up to {MAX_CLASSIFICATIONS_PER_SLOT}{' '}
                            classifications for this slot.
                          </p>
                          <ClassificationPicker
                            selected={slot.classifications}
                            onToggle={(value) =>
                              toggleClassification(slotIndex, value)
                            }
                            max={MAX_CLASSIFICATIONS_PER_SLOT}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add slot button */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSlot}
                      className="font-body text-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add Another Slot (+€{COST_PER_SLOT}/year)
                    </Button>
                    <p className="text-[10px] text-muted-foreground font-body mt-2">
                      Each additional slot grants 2 more countries and 2 more
                      classifications.
                    </p>
                  </div>

                  {/* Summary & payment */}
                  <div className="border-t border-border pt-6">
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
                        <span>
                          {slots.length} priority slot
                          {slots.length > 1 ? 's' : ''} × €{COST_PER_SLOT}
                        </span>
                        <span>€{priorityCost}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-body font-medium text-foreground">
                          Total
                        </span>
                        <p className="font-display text-xl font-bold text-foreground">
                          €{priorityCost}
                          <span className="text-sm font-normal text-muted-foreground">
                            /year
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handlePriorityPayment}
                      disabled={isProcessingPriority}
                      className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm h-11"
                    >
                      {isProcessingPriority ? (
                        'Processing payment...'
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay €{priorityCost} and Activate Priority Listing
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground font-body text-center mt-3">
                      This is a simulated payment. No real charges will be made.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ─── BOTH TAB ─── */}
            <TabsContent value="both">
              {isBothActive ? (
                <div className="max-w-lg mx-auto text-center py-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Subscription & Priority Listing Active
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mb-6">
                    Your premium membership and priority listing are both
                    active. Valid for one year.
                  </p>

                  <div className="space-y-4 text-left mb-6">
                    {bothSlots.map((slot, i) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-lg p-5"
                      >
                        <h3 className="font-display text-sm font-semibold text-foreground mb-2">
                          Slot {i + 1} — €{COST_PER_SLOT}/year
                        </h3>
                        {slot.countries.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground mb-1">
                              Countries
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slot.countries.map((c) => (
                                <Badge
                                  key={c}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {slot.classifications.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Classifications
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slot.classifications.map((cls) => (
                                <Badge
                                  key={cls}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {TRIP_CLASSIFICATIONS.find(
                                    (c) => c.value === cls
                                  )?.label ?? cls}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground font-body">
                    Total paid:{' '}
                    <span className="font-semibold text-foreground">
                      €{SUBSCRIPTION_COST + bothSlots.length * COST_PER_SLOT}.00
                    </span>{' '}
                    · Subscription €{SUBSCRIPTION_COST} + {bothSlots.length}{' '}
                    slot{bothSlots.length > 1 ? 's' : ''} × €{COST_PER_SLOT} ·
                    Valid for 1 year
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Explanation */}
                  <div className="bg-card border-2 border-accent/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-accent" />
                      <span className="font-display text-lg font-semibold text-foreground">
                        Subscription + Priority Listing
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                      Get the best of both — premium membership{' '}
                      <strong className="text-foreground">and</strong> priority
                      listing in a single checkout.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-secondary/50 rounded-lg">
                        <p className="font-display text-2xl font-bold text-foreground">
                          €{SUBSCRIPTION_COST}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          /year — Subscription
                        </p>
                      </div>
                      <div className="text-center p-3 bg-secondary/50 rounded-lg">
                        <p className="font-display text-2xl font-bold text-foreground">
                          €{COST_PER_SLOT}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          /slot/year — Priority
                        </p>
                      </div>
                    </div>

                    <ul className="text-xs text-muted-foreground font-body space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Full access to profiles, itineraries, maps, contact
                        info, and private messaging
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        Your trips appear{' '}
                        <strong className="text-foreground">at the top</strong>{' '}
                        of relevant search results
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        One checkout, one payment — everything activated at once
                      </li>
                    </ul>
                  </div>

                  {/* Slots */}
                  <div className="space-y-6">
                    {bothSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="bg-card border border-border rounded-lg p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-display text-base font-semibold text-foreground">
                            Slot {slotIndex + 1}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              — €{COST_PER_SLOT}/year
                            </span>
                          </h2>
                          {bothSlots.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBothSlot(slotIndex)}
                              className="text-destructive h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>

                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-foreground mb-1">
                            Countries{' '}
                            <span className="text-muted-foreground font-normal">
                              ({slot.countries.length}/{MAX_COUNTRIES_PER_SLOT})
                            </span>
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-body mb-2">
                            Select up to {MAX_COUNTRIES_PER_SLOT} countries for
                            this slot.
                          </p>
                          <CountryPicker
                            selected={slot.countries}
                            onToggle={(country) =>
                              toggleBothCountry(slotIndex, country)
                            }
                            max={MAX_COUNTRIES_PER_SLOT}
                            countries={AVAILABLE_COUNTRIES.sort()}
                          />
                        </div>

                        <div>
                          <h3 className="text-xs font-semibold text-foreground mb-1">
                            Classifications{' '}
                            <span className="text-muted-foreground font-normal">
                              ({slot.classifications.length}/
                              {MAX_CLASSIFICATIONS_PER_SLOT})
                            </span>
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-body mb-2">
                            Select up to {MAX_CLASSIFICATIONS_PER_SLOT}{' '}
                            classifications for this slot.
                          </p>
                          <ClassificationPicker
                            selected={slot.classifications}
                            onToggle={(value) =>
                              toggleBothClassification(slotIndex, value)
                            }
                            max={MAX_CLASSIFICATIONS_PER_SLOT}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add slot */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addBothSlot}
                      className="font-body text-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add Another Slot (+€{COST_PER_SLOT}/year)
                    </Button>
                  </div>

                  {/* Summary & payment */}
                  <div className="border-t border-border pt-6">
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
                        <span>Premium subscription</span>
                        <span>€{SUBSCRIPTION_COST}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
                        <span>
                          {bothSlots.length} priority slot
                          {bothSlots.length > 1 ? 's' : ''} × €{COST_PER_SLOT}
                        </span>
                        <span>€{bothPriorityCost}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-body font-medium text-foreground">
                          Total
                        </span>
                        <p className="font-display text-xl font-bold text-foreground">
                          €{bothTotalCost}
                          <span className="text-sm font-normal text-muted-foreground">
                            /year
                          </span>
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleBothPayment}
                      disabled={isProcessingBoth}
                      className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm h-11"
                    >
                      {isProcessingBoth ? (
                        'Processing payment...'
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay €{bothTotalCost} — Subscription + Priority Listing
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground font-body text-center mt-3">
                      This is a simulated payment. No real charges will be made.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* ─── DETAILED EXPLANATIONS ─── */}
          <Separator className="my-10" />

          <div className="space-y-8">
            {/* What is Premium Subscription */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="font-display text-lg font-semibold text-foreground">
                  What is Premium Subscription?
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
                The Premium Subscription is an annual membership that unlocks
                full access to TravelRecord's content and communication
                features. It is designed for travelers who want to explore
                detailed trip documentation created by experienced members.
              </p>
              <h3 className="font-body text-sm font-semibold text-foreground mb-2">
                What You Get
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-body mb-4">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">
                      Full member profiles
                    </strong>{' '}
                    — Access complete profiles including contact details, travel
                    history, and consultancy information.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">
                      Detailed itineraries
                    </strong>{' '}
                    — View complete day-by-day breakdowns, accommodations,
                    costs, and logistics for every documented trip.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">Travel maps</strong> —
                    Explore interactive maps showing routes and destinations for
                    each trip.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">
                      Private messaging
                    </strong>{' '}
                    — Contact trip authors and other members directly through
                    the platform's messaging system.
                  </span>
                </li>
              </ul>
              <h3 className="font-body text-sm font-semibold text-foreground mb-2">
                Key Details
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-body">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    Costs{' '}
                    <strong className="text-foreground">
                      €{SUBSCRIPTION_COST}/year
                    </strong>{' '}
                    — a single annual payment with{' '}
                    <strong className="text-foreground">no auto-renewal</strong>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    Completely{' '}
                    <strong className="text-foreground">independent</strong>{' '}
                    from Priority Listing — you can subscribe without purchasing
                    any priority slots.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    Does not affect your trips, ratings, or search placement —
                    it only unlocks viewing and messaging features.
                  </span>
                </li>
              </ul>
            </section>

            {/* What is Priority Listing */}
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-accent" />
                <h2 className="font-display text-lg font-semibold text-foreground">
                  What is Priority Listing?
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-body mb-4">
                Priority Listing is a voluntary, paid feature that boosts the
                visibility of your documented trips in search results. It is
                designed for serious travel documentarians and consultants who
                want their expertise to be discovered more easily.
              </p>

              <h3 className="font-body text-sm font-semibold text-foreground mb-2">
                How It Works
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground font-body mb-4 list-none">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    1.
                  </span>
                  <span>
                    Purchase one or more{' '}
                    <strong className="text-foreground">Priority Slots</strong>{' '}
                    at{' '}
                    <strong className="text-foreground">
                      €{COST_PER_SLOT}/year each
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    2.
                  </span>
                  <span>
                    Each slot lets you select up to{' '}
                    <strong className="text-foreground">
                      {MAX_COUNTRIES_PER_SLOT} countries
                    </strong>{' '}
                    and{' '}
                    <strong className="text-foreground">
                      {MAX_CLASSIFICATIONS_PER_SLOT} trip classifications
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    3.
                  </span>
                  <span>
                    All your trips matching the selected criteria appear{' '}
                    <strong className="text-foreground">
                      at the top of search results
                    </strong>
                    , marked with a subtle priority indicator.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    4.
                  </span>
                  <span>
                    Purchase{' '}
                    <strong className="text-foreground">
                      additional slots
                    </strong>{' '}
                    to cover more countries and classifications.
                  </span>
                </li>
              </ol>

              <h3 className="font-body text-sm font-semibold text-foreground mb-2">
                Ranking Among Priority Members
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-body mb-3">
                When multiple members target the same search criteria, all their
                priority trips appear above standard results. The order among
                them is determined by:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground font-body mb-4 list-none">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    1.
                  </span>
                  <span>
                    <strong className="text-foreground">Shield Rating</strong> —
                    higher shield ratings rank first.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    2.
                  </span>
                  <span>
                    <strong className="text-foreground">Trip Count</strong> —
                    more documented trips rank higher if shield ratings are
                    equal.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    3.
                  </span>
                  <span>
                    <strong className="text-foreground">Member Rating</strong> —
                    average rating from other members as a tiebreaker.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[24px]">
                    4.
                  </span>
                  <span>
                    <strong className="text-foreground">
                      Subscription Date
                    </strong>{' '}
                    — earlier subscribers rank first as a final tiebreaker.
                  </span>
                </li>
              </ol>

              <h3 className="font-body text-sm font-semibold text-foreground mb-2">
                Key Details
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-body">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">
                      Flat-rate pricing
                    </strong>{' '}
                    — €{COST_PER_SLOT}/year per slot. No auction, no
                    pay-per-click, no variable pricing.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">No exclusivity</strong>{' '}
                    — multiple members can hold priority for the same countries
                    and classifications.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">
                      Slot independence
                    </strong>{' '}
                    — each slot operates separately with its own matching
                    criteria.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    <strong className="text-foreground">No auto-renewal</strong>{' '}
                    — slots expire after 12 months. You'll be notified before
                    expiration.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    Completely{' '}
                    <strong className="text-foreground">independent</strong>{' '}
                    from subscription — you can boost your trips without being a
                    subscriber.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground min-w-[6px]">
                    •
                  </span>
                  <span>
                    Does not affect trip content, ratings, or shield scores — it
                    only boosts{' '}
                    <strong className="text-foreground">
                      placement in search results
                    </strong>
                    .
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SubscriptionPage;
