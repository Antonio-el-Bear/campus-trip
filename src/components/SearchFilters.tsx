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

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  initialQuery?: string;
}

const SearchFilters = ({
  onSearch,
  onFilterChange,
  initialQuery = '',
}: SearchFiltersProps) => {
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
            placeholder="Search by destination, trip title, or member..."
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
            Country
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

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">
            Duration
          </label>
          <Select onValueChange={(val) => onFilterChange({ duration: val })}>
            <SelectTrigger className="font-body text-sm">
              <SelectValue placeholder="Any duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any duration</SelectItem>
              <SelectItem value="1-7">1–7 days</SelectItem>
              <SelectItem value="8-14">8–14 days</SelectItem>
              <SelectItem value="15-30">15–30 days</SelectItem>
              <SelectItem value="30+">30+ days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">
            Cost Range
          </label>
          <Select onValueChange={(val) => onFilterChange({ cost: val })}>
            <SelectTrigger className="font-body text-sm">
              <SelectValue placeholder="Any budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any budget</SelectItem>
              <SelectItem value="0-1000">Under $1,000</SelectItem>
              <SelectItem value="1000-2500">$1,000 – $2,500</SelectItem>
              <SelectItem value="2500-5000">$2,500 – $5,000</SelectItem>
              <SelectItem value="5000+">$5,000+</SelectItem>
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

export default SearchFilters;
