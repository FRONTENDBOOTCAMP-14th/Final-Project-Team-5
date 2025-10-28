'use client';

import React from 'react';
import FilterButton from '@/components/ui/FilterButton';

interface FilterBarProps {
  items?: string[]; // undefined 방지
  selectedItem?: string;
  mapToValue?: Record<string, string>;
  onSelect?: (value: string) => void;
  className?: string;
  selected?: string[];
  onSelect?: (kw: string) => void;
  value?: string | null;
  onChange?: (kw: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  items = [],
  selectedItem,
  mapToValue,
  onSelect,
  className = '',
}) => {
  return (
    <div
      className={[
        'flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1',
        '[-ms-overflow-style:none] [scrollbar-width:none]',
        '[&::-webkit-scrollbar]:hidden',
        className,
      ].join(' ')}
    >
      {items.length > 0 ? (
        items.map((word, i) => {
          const value = mapToValue?.[word] ?? word;
          const isSelected = selectedItem === value;
          return (
            <FilterButton
              key={i}
              className="shrink-0"
              aria-pressed={isSelected}
              onClick={() => onSelect?.(value)}
            >
              {word}
            </FilterButton>
          );
        })
      ) : (
        <div />
      )}
    </div>
  );
};

export default KeywordList;
