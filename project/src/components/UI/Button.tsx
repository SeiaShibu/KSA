import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-white/80 text-gray-700 border border-gray-300 shadow-md hover:shadow-lg';
      case 'danger':
        return 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg hover:shadow-xl';
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg hover:shadow-xl';
    }
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-xl font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        <span>{children}</span>
      </div>
    </motion.button>
  );
};

export default Button;