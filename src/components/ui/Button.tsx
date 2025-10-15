import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', children, ...props }, ref) => {
    const styles =
      'w-full px-4 py-3 bg-blue-200 text-black font-bold rounded-lg';

    return (
      <button ref={ref} className={`${styles} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
