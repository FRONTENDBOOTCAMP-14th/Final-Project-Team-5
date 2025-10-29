'use client';

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  showPasswordToggle?: boolean;
  props?: ReactNode;
}

export default function Input({
  label,
  className = '',
  id,
  type,
  showPasswordToggle = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const styles =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500';

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-900 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`${styles} ${className}`}
          {...props}
        />
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 min-w-[48px] min-h-[48px]"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
