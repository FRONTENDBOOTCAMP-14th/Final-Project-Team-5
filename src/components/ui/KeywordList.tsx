'use client';

import React from 'react';
import FilterButton from '@/components/ui/FilterButton';

interface FilterBarProps {
  keywords: string[];
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ keywords, className = '' }) => {
  return (
    <div
      className={[
        'flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1',
        '[-ms-overflow-style:none] [scrollbar-width:none]',
        '[&::-webkit-scrollbar]:hidden',
        className,
      ].join(' ')}
    >
      {keywords.map((word, i) => (
        <FilterButton key={i} className="shrink-0">
          {word}
        </FilterButton>
      ))}
    </div>
  );
};

export default FilterBar;
