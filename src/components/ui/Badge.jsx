import React from 'react';

const statusStyles = {
  normal: "bg-normal-bg text-normal-text border-normal-border",
  high: "bg-high-bg text-high-text border-high-border",
  prediab: "bg-prediab-bg text-prediab-text border-prediab-border",
  low: "bg-low-bg text-low-text border-low-border",
  unknown: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
};

export default function Badge({ status = 'unknown', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status]} ${className}`}>
      {children || status.toUpperCase()}
    </span>
  );
}
