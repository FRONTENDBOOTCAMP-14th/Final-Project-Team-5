'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export default function Input({
  label,
  className = '',
  id,
  ...props
}: InputProps) {
  const styles =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500';

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-900 mb-2"
      >
        {label}
      </label>
      <input id={id} className={`${styles} ${className}`} {...props} />
    </div>
  );
}
