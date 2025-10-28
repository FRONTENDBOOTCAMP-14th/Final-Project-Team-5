'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const styles = 'w-full px-4 py-3 bg-blue-200 text-black font-bold rounded-lg';
  
  return (
    <button type={type} className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
