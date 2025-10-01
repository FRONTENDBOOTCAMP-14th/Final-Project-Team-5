interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = { sm: 'size-8', md: 'size-12', lg: 'size-16' };

  return (
    <div
      role="status"
      className={`flex items-center justify-center ${className ?? ''}`}
    >
      <span
        className={`${sizes[size]} border-2 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}
