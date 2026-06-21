import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 px-3 text-sm text-ink bg-canvas-elevated border border-border-subtle rounded-lg',
            'placeholder:text-ink-muted',
            'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-150',
            error && 'border-status-alert focus:ring-status-alert/20 focus:border-status-alert',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-alert">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
