'use client';

import React from 'react';
import FilterButton from '@/components/ui/FilterButton';

interface KeywordListProps {
  keywords: string[];
  className?: string;
  selected?: string[];
  onSelect?: (kw: string) => void;
  value?: string | null;
  onChange?: (kw: string) => void;
  mapToValue?: Record<string, string>; // 추가: 한글 -> 영어 매핑
}

const KeywordList: React.FC<KeywordListProps> = ({
  keywords,
  className = '',
  selected,
  onSelect,
  value,
  onChange,
  mapToValue,
}) => {
  const isSelected = (kw: string) =>
    Array.isArray(selected)
      ? selected.includes(kw)
      : value === (mapToValue?.[kw] ?? kw);

  const handleClick = (e: React.MouseEvent, kw: string) => {
    e.preventDefault();
    e.stopPropagation();

    const mappedValue = mapToValue?.[kw] ?? kw;

    if (onSelect) return onSelect(mappedValue);
    if (onChange) return onChange(mappedValue);
  };

  return (
    <div
      className={[
        'flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1',
        '[-ms-overflow-style:none] [scrollbar-width:none]',
        '[&::-webkit-scrollbar]:hidden',
        className,
      ].join(' ')}
    >
      {keywords.map((word) => {
        const on = isSelected(word);
        return (
          <FilterButton
            key={word}
            type="button"
            aria-pressed={on}
            onClick={(e: React.MouseEvent) => handleClick(e, word)}
            className={[
              'shrink-0',
              on
                ? 'bg-[#EBF7FF] text-[#388BFE] border border-[#B7D9FF]'
                : 'bg-white text-black border border-gray-300',
            ].join(' ')}
          >
            {word}
          </FilterButton>
        );
      })}
    </div>
  );
};

export default KeywordList;
