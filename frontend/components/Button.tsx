import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize | string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const currentSize = sizeStyles[size] || sizeStyles.md;

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-neutral-800 border border-black shadow-none",
    secondary: "bg-transparent text-black border border-black hover:bg-neutral-100/50 shadow-none",
    tertiary: "bg-transparent text-neutral-600 hover:text-black underline-offset-4 hover:underline",
    danger: "bg-[#ba1a1a] text-white hover:bg-red-700 shadow-none",
    ghost: "bg-transparent text-neutral-500 hover:text-black hover:bg-neutral-100/30", 
  };

  return (
    <button
      className={`${baseStyles} ${currentSize} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2 group-hover:translate-x-0.5 transition-transform">{rightIcon}</span>}
    </button>
  );
};
