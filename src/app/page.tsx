'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import LoginPage from '@/components/cosmetics/login-page';
import CustomerView from '@/components/cosmetics/customer-view';
import AdminView from '@/components/cosmetics/admin-view';
import EmployeeView from '@/components/cosmetics/employee-view';
import DeliveryView from '@/components/cosmetics/delivery-view';

function ViewRouter() {
  const currentView = useAppStore((s) => s.currentView);
  const currentRole = useAppStore((s) => s.currentRole);

  // Login page
  if (currentView === 'login') {
    return <LoginPage />;
  }

  // Route to role-specific views
  if (currentRole === 'customer') {
    return <CustomerView />;
  }
  if (currentRole === 'admin') {
    return <AdminView />;
  }
  if (currentRole === 'employee') {
    return <EmployeeView />;
  }
  if (currentRole === 'delivery') {
    return <DeliveryView />;
  }

  return <LoginPage />;
}

export default function Home() {
  const currentRole = useAppStore((s) => s.currentRole);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  // Use role as key so that view transitions within same role don't unmount the whole component
  const key = isLoggedIn ? currentRole : 'login';

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ViewRouter />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
