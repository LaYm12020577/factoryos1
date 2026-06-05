import React from 'react';

export const Card = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`liquid-glass rounded-[2rem] overflow-hidden ${noPadding ? "" : "p-6"} ${className}`}>
      {children}
    </div>
  );
};
