'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TrishulHubFooterProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function TrishulHubFooter({ variant = 'light', className = '' }: TrishulHubFooterProps) {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white/70' : 'text-gray-500';
  const subTextColor = isDark ? 'text-white/40' : 'text-gray-400';
  const dividerColor = isDark ? 'bg-white/10' : 'bg-gray-200';

  return (
    <motion.footer
      className={`border-t ${isDark ? 'border-white/10' : 'border-gray-100'} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
        {/* Main Footer Row */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Left: TrishulHub Branding */}
          <div className="flex flex-col items-center sm:items-start">
            <span className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Trishul<span className={isDark ? 'text-sky-400' : 'text-sky-600'}>Hub</span>
            </span>
            <span className={`text-xs sm:text-sm ${isDark ? 'text-white/50' : 'text-gray-500'} mt-0.5`}>Technology & Innovation</span>
          </div>

          {/* Center: Product Badge */}
          <div className="flex items-center gap-2 order-3 sm:order-2">
            <div className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
              <span className={`text-[11px] sm:text-xs font-medium ${textColor}`}>
                GlowCart — A TrishulHub Product
              </span>
            </div>
          </div>

          {/* Right: Copyright */}
          <div className="flex items-center gap-3 order-2 sm:order-3">
            <p className={`text-[11px] sm:text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              &copy; {new Date().getFullYear()} TrishulHub
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px ${dividerColor} my-3 sm:my-4`} />

        {/* Bottom Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>Protocol v11.0</span>
          <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>·</span>
          <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>Demo Environment</span>
          <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>·</span>
          <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>No real data collected</span>
        </div>
      </div>
    </motion.footer>
  );
}

/** Compact inline version for sidebars and tight spaces */
export function TrishulHubBadge({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark';
  return (
    <div className="flex flex-col">
      <span className={`text-sm font-bold tracking-tight ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
        Trishul<span className={isDark ? 'text-sky-400' : 'text-sky-600'}>Hub</span>
      </span>
      <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-gray-400'} -mt-0.5`}>Technology & Innovation</span>
    </div>
  );
}
