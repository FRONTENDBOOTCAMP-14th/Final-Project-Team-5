'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const BackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', children, ...props }, ref) => {
    const router = useRouter();

    const containerStyles =
      'w-full px-4 py-3 text-black font-bold rounded-lg flex items-center gap-2';
    const iconButtonStyles = 'p-2 rounded-lg hover:bg-gray-100 transition';

    return (
      <div className={`${containerStyles} ${className}`}>
        <button
          ref={ref}
          className={iconButtonStyles}
          onClick={(e) => {
            props.onClick?.(e);
            if (e.defaultPrevented) return;
            router.back();
          }}
          {...props}
        >
          <ArrowLeft size={44} className="text-[#000]" />
        </button>
        {children && <span className="select-none">{children}</span>}
      </div>
    );
  }
);

BackButton.displayName = 'BackButton';

export default BackButton;
