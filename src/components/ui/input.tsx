import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const styles =
      'w-full px-4 py-3 border border-gray-500 rounded-lg placeholder:text-gray-500 ';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`${styles} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
