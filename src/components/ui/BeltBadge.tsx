import { BeltColor } from '@prisma/client';
import { motion } from 'framer-motion';

interface BeltBadgeProps {
  belt: BeltColor;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const beltColors = {
  WHITE: {
    bg: 'bg-belt-white',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
  BLUE: {
    bg: 'bg-belt-blue',
    text: 'text-white',
    border: 'border-blue-600',
  },
  PURPLE: {
    bg: 'bg-belt-purple',
    text: 'text-white',
    border: 'border-purple-600',
  },
  BROWN: {
    bg: 'bg-belt-brown',
    text: 'text-white',
    border: 'border-amber-800',
  },
  BLACK: {
    bg: 'bg-belt-black',
    text: 'text-white',
    border: 'border-gray-800',
  },
};

const beltNames = {
  WHITE: 'White',
  BLUE: 'Blue',
  PURPLE: 'Purple',
  BROWN: 'Brown',
  BLACK: 'Black',
};

export default function BeltBadge({ belt, size = 'md', showText = true }: BeltBadgeProps) {
  const colors = beltColors[belt];
  const name = beltNames[belt];

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        relative flex items-center justify-center rounded-full
        ${colors.bg} ${colors.text} ${colors.border}
        border-2 shadow-lg
        ${sizeClasses[size]}
      `}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
      
      <span className="relative z-10 font-bold">
        {showText ? name.charAt(0) : ''}
      </span>
      
      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="ml-2 text-xs font-medium"
        >
          {name}
        </motion.span>
      )}
    </motion.div>
  );
}
