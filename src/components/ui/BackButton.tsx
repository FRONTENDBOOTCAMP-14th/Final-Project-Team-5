'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function BackButton({ className = '', children, onClick, ...props }: ButtonProps) {
  const router = useRouter();
  const containerStyles = 'w-full px-4 py-3 text-black font-bold rounded-lg flex items-center gap-2';
  const iconButtonStyles = 'p-2 rounded-lg hover:bg-gray-100 transition';

  return (
    <div className={`${containerStyles} ${className}`}>
      <button
        className={iconButtonStyles}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
            return;
          }
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
