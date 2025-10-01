'use client';

type SnsProvider = 'kakao' | 'google';

interface SnsButtonProps {
  provider: SnsProvider;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface ProviderConfig {
  bg: string;
  hoverBg: string;
  icon: React.ReactNode;
}

const PROVIDER_CONFIGS: Record<SnsProvider, ProviderConfig> = {
  kakao: {
    bg: 'bg-[#FEE500]',
    hoverBg: 'hover:bg-[#FDD835]',
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.88 5.28 4.71 6.72-.2.73-.75 2.8-.87 3.23-.14.52.19.51.4.37.17-.11 2.75-1.85 3.19-2.17C10.24 19.05 11.11 19 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z"
          fill="#3C1E1E"
        />
      </svg>
    ),
  },
  google: {
    bg: 'bg-white',
    hoverBg: 'hover:bg-gray-50',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
};

export default function SnsButton({
  provider,
  onClick,
  disabled = false,
  className,
}: SnsButtonProps) {
  const { bg, hoverBg, icon } = PROVIDER_CONFIGS[provider];

  const classes = [
    'w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors',
    bg,
    disabled ? 'opacity-50 cursor-not-allowed' : hoverBg,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={`${provider} 로그인${disabled ? ' (비활성화)' : ''}`}
    >
      {icon}
    </button>
  );
}
