import { useState, useMemo } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { MOCK_TRIPS, MOCK_MEMBERS, TRIP_CLASSIFICATIONS } from '@/lib/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, MapPin, Tag, Users, FileText } from 'lucide-react';
import LeaderboardList from '@/components/LeaderboardList';
import AuthorLeaderboardList from '@/components/AuthorLeaderboardList';

const LeaderboardPage = () => {
  const [mainTab, setMainTab] = useState('trips');

  // Trip filters
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedClassification, setSelectedClassification] = useState('all');

  // Author filters
  const [authorCountry, setAuthorCountry] = useState('all');
  const [authorClassification, setAuthorClassification] = useState('all');

  const allTripCountries = useMemo(() => {
    const set = new Set<string>();
    MOCK_TRIPS.forEach((t) => t.countries.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, []);

  const allAuthorCountries = useMemo(() => {
    const set = new Set<string>();
    MOCK_MEMBERS.forEach((m) => m.countriesVisited.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, []);

  const usedClassifications = useMemo(() => {
    const set = new Set<string>();
    MOCK_TRIPS.forEach((t) => t.classifications.forEach((c) => set.add(c)));
    return TRIP_CLASSIFICATIONS.filter((c) => set.has(c.value));
  }, []);

  const authorClassifications = useMemo(() => {
    const set = new Set<string>();
    MOCK_MEMBERS.forEach((m) => m.classifications.forEach((c) => set.add(c)));
    return TRIP_CLASSIFICATIONS.filter((c) => set.has(c.value));
  }, []);

  const filteredTrips = useMemo(() => {
    let filtered = MOCK_TRIPS;
    if (selectedCountry !== 'all') {
      filtered = filtered.filter((t) => t.countries.includes(selectedCountry));
    }
    if (selectedClassification !== 'all') {
      filtered = filtered.filter((t) =>
        t.classifications.includes(selectedClassification)
      );
    }
    return [...filtered].sort((a, b) => b.views - a.views);
  }, [selectedCountry, selectedClassification]);

  const filteredAuthors = useMemo(() => {
    let filtered = MOCK_MEMBERS;
    if (authorCountry !== 'all') {
      filtered = filtered.filter((m) =>
        m.countriesVisited.includes(authorCountry)
      );
    }
    if (authorClassification !== 'all') {
      filtered = filtered.filter((m) =>
        m.classifications.includes(authorClassification)
      );
    }
    return [...filtered].sort((a, b) => b.tripCount - a.tripCount);
  }, [authorCountry, authorClassification]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        {/* Hero */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Leaderboard
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Top trips and authors ranked by views and contributions.
              </p>
            </div>
          </div>
        </div>

        {/* Main tabs: Trips vs Authors */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger
              value="trips"
              className="gap-1.5 flex-1 sm:flex-initial"
            >
              <FileText className="h-3.5 w-3.5" /> Trip Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="authors"
              className="gap-1.5 flex-1 sm:flex-initial"
            >
              <Users className="h-3.5 w-3.5" /> Author Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* TRIP LEADERBOARD */}
          <TabsContent value="trips">
            <div className="flex gap-3 mb-5 flex-wrap">
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-56">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Countries" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {allTripCountries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedClassification}
                onValueChange={setSelectedClassification}
              >
                <SelectTrigger className="w-56">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Classifications" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  {usedClassifications.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-3">
              {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}{' '}
              ranked by views
            </p>
            <LeaderboardList trips={filteredTrips} />
          </TabsContent>

          {/* AUTHOR LEADERBOARD */}
          <TabsContent value="authors">
            <div className="flex gap-3 mb-5 flex-wrap">
              <Select value={authorCountry} onValueChange={setAuthorCountry}>
                <SelectTrigger className="w-56">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Countries" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {allAuthorCountries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={authorClassification}
                onValueChange={setAuthorClassification}
              >
                <SelectTrigger className="w-56">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Classifications" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  {authorClassifications.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-3">
              {filteredAuthors.length} author
              {filteredAuthors.length !== 1 ? 's' : ''} ranked by trip count
            </p>
            <AuthorLeaderboardList members={filteredAuthors} />
          </TabsContent>
        </Tabs>
      </div>

      <SiteFooter />
    </div>
  );
};

export default LeaderboardPage;
