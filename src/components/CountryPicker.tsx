import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
import { COUNTRIES_LIST } from '@/lib/countries';

interface CountryPickerProps {
  selected: string[];
  onToggle: (value: string) => void;
  max?: number;
  placeholder?: string;
  countries?: string[];
}

const CountryPicker = ({
  selected,
  onToggle,
  max,
  placeholder,
  countries,
}: CountryPickerProps) => {
  const list = countries ?? COUNTRIES_LIST;

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((val) => (
            <Badge
              key={val}
              variant="secondary"
              className="text-[11px] gap-1 pr-1"
            >
              {val}
              <button
                type="button"
                onClick={() => onToggle(val)}
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
            {selected.length === 0
              ? (placeholder ?? 'Select countries...')
              : max
                ? `${selected.length}/${max} selected`
                : `${selected.length} selected`}
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
                {list.map((country) => {
                  const isSelected = selected.includes(country);
                  const isDisabled =
                    !isSelected && max !== undefined && selected.length >= max;
                  return (
                    <CommandItem
                      key={country}
                      value={country}
                      disabled={isDisabled}
                      onSelect={() => onToggle(country)}
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
  );
};

export default CountryPicker;
