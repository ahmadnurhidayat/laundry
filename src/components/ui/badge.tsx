import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'processing' | 'pending' | 'danger' | 'neutral' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
  children?: ReactNode;
}

const variants: Record<Variant, string> = {
  default: 'bg-zinc-100 text-zinc-800 border border-zinc-200',
  success: 'bg-green-50 text-green-700 border border-green-200',
  processing: 'bg-blue-50 text-blue-700 border border-blue-200',
  pending: 'bg-zinc-100 text-zinc-800 border border-zinc-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  neutral: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  info: 'bg-sky-50 text-sky-700 border border-sky-200',
};

const dotColors: Record<Variant, string> = {
  default: 'bg-zinc-500',
  success: 'bg-green-500',
  processing: 'bg-blue-500',
  pending: 'bg-zinc-500',
  danger: 'bg-red-500',
  neutral: 'bg-zinc-500',
  info: 'bg-sky-500',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-xs rounded-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
);
Badge.displayName = 'Badge';
