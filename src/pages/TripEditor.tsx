import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Plus,
  Trash2,
  ArrowLeft,
  ChevronsUpDown,
  X,
  Check,
} from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileNavBar from '@/components/MobileNavBar';
import { TRIP_CLASSIFICATIONS, getClassificationLabel } from '@/lib/mockData';
import { COUNTRIES_LIST } from '@/lib/countries';

interface DayLink {
  url: string;
  description: string;
}

interface ItineraryDayForm {
  locations: string;
  attractions: string;
  activities: string;
  notes: string;
  links: DayLink[];
  accommodation: {
    name: string;
    country: string;
    location: string;
    nights: string;
    url: string;
  };
}

const TRANSPORT_OPTIONS = [
  'Car',
  'Bus/Coach',
  'Train',
  'Plane',
  'Helicopter',
  'Boat/Ship',
  'Bicycle',
  'Motorbike',
  'Walking',
  'Local Community Transport',
];

const TripEditor = () => {
  const navigate = useNavigate();
  const [selectedClassifications, setSelectedClassifications] = useState<
    string[]
  >([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<string[]>([]);
  const [transportOther, setTransportOther] = useState('');
  const [itineraryDays, setItineraryDays] = useState<ItineraryDayForm[]>([
    {
      locations: '',
      attractions: '',
      activities: '',
      notes: '',
      links: [],
      accommodation: {
        name: '',
        country: '',
        location: '',
        nights: '',
        url: '',
      },
    },
  ]);
  const [difficulty, setDifficulty] = useState<number>(1);

  const toggleClassification = (value: string) => {
    setSelectedClassifications((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 5) return prev;
      return [...prev, value];
    });
  };

  const addDay = () => {
    setItineraryDays((prev) => [
      ...prev,
      {
        locations: '',
        attractions: '',
        activities: '',
        notes: '',
        links: [],
        accommodation: {
          name: '',
          country: '',
          location: '',
          nights: '',
          url: '',
        },
      },
    ]);
  };

  const removeDay = (index: number) => {
    setItineraryDays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — requires backend
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mb-6 font-body"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Create New Trip
        </h1>
        <p className="text-sm text-muted-foreground font-body mb-8">
          Document your travel experience with structured data.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Basic Information
            </h2>

            <div>
              <Label className="text-xs font-medium">Trip Title</Label>
              <Input
                placeholder="e.g. Sustainable Communities of the Peruvian Highlands"
                className="mt-1 font-body"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">Countries</Label>
                <p className="text-[10px] text-muted-foreground mb-1">
                  Select all that apply
                </p>

                {selectedCountries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedCountries.map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="text-xs gap-1 pr-1"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCountries((prev) =>
                              prev.filter((v) => v !== c)
                            )
                          }
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between font-body text-sm text-muted-foreground"
                    >
                      {selectedCountries.length === 0
                        ? 'Select countries...'
                        : `${selectedCountries.length} selected`}
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0 bg-popover z-50"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search countries..."
                        className="font-body"
                      />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {COUNTRIES_LIST.map((country) => {
                            const isSelected =
                              selectedCountries.includes(country);
                            return (
                              <CommandItem
                                key={country}
                                value={country}
                                onSelect={() =>
                                  setSelectedCountries((prev) =>
                                    prev.includes(country)
                                      ? prev.filter((v) => v !== country)
                                      : [...prev, country]
                                  )
                                }
                                className="font-body text-xs cursor-pointer"
                              >
                                <Check
                                  className={`h-3.5 w-3.5 mr-2 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                                />
                                {country}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs font-medium">Locations</Label>
                <Input
                  placeholder="e.g. Cusco, Sacred Valley"
                  className="mt-1 font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-medium">Start Date</Label>
                <Input type="date" className="mt-1 font-body" />
              </div>
              <div>
                <Label className="text-xs font-medium">End Date</Label>
                <Input type="date" className="mt-1 font-body" />
              </div>
              <div>
                <Label className="text-xs font-medium">Total Cost (USD)</Label>
                <Input
                  type="number"
                  placeholder="2800"
                  className="mt-1 font-body"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium">
                Difficulty (1 = Easy, 5 = Most Difficult)
              </Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`h-9 w-9 rounded-md border text-sm font-body font-medium transition-colors ${
                      difficulty === level
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'border-border text-muted-foreground hover:border-accent/30 hover:text-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Means of Transport */}
            <div>
              <Label className="text-xs font-medium">Means of Transport</Label>
              <p className="text-[10px] text-muted-foreground mb-2">
                Select all that apply
              </p>

              {selectedTransport.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedTransport.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="text-xs gap-1 pr-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTransport((prev) =>
                            prev.filter((v) => v !== t)
                          )
                        }
                        className="ml-0.5 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between font-body text-sm text-muted-foreground"
                  >
                    {selectedTransport.length === 0
                      ? 'Select transport...'
                      : `${selectedTransport.length} selected`}
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0 bg-popover z-50"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search transport..."
                      className="font-body"
                    />
                    <CommandList>
                      <CommandEmpty>No option found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {TRANSPORT_OPTIONS.map((opt) => {
                          const isSelected = selectedTransport.includes(opt);
                          return (
                            <CommandItem
                              key={opt}
                              value={opt}
                              onSelect={() =>
                                setSelectedTransport((prev) =>
                                  prev.includes(opt)
                                    ? prev.filter((v) => v !== opt)
                                    : [...prev, opt]
                                )
                              }
                              className="font-body text-xs cursor-pointer"
                            >
                              <Check
                                className={`h-3.5 w-3.5 mr-2 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                              />
                              {opt}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="mt-2">
                <Label className="text-[10px] font-medium">
                  Other (specify)
                </Label>
                <Input
                  value={transportOther}
                  onChange={(e) => setTransportOther(e.target.value)}
                  placeholder="e.g. Camel, Tuk-tuk..."
                  className="mt-1 font-body text-xs"
                />
              </div>
            </div>
          </section>

          {/* Classifications */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">
              Classifications
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Select up to 5 · {selectedClassifications.length}/5 selected
            </p>

            {selectedClassifications.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedClassifications.map((val) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="text-xs gap-1 pr-1"
                  >
                    {getClassificationLabel(val)}
                    <button
                      type="button"
                      onClick={() => toggleClassification(val)}
                      className="ml-0.5 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-body text-sm text-muted-foreground"
                >
                  {selectedClassifications.length === 0
                    ? 'Select classifications...'
                    : `${selectedClassifications.length} selected`}
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0 bg-popover z-50"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search classifications..."
                    className="font-body"
                  />
                  <CommandList>
                    <CommandEmpty>No classification found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {TRIP_CLASSIFICATIONS.map((cls) => {
                        const isSelected = selectedClassifications.includes(
                          cls.value
                        );
                        const isDisabled =
                          !isSelected && selectedClassifications.length >= 5;
                        return (
                          <CommandItem
                            key={cls.value}
                            value={cls.label}
                            disabled={isDisabled}
                            onSelect={() => toggleClassification(cls.value)}
                            className="font-body text-xs cursor-pointer"
                          >
                            <Check
                              className={`h-3.5 w-3.5 mr-2 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                            />
                            {cls.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </section>

          {/* Description */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">
              Trip Description
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Maximum 1,000 words
            </p>
            <Textarea
              rows={8}
              placeholder="Provide a narrative description of your trip..."
              className="font-body"
            />
          </section>

          {/* Itinerary */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Day-by-Day Itinerary
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDay}
                className="font-body text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Day
              </Button>
            </div>

            {itineraryDays.map((day, index) => (
              <div
                key={index}
                className="border border-border rounded-md p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    Day {index + 1}
                  </h3>
                  {itineraryDays.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(index)}
                      className="text-destructive h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[10px] font-medium">Country</Label>
                    <Select>
                      <SelectTrigger className="mt-1 font-body text-xs">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {COUNTRIES_LIST.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            className="text-xs"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] font-medium">Locations</Label>
                    <Input
                      placeholder="e.g. Cusco"
                      className="mt-1 font-body text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-medium">
                      Attractions
                    </Label>
                    <Input
                      placeholder="e.g. Plaza de Armas"
                      className="mt-1 font-body text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] font-medium">Activities</Label>
                  <Input
                    placeholder="e.g. Market survey, interviews"
                    className="mt-1 font-body text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-medium">
                    Description & Notes of the Day
                  </Label>
                  <Textarea
                    placeholder="Describe the day's highlights, observations, and practical notes…"
                    className="mt-1 font-body text-xs min-h-[80px]"
                    maxLength={1800}
                    onChange={(e) => {
                      const words = e.target.value
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean);
                      if (words.length > 300) {
                        e.target.value = words.slice(0, 300).join(' ');
                      }
                    }}
                  />
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Max 300 words
                  </p>
                </div>

                {/* Day Links */}
                <div>
                  <Label className="text-[10px] font-medium">
                    Reference Links{' '}
                    <span className="text-muted-foreground font-normal">
                      ({day.links.length}/10)
                    </span>
                  </Label>
                  <p className="text-[9px] text-muted-foreground mb-2">
                    Add up to 10 links to further describe this day (e.g.
                    photos, maps, booking pages).
                  </p>
                  <div className="space-y-2">
                    {day.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-1">
                          <Input
                            type="url"
                            placeholder="https://..."
                            value={link.url}
                            onChange={(e) => {
                              const updated = [...itineraryDays];
                              updated[index].links[linkIndex].url =
                                e.target.value;
                              setItineraryDays(updated);
                            }}
                            className="font-body text-xs"
                          />
                          <Input
                            placeholder="Brief description of this link"
                            value={link.description}
                            onChange={(e) => {
                              const updated = [...itineraryDays];
                              updated[index].links[linkIndex].description =
                                e.target.value;
                              setItineraryDays(updated);
                            }}
                            className="font-body text-xs"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80 text-xs px-2 mt-0.5"
                          onClick={() => {
                            const updated = [...itineraryDays];
                            updated[index].links.splice(linkIndex, 1);
                            setItineraryDays(updated);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  {day.links.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs font-body"
                      onClick={() => {
                        const updated = [...itineraryDays];
                        updated[index].links.push({ url: '', description: '' });
                        setItineraryDays(updated);
                      }}
                    >
                      + Add Link
                    </Button>
                  )}
                </div>
                {/* Accommodation for this day */}
                <Separator className="my-3" />
                <div>
                  <Label className="text-[10px] font-semibold text-foreground">
                    Accommodation
                  </Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    <div>
                      <Label className="text-[9px] font-medium">Name</Label>
                      <Input
                        placeholder="Hotel name"
                        value={day.accommodation.name}
                        onChange={(e) => {
                          const updated = [...itineraryDays];
                          updated[index].accommodation.name = e.target.value;
                          setItineraryDays(updated);
                        }}
                        className="mt-1 font-body text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] font-medium">Country</Label>
                      <Select
                        value={day.accommodation.country}
                        onValueChange={(v) => {
                          const updated = [...itineraryDays];
                          updated[index].accommodation.country = v;
                          setItineraryDays(updated);
                        }}
                      >
                        <SelectTrigger className="mt-1 font-body text-xs">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {COUNTRIES_LIST.map((country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className="text-xs"
                            >
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[9px] font-medium">Location</Label>
                      <Input
                        placeholder="City"
                        value={day.accommodation.location}
                        onChange={(e) => {
                          const updated = [...itineraryDays];
                          updated[index].accommodation.location =
                            e.target.value;
                          setItineraryDays(updated);
                        }}
                        className="mt-1 font-body text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] font-medium">Nights</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={day.accommodation.nights}
                        onChange={(e) => {
                          const updated = [...itineraryDays];
                          updated[index].accommodation.nights = e.target.value;
                          setItineraryDays(updated);
                        }}
                        className="mt-1 font-body text-xs"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label className="text-[9px] font-medium">
                      URL (optional)
                    </Label>
                    <Input
                      placeholder="https://..."
                      value={day.accommodation.url}
                      onChange={(e) => {
                        const updated = [...itineraryDays];
                        updated[index].accommodation.url = e.target.value;
                        setItineraryDays(updated);
                      }}
                      className="mt-1 font-body text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <Separator />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-gold-dark font-body"
            >
              Save Trip
            </Button>
          </div>
        </form>
      </div>

      <MobileNavBar />
      <SiteFooter />
    </div>
  );
};

export default TripEditor;
