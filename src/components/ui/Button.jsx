import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, className = "", variant = "primary", ...props }) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:brightness-110",
    secondary: "bg-white border border-brand-blue/10 text-brand-blue hover:bg-brand-blue/5",
    lime: "bg-brand-lime text-brand-blue shadow-lg shadow-brand-lime/20 hover:brightness-105",
    ghost: "bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10",
    danger: "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
