'use client';

import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
};

function FilterButton({
  className = '',
  children,
  pressed,
  defaultPressed,
  onPressedChange,
  type = 'button',
  onClick,
  ...props
}: ButtonProps) {
  const isControlled = pressed !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<boolean>(defaultPressed ?? false);

  const on = isControlled ? !!pressed : uncontrolled;
  const base = 'px-2 py-2 font-bold text-xs rounded-full transition-colors border';
  const variant = on ? 'bg-[#EBF7FF] text-[#388BFE]' : 'bg-white text-black';

  return (
    <button
      type={type}
      className={`${base} ${variant} ${className}`}
      aria-pressed={on}
      data-state={on ? 'on' : 'off'}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        const next = !on;
        if (!isControlled) setUncontrolled(next);
        onPressedChange?.(next);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

FilterButton.displayName = 'FilterButton';

export default FilterButton;
