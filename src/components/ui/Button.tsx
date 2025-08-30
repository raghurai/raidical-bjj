import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = `
    relative overflow-hidden rounded-xl font-medium
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-primary-600 hover:bg-primary-700 active:bg-primary-800
      text-white shadow-lg shadow-primary-500/25
      focus:ring-primary-500
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 active:bg-gray-300
      text-gray-900 shadow-md
      focus:ring-gray-500
    `,
    glass: `
      bg-white/10 backdrop-blur-md hover:bg-white/20
      border border-white/20 text-white
      shadow-lg shadow-black/10
      focus:ring-white/50
    `,
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white shadow-lg shadow-red-500/25
      focus:ring-red-500
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {children}
      </span>
    </motion.button>
  );
}
