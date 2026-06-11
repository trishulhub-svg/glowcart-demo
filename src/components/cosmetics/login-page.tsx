'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Briefcase, Truck, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { type UserRole } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TrishulHubFooter } from '@/components/cosmetics/trishulhub-footer';

// ---- Role Configuration ----
const ROLES: {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  hoverGradient: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}[] = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Full system access & analytics',
    icon: Shield,
    gradient: 'from-rose-50 to-pink-50',
    hoverGradient: 'from-rose-100 to-pink-100',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    borderColor: 'hover:border-rose-300',
  },
  {
    role: 'employee',
    label: 'Employee',
    description: 'Order processing & inventory',
    icon: Briefcase,
    gradient: 'from-amber-50 to-orange-50',
    hoverGradient: 'from-amber-100 to-orange-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    borderColor: 'hover:border-amber-300',
  },
  {
    role: 'delivery',
    label: 'Delivery Person',
    description: 'Shipments & tracking',
    icon: Truck,
    gradient: 'from-emerald-50 to-teal-50',
    hoverGradient: 'from-emerald-100 to-teal-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    borderColor: 'hover:border-emerald-300',
  },
  {
    role: 'customer',
    label: 'Customer',
    description: 'Browse & shop cosmetics',
    icon: User,
    gradient: 'from-violet-50 to-purple-50',
    hoverGradient: 'from-violet-100 to-purple-100',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    borderColor: 'hover:border-violet-300',
  },
];

// ---- Floating Cosmetic Emojis ----
const COSMETIC_ITEMS = [
  { emoji: '✨', x: '10%', y: '15%', size: 28, delay: 0, duration: 6 },
  { emoji: '💄', x: '75%', y: '10%', size: 32, delay: 1.2, duration: 7 },
  { emoji: '🌸', x: '25%', y: '70%', size: 26, delay: 0.8, duration: 5.5 },
  { emoji: '🧴', x: '80%', y: '65%', size: 30, delay: 2, duration: 6.5 },
  { emoji: '💎', x: '55%', y: '40%', size: 24, delay: 0.4, duration: 8 },
  { emoji: '🎨', x: '15%', y: '45%', size: 28, delay: 1.5, duration: 7.5 },
  { emoji: '🫧', x: '65%', y: '80%', size: 22, delay: 2.5, duration: 6 },
  { emoji: '🪷', x: '40%', y: '25%', size: 26, delay: 0.6, duration: 5 },
];

// ---- Animation Variants ----
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
};

const roleCardVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 26,
    },
  },
};

// ---- Main Component ----
export default function LoginPage() {
  const login = useAppStore((s) => s.login);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ====== LEFT PANEL — Branding ====== */}
      <motion.div
        className="relative hidden lg:flex lg:w-[55%] xl:w-[58%] flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-amber-300/30 via-transparent to-pink-400/40"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundSize: '200% 200%' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-transparent via-rose-300/20 to-amber-200/30"
            animate={{
              backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundSize: '200% 200%' }}
          />
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* Floating Cosmetic Emojis */}
        {COSMETIC_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.7, 0.5, 0.7],
              scale: [0.5, 1.1, 0.95, 1],
              y: [0, -18, 0, -18],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              repeatType: 'loop',
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            <span style={{ fontSize: item.size }}>{item.emoji}</span>
          </motion.div>
        ))}

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative w-20 h-20 flex-shrink-0 mb-2">
              <Image src="/trishulhub-logo.png" alt="TrishulHub" width={80} height={80} className="object-contain drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="text-5xl xl:text-6xl font-bold tracking-tight text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Glow
            <span className="text-amber-200">Cart</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg xl:text-xl text-white/80 font-light tracking-wide max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Premium Beauty, Delivered
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mt-8 w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-200 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          />

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-sm text-white/60 font-light max-w-xs leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            Discover curated collections of luxury cosmetics, skincare, and beauty essentials from world-class brands.
          </motion.p>

          {/* TrishulHub Badge */}
          <motion.div
            className="mt-12 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/trishulhub-logo.png"
                alt="TrishulHub"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white/90">
                A Trishul<span className="text-sky-300">Hub</span> Product
              </span>
              <span className="text-[9px] text-white/40">Technology & Innovation</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />
      </motion.div>

      {/* ====== RIGHT PANEL — Login Form ====== */}
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
        {/* Mobile Branding Header (visible only on mobile) */}
        <motion.div
          className="lg:hidden flex flex-col items-center pt-12 pb-6 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/trishulhub-logo.png" alt="TrishulHub" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Glow<span className="text-rose-500">Cart</span>
              </h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">Premium Beauty, Delivered</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-6 lg:px-12 py-8">
          <motion.div
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Demo Login
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Select a role to explore the platform. This is a demo — no real data is collected.
              </p>
            </motion.div>

            {/* Role Selection Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <AnimatePresence>
                {ROLES.map((roleConfig, index) => {
                  const IconComp = roleConfig.icon;
                  return (
                    <motion.div
                      key={roleConfig.role}
                      variants={roleCardVariants}
                      custom={index}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="col-span-1"
                    >
                      <Card
                        className={`cursor-pointer group border border-gray-200/80 bg-gradient-to-br ${roleConfig.gradient} ${roleConfig.borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-rose-100/50 py-0 gap-0 overflow-hidden`}
                        onClick={() => login(roleConfig.role)}
                      >
                        <CardContent className="p-3 sm:p-5">
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 h-10 rounded-lg ${roleConfig.iconBg} ${roleConfig.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                              <IconComp className="w-4 h-4 sm:w-5 h-5" strokeWidth={1.8} />
                            </div>
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                                  {roleConfig.label}
                                </h3>
                                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                              </div>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {roleConfig.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Quick Login Hint */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-400">
                Click any card above to instantly log in as that role
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <TrishulHubFooter variant="light" className="mt-auto" />
      </div>
    </div>
  );
}
