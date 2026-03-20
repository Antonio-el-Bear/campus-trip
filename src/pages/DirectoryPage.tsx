import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileNavBar from '@/components/MobileNavBar';
import MemberSearchFilters from '@/components/MemberSearchFilters';
import MemberCard from '@/components/MemberCard';
import { MOCK_MEMBERS } from '@/lib/mockData';

const DirectoryPage = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    if (query) {
      const q = query.toLowerCase();
      if (
        !member.fullName.toLowerCase().includes(q) &&
        !member.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (filters.country && filters.country !== 'all') {
      if (!member.countriesVisited.includes(filters.country)) return false;
    }
    if (filters.classification && filters.classification !== 'all') {
      if (!member.classifications.includes(filters.classification))
        return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="container py-8 flex-1">
        <div className="mb-6">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-accent mb-1">
            Member Directory
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Search Members
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {filteredMembers.length} member
            {filteredMembers.length !== 1 ? 's' : ''} found
            {query && (
              <>
                {' '}
                matching "
                <span className="font-medium text-foreground">{query}</span>"
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <MemberSearchFilters
              initialQuery={query}
              onSearch={setQuery}
              onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            />
          </aside>

          <main className="lg:col-span-3">
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMembers.map((member, i) => (
                  <MemberCard key={member.id} member={member} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-body">
                  No members match your search criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <MobileNavBar />
      <SiteFooter />
    </div>
  );
};

export default DirectoryPage;
