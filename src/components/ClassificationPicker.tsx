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
import { TRIP_CLASSIFICATIONS, getClassificationLabel } from '@/lib/mockData';

interface ClassificationPickerProps {
  selected: string[];
  onToggle: (value: string) => void;
  max: number;
  placeholder?: string;
}

const ClassificationPicker = ({
  selected,
  onToggle,
  max,
  placeholder,
}: ClassificationPickerProps) => {
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
              {getClassificationLabel(val)}
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
              ? (placeholder ?? 'Select classifications...')
              : `${selected.length}/${max} selected`}
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
                  const isSelected = selected.includes(cls.value);
                  const isDisabled = !isSelected && selected.length >= max;
                  return (
                    <CommandItem
                      key={cls.value}
                      value={cls.label}
                      disabled={isDisabled}
                      onSelect={() => onToggle(cls.value)}
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
    </div>
  );
};

export default ClassificationPicker;
