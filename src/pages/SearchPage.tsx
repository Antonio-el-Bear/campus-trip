import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SearchFilters from '@/components/SearchFilters';
import TripCard from '@/components/TripCard';
import { MOCK_TRIPS } from '@/lib/mockData';
import { isTripPriority } from '@/lib/priorityData';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredTrips = MOCK_TRIPS.filter((trip) => {
    if (query) {
      const q = query.toLowerCase();
      const match =
        trip.title.toLowerCase().includes(q) ||
        trip.memberName.toLowerCase().includes(q) ||
        trip.countries.some((c) => c.toLowerCase().includes(q)) ||
        trip.locations.some((l) => l.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.country && filters.country !== 'all') {
      if (!trip.countries.includes(filters.country)) return false;
    }
    if (filters.classification && filters.classification !== 'all') {
      if (!trip.classifications.includes(filters.classification)) return false;
    }
    return true;
  });

  // Sort: priority trips first
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    const aPriority = isTripPriority(
      a.memberId,
      a.countries,
      a.classifications,
      filters.country,
      filters.classification
    );
    const bPriority = isTripPriority(
      b.memberId,
      b.countries,
      b.classifications,
      filters.country,
      filters.classification
    );
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Search Trips
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {sortedTrips.length} result{sortedTrips.length !== 1 ? 's' : ''}{' '}
            found
            {query && (
              <>
                {' '}
                for "
                <span className="font-medium text-foreground">{query}</span>"
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <SearchFilters
              initialQuery={query}
              onSearch={setQuery}
              onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            />
          </aside>

          <main className="lg:col-span-3">
            {sortedTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTrips.map((trip, i) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    index={i}
                    isPriority={isTripPriority(
                      trip.memberId,
                      trip.countries,
                      trip.classifications,
                      filters.country,
                      filters.classification
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-body">
                  No trips match your search criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SearchPage;
