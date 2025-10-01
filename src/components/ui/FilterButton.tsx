'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', ...props }, ref) => {
    const [on, setOn] = React.useState(false);

    const base = 'px-1 py-1 font-bold text-xs rounded-full transition-colors';
    const variant = on ? 'bg-[#EBF7FF] text-[#388BFE] border' : 'bg-white text-black border';

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        className={`${base} ${variant} ${className}`}
        aria-pressed={on}
        onClick={(e) => {
          props.onClick?.(e);
          if (!e.defaultPrevented) setOn(v => !v);
        }}
        {...props}
      >
      </button>
    );
  }
);

Button.displayName = 'FilterButton';
export default Button;