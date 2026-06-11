'use client';

import { motion } from 'framer-motion';
import { Sparkles, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface TrishulHubFooterProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function TrishulHubFooter({ variant = 'light', className = '' }: TrishulHubFooterProps) {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white/70' : 'text-gray-500';
  const subTextColor = isDark ? 'text-white/40' : 'text-gray-400';
  const dividerColor = isDark ? 'bg-white/10' : 'bg-gray-200';
  const linkColor = isDark ? 'text-white/60 hover:text-white/90' : 'text-gray-400 hover:text-gray-600';

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
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
              <Image
                src="/trishulhub-logo.png"
                alt="TrishulHub"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs sm:text-sm font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Trishul<span className={isDark ? 'text-sky-400' : 'text-sky-600'}>Hub</span>
              </span>
              <span className={`text-[9px] sm:text-[10px] ${subTextColor} -mt-0.5`}>Technology & Innovation</span>
            </div>
          </div>

          {/* Center: Product Badge */}
          <div className="flex items-center gap-2 order-3 sm:order-2">
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
              <Sparkles className={`w-3 h-3 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
              <span className={`text-[10px] sm:text-[11px] font-medium ${textColor}`}>
                GlowCart — A TrishulHub Product
              </span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-3">
            <a
              href="https://github.com/trishulhub-svg"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 text-[11px] sm:text-xs ${linkColor} transition-colors min-h-[32px]`}
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/trishulhub-svg/glowcart-demo"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 text-[11px] sm:text-xs ${linkColor} transition-colors min-h-[32px]`}
            >
              Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px ${dividerColor} my-3 sm:my-4`} />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <p className={`text-[10px] sm:text-[11px] ${subTextColor}`}>
            &copy; {new Date().getFullYear()} TrishulHub. All rights reserved.
          </p>
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>Protocol v11.0</span>
            <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>·</span>
            <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>Demo Environment</span>
            <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>·</span>
            <span className={`text-[9px] sm:text-[10px] ${subTextColor}`}>No real data collected</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

/** Compact inline version for sidebars and tight spaces */
export function TrishulHubBadge({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark';
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-5 h-5 flex-shrink-0">
        <Image
          src="/trishulhub-logo.png"
          alt=""
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
      <span className={`text-[10px] font-medium ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
        by TrishulHub
      </span>
    </div>
  );
}
