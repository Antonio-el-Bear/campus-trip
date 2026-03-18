import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TRIP_CLASSIFICATIONS } from '@/lib/mockData';
import { COUNTRIES_LIST } from '@/lib/countries';

interface MemberSearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  initialQuery?: string;
}

const MemberSearchFilters = ({
  onSearch,
  onFilterChange,
  initialQuery = '',
}: MemberSearchFiltersProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by member name..."
            className="pl-9 font-body"
          />
        </div>
      </form>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </h4>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">
            Country Visited
          </label>
          <Select onValueChange={(val) => onFilterChange({ country: val })}>
            <SelectTrigger className="font-body text-sm">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {COUNTRIES_LIST.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">
            Trip Classification
          </label>
          <Select
            onValueChange={(val) => onFilterChange({ classification: val })}
          >
            <SelectTrigger className="font-body text-sm">
              <SelectValue placeholder="All classifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classifications</SelectItem>
              {TRIP_CLASSIFICATIONS.map((cls) => (
                <SelectItem key={cls.value} value={cls.value}>
                  {cls.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={() => onSearch(query)}
          className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body text-sm mt-2"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default MemberSearchFilters;
