'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Truck,
  History,
  User,
  Package,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  Navigation,
  CheckCircle2,
  Bike,
  Zap,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { type Order, type Shipment } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { TrishulHubFooter } from '@/components/cosmetics/trishulhub-footer';

// ─── Shipment Status Badge ─────────────────────────────────────────────────
function ShipmentStatusBadge({ status }: { status: Shipment['status'] }) {
  const config: Record<Shipment['status'], { label: string; className: string }> = {
    picked_up: { label: 'Picked Up', className: 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100' },
    in_transit: { label: 'In Transit', className: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100' },
    out_for_delivery: { label: 'Out for Delivery', className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' },
    delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100' },
  };
  const c = config[status];
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
}

// ─── Format helpers ────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Animation Variants ────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

// ─── Status Flow for delivery ──────────────────────────────────────────────
const DELIVERY_STATUS_FLOW: { key: Shipment['status']; label: string; icon: typeof Package; color: string }[] = [
  { key: 'picked_up', label: 'Picked Up', icon: Package, color: 'bg-violet-500 hover:bg-violet-600' },
  { key: 'in_transit', label: 'In Transit', icon: Navigation, color: 'bg-sky-500 hover:bg-sky-600' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'bg-amber-500 hover:bg-amber-600' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'bg-emerald-500 hover:bg-emerald-600' },
];

function getStatusIndex(status: Shipment['status']): number {
  return DELIVERY_STATUS_FLOW.findIndex((s) => s.key === status);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELIVERY VIEW
// ═══════════════════════════════════════════════════════════════════════════════
export default function DeliveryView() {
  const {
    currentView,
    orders,
    shipments,
    updateShipmentStatus,
    setView,
    logout,
    currentUser,
  } = useAppStore();
  const { toast } = useToast();

  // ─── Derived data ────────────────────────────────────────────────────────
  const activeShipments = useMemo(
    () => shipments.filter((s) => s.status !== 'delivered'),
    [shipments]
  );

  const completedShipments = useMemo(
    () => shipments.filter((s) => s.status === 'delivered'),
    [shipments]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'delivered'),
    [orders]
  );

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleUpdateStatus = (shipmentId: string, newStatus: Shipment['status'], location: string) => {
    updateShipmentStatus(shipmentId, newStatus, location);
    toast({
      title: 'Status Updated',
      description: `Shipment updated to ${newStatus.replace(/_/g, ' ')}`,
    });
  };

  const handleStartDelivery = () => {
    const nextPending = activeShipments.find((s) => s.status === 'picked_up');
    if (nextPending) {
      setView('delivery_active');
      toast({
        title: 'Delivery Started',
        description: `Now handling ${nextPending.orderId}`,
      });
    } else {
      toast({
        title: 'No Pending Pickups',
        description: 'All assigned shipments are in progress.',
      });
    }
  };

  // ─── Active tab derived from view ────────────────────────────────────────
  const activeTab = currentView === 'delivery_active'
    ? 'active'
    : currentView === 'delivery_history'
    ? 'history'
    : currentView === 'delivery_profile'
    ? 'profile'
    : 'home';

  const handleTabChange = (tab: string) => {
    if (tab === 'home') setView('delivery_dashboard');
    else if (tab === 'active') setView('delivery_active');
    else if (tab === 'history') setView('delivery_history');
    else if (tab === 'profile') setView('delivery_profile');
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50/60 via-white to-amber-50/30">
      {/* ─── Top Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-lg flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image src="/trishulhub-logo.png" alt="TrishulHub" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Delivery Hub
            </span>
            <span className="text-[11px] text-gray-500 font-medium ml-0.5 self-end mb-0.5">by Trishul<span className="text-sky-600">Hub</span></span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">{currentUser?.name || 'Driver'}</p>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-rose-50 text-rose-700 border-rose-200">
                Delivery
              </Badge>
            </div>
            <Avatar className="h-8 w-8 border-2 border-rose-200">
              <AvatarFallback className="bg-rose-100 text-rose-700 text-xs font-semibold">
                {currentUser?.avatar || 'AP'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-5 pb-20">
        <AnimatePresence mode="wait">
          {currentView === 'delivery_dashboard' && (
            <motion.div
              key="del-dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DeliveryDashboard
                activeShipments={activeShipments}
                completedShipments={completedShipments}
                orders={orders}
                onStartDelivery={handleStartDelivery}
                onUpdateStatus={handleUpdateStatus}
              />
            </motion.div>
          )}

          {currentView === 'delivery_active' && (
            <motion.div
              key="del-active"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DeliveryActive
                activeShipments={activeShipments}
                orders={orders}
                onUpdateStatus={handleUpdateStatus}
              />
            </motion.div>
          )}

          {currentView === 'delivery_history' && (
            <motion.div
              key="del-history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DeliveryHistory
                completedShipments={completedShipments}
                completedOrders={completedOrders}
                orders={orders}
              />
            </motion.div>
          )}

          {currentView === 'delivery_profile' && (
            <motion.div
              key="del-profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DeliveryProfile
                currentUser={currentUser}
                completedShipments={completedShipments}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <TrishulHubFooter variant="light" />

      {/* ─── Bottom Tab Navigation ────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-rose-100 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-lg flex items-center justify-around py-1.5 px-2 min-h-[52px]">
          {[
            { key: 'home', label: 'Home', icon: Home, view: 'delivery_dashboard' },
            { key: 'active', label: 'Active', icon: Truck, view: 'delivery_active' },
            { key: 'history', label: 'History', icon: History, view: 'delivery_history' },
            { key: 'profile', label: 'Profile', icon: User, view: 'delivery_profile' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all min-h-[44px] min-w-[44px] ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 scale-105'
                    : 'text-muted-foreground hover:text-rose-400'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-rose-600' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="deliveryTabIndicator"
                    className="h-0.5 w-4 rounded-full bg-rose-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Delivery Dashboard ────────────────────────────────────────────────────
function DeliveryDashboard({
  activeShipments,
  completedShipments,
  orders,
  onStartDelivery,
  onUpdateStatus,
}: {
  activeShipments: Shipment[];
  completedShipments: Shipment[];
  orders: Order[];
  onStartDelivery: () => void;
  onUpdateStatus: (id: string, status: Shipment['status'], location: string) => void;
}) {
  const stats = [
    { label: 'Active', value: activeShipments.length, icon: Truck, color: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-200' },
    { label: 'Done Today', value: completedShipments.length, icon: CheckCircle2, color: 'from-emerald-500 to-green-500', shadow: 'shadow-emerald-200' },
    { label: 'Pickups', value: activeShipments.filter((s) => s.status === 'picked_up').length, icon: Package, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-200' },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image src="/trishulhub-logo.png" alt="TrishulHub" width={32} height={32} className="object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Delivery <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Hub</span>
          </h1>
          <span className="text-[11px] text-gray-500 font-medium ml-0.5">by Trishul<span className="text-sky-600">Hub</span></span>
        </div>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your deliveries on the go.</p>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-2 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="border-0 shadow-md text-center overflow-hidden">
              <CardContent className="p-3">
                <div className={`mx-auto mb-1.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-md ${stat.shadow}`}>
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <p className="text-lg sm:text-xl font-bold">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
              </CardContent>
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Start Delivery CTA */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStartDelivery}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3.5 text-white font-semibold shadow-lg shadow-rose-200 transition-all"
      >
        <Zap className="h-5 w-5" />
        Start Delivery
      </motion.button>

      {/* Active Delivery Cards */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Navigation className="h-4 w-4 text-rose-500" />
          Active Deliveries
        </h2>
        <div className="space-y-3">
          {activeShipments.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                <p className="text-sm text-muted-foreground">No active deliveries</p>
              </CardContent>
            </Card>
          ) : (
            activeShipments.map((shipment, i) => {
              const order = orders.find((o) => o.id === shipment.orderId);
              return (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm font-bold text-rose-700">{shipment.orderId}</p>
                          <p className="text-sm font-medium">{order?.customerName || 'Customer'}</p>
                        </div>
                        <ShipmentStatusBadge status={shipment.status} />
                      </div>

                      <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{order?.shippingAddress || 'Address on file'}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          ETA: {shipment.estimatedDelivery}
                        </div>
                        <span className="font-medium text-rose-600">{shipment.currentLocation}</span>
                      </div>

                      {/* Quick status update */}
                      <div className="flex gap-2">
                        {DELIVERY_STATUS_FLOW.slice(getStatusIndex(shipment.status) + 1, getStatusIndex(shipment.status) + 2).map((step) => (
                          <Button
                            key={step.key}
                            size="sm"
                            className={`flex-1 text-xs text-white shadow-sm ${step.color}`}
                            onClick={() =>
                              onUpdateStatus(shipment.id, step.key, shipment.currentLocation)
                            }
                          >
                            <step.icon className="h-3.5 w-3.5 mr-1" />
                            {step.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delivery Active ───────────────────────────────────────────────────────
function DeliveryActive({
  activeShipments,
  orders,
  onUpdateStatus,
}: {
  activeShipments: Shipment[];
  orders: Order[];
  onUpdateStatus: (id: string, status: Shipment['status'], location: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Active Deliveries</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {activeShipments.length} shipment{activeShipments.length !== 1 ? 's' : ''} in progress
        </p>
      </div>

      {activeShipments.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">All deliveries complete!</p>
            <p className="text-sm text-muted-foreground">No active shipments right now.</p>
          </CardContent>
        </Card>
      ) : (
        activeShipments.map((shipment, i) => {
          const order = orders.find((o) => o.id === shipment.orderId);
          const currentIdx = getStatusIndex(shipment.status);

          return (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-mono text-rose-700">{shipment.orderId}</CardTitle>
                      <CardDescription>{order?.customerName || 'Customer'}</CardDescription>
                    </div>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Address */}
                  <div className="rounded-xl bg-rose-50/70 p-3 border border-rose-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-rose-700 mb-0.5">Delivery Address</p>
                        <p className="text-sm">{order?.shippingAddress || 'Address on file'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="relative rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 aspect-[16/9] sm:h-36 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-2 left-4 w-20 h-0.5 bg-slate-400 rotate-12" />
                      <div className="absolute top-8 left-10 w-32 h-0.5 bg-slate-400 -rotate-6" />
                      <div className="absolute bottom-4 right-6 w-24 h-0.5 bg-slate-400 rotate-3" />
                      <div className="absolute top-14 right-10 w-16 h-0.5 bg-slate-400 -rotate-12" />
                      <div className="absolute bottom-10 left-8 w-28 h-0.5 bg-slate-400 rotate-8" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">{shipment.currentLocation}</p>
                      <p className="text-[10px] text-slate-400">Live tracking available</p>
                    </div>
                  </div>

                  {/* Status Timeline / Progress */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Delivery Progress
                    </p>
                    <div className="flex items-center gap-1">
                      {DELIVERY_STATUS_FLOW.map((step, idx) => {
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 ring-4 ring-rose-100'
                                    : 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              <step.icon className="h-4 w-4" />
                            </div>
                            <span
                              className={`text-[10px] font-medium text-center leading-tight ${
                                isCompleted ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Update Status
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DELIVERY_STATUS_FLOW.map((step) => {
                        const isNextStep = getStatusIndex(step.key) === currentIdx + 1;
                        const isPast = getStatusIndex(step.key) <= currentIdx;
                        return (
                          <Button
                            key={step.key}
                            size="sm"
                            disabled={isPast}
                            className={`text-xs min-h-[44px] ${
                              isNextStep
                                ? `${step.color} text-white shadow-sm`
                                : isPast
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-slate-50 text-slate-400 border border-slate-200'
                            }`}
                            onClick={() =>
                              onUpdateStatus(shipment.id, step.key, shipment.currentLocation)
                            }
                          >
                            {isPast && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {step.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

// ─── Delivery History ──────────────────────────────────────────────────────
function DeliveryHistory({
  completedShipments,
  completedOrders,
  orders,
}: {
  completedShipments: Shipment[];
  completedOrders: Order[];
  orders: Order[];
}) {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month'>('all');

  // Combine shipments and delivered orders for history
  const historyItems = useMemo(() => {
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    return deliveredOrders.map((order) => {
      const shipment = completedShipments.find((s) => s.orderId === order.id);
      return {
        orderId: order.id,
        customer: order.customerName,
        date: order.updatedAt,
        status: shipment?.status || ('delivered' as const),
        address: order.shippingAddress,
        total: order.total,
      };
    });
  }, [orders, completedShipments]);

  const filteredHistory = useMemo(() => {
    if (filterPeriod === 'all') return historyItems;
    const now = new Date();
    const cutoff = filterPeriod === 'week'
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return historyItems.filter((item) => new Date(item.date) >= cutoff);
  }, [historyItems, filterPeriod]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Delivery History</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {historyItems.length} completed deliver{historyItems.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        {(['all', 'week', 'month'] as const).map((period) => (
          <Button
            key={period}
            size="sm"
            variant={filterPeriod === period ? 'default' : 'outline'}
            className={`text-xs min-h-[44px] whitespace-nowrap ${
              filterPeriod === period
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'border-rose-200 text-rose-700 hover:bg-rose-50'
            }`}
            onClick={() => setFilterPeriod(period)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {period === 'all' ? 'All Time' : period === 'week' ? 'This Week' : 'This Month'}
          </Button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-14">
            <History className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm text-muted-foreground">No delivery history found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, i) => (
            <motion.div
              key={item.orderId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-rose-700">{item.orderId}</p>
                        <p className="text-sm font-medium">{item.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Delivered
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(item.date)}</p>
                    </div>
                  </div>

                  <Separator className="my-3 bg-rose-100/50" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[120px] sm:max-w-[180px] text-xs">{item.address}</span>
                    </div>
                    <span className="font-semibold text-xs">{formatCurrency(item.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delivery Profile ──────────────────────────────────────────────────────
function DeliveryProfile({
  currentUser,
  completedShipments,
}: {
  currentUser: { id: string; name: string; email: string; phone: string; avatar: string; role: string } | null;
  completedShipments: Shipment[];
}) {
  // Demo stats
  const profileStats = {
    totalDeliveries: 247,
    rating: 4.8,
    onTimePercent: 96,
  };

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-rose-500 to-pink-500" />
        <CardContent className="p-3 sm:p-4 -mt-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left gap-3 sm:gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-rose-100 text-rose-700 text-xl font-bold">
                {currentUser?.avatar || 'AP'}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h2 className="text-lg font-bold">{currentUser?.name || 'Driver'}</h2>
              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
                Delivery Partner
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{currentUser?.email || 'driver@glowcart.demo'}</p>
            </div>
          </div>
          <Separator className="bg-rose-100/50" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{currentUser?.phone || '+91 98765 43212'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center rounded-xl bg-rose-50/70 p-2 sm:p-3 border border-rose-100">
              <p className="text-lg sm:text-2xl font-bold text-rose-700">{profileStats.totalDeliveries}</p>
              <p className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">Total Deliveries</p>
            </div>
            <div className="text-center rounded-xl bg-amber-50/70 p-2 sm:p-3 border border-amber-100">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-amber-500" />
                <p className="text-lg sm:text-2xl font-bold text-amber-700">{profileStats.rating}</p>
              </div>
              <p className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">Rating</p>
            </div>
            <div className="text-center rounded-xl bg-emerald-50/70 p-2 sm:p-3 border border-emerald-100 col-span-2 sm:col-span-1">
              <p className="text-lg sm:text-2xl font-bold text-emerald-700">{profileStats.onTimePercent}%</p>
              <p className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">On-Time</p>
            </div>
          </div>

          {/* Rating Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">On-time delivery rate</span>
              <span className="text-xs font-bold text-emerald-600">{profileStats.onTimePercent}%</span>
            </div>
            <Progress value={profileStats.onTimePercent} className="h-2 [&>div]:bg-emerald-500" />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Customer satisfaction</span>
              <span className="text-xs font-bold text-amber-600">{(profileStats.rating / 5 * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(profileStats.rating / 5) * 100} className="h-2 [&>div]:bg-amber-500" />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bike className="h-4 w-4 text-rose-500" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200">
                <Bike className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">Honda Activa 6G</p>
                <p className="text-xs text-muted-foreground">MH-01-AB-1234</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/70 p-2 border border-rose-100">
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">Two Wheeler</p>
              </div>
              <div className="rounded-lg bg-white/70 p-2 border border-rose-100">
                <p className="text-muted-foreground">Fuel</p>
                <p className="font-medium">Petrol</p>
              </div>
              <div className="rounded-lg bg-white/70 p-2 border border-rose-100">
                <p className="text-muted-foreground">Year</p>
                <p className="font-medium">2023</p>
              </div>
              <div className="rounded-lg bg-white/70 p-2 border border-rose-100">
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
