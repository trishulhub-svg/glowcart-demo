'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Truck,
  CheckCircle2,
  ClipboardList,
  BarChart3,
  Warehouse,
  LogOut,
  Bell,
  RefreshCw,
  ArrowRight,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { type Order, EMPLOYEE_STATS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrishulHubFooter } from '@/components/cosmetics/trishulhub-footer';

// ─── Status Badge Color Mapping ────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order['status'] }) {
  const config: Record<Order['status'], { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' },
    confirmed: { label: 'Confirmed', className: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100' },
    processing: { label: 'Processing', className: 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100' },
    shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100' },
    delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' },
  };
  const c = config[status];
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
}

// ─── Next Status Logic ─────────────────────────────────────────────────────────
function getNextStatus(current: Order['status']): Order['status'] | null {
  const flow: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const idx = flow.indexOf(current);
  return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
}

// ─── Format helpers ────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE VIEW
// ═══════════════════════════════════════════════════════════════════════════════
export default function EmployeeView() {
  const { currentView, orders, products, updateOrderStatus, setView, logout, currentUser } =
    useAppStore();
  const { toast } = useToast();

  // ─── Derived data ────────────────────────────────────────────────────────────
  const activeOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing'
      ),
    [orders]
  );

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stockCount <= 20 || !p.inStock),
    [products]
  );

  const recentActivity = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        text: `Order ${o.id} — ${o.customerName}`,
        status: o.status,
        time: formatDate(o.updatedAt),
      }));
  }, [orders]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleProcessOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const next = getNextStatus(order.status);
    if (next) {
      updateOrderStatus(orderId, next);
      toast({
        title: 'Order Updated',
        description: `${orderId} moved to ${next}`,
      });
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as Order['status']);
    toast({
      title: 'Status Changed',
      description: `${orderId} → ${newStatus}`,
    });
  };

  const handleRestock = (productName: string) => {
    toast({
      title: 'Restock Initiated',
      description: `Restock request sent for ${productName}`,
    });
  };

  // ─── Active tab derived from view ────────────────────────────────────────────
  const activeTab = currentView === 'employee_inventory'
    ? 'inventory'
    : currentView === 'employee_orders'
    ? 'orders'
    : 'dashboard';

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') setView('employee_dashboard');
    else if (tab === 'orders') setView('employee_orders');
    else if (tab === 'inventory') setView('employee_inventory');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ─── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16">
          {/* Logo */}
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              GlowCart
            </span>
            <span className="text-[9px] sm:text-[11px] text-gray-400 font-medium leading-tight">by Trishul<span className="text-sky-600">Hub</span></span>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-rose-50/80 hidden sm:flex">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white gap-1.5">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white gap-1.5">
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* User + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="relative text-rose-600 hover:text-rose-700 hover:bg-rose-50 min-h-[44px] min-w-[44px]">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                3
              </span>
            </Button>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-rose-200 min-h-[44px] min-w-[44px]">
                <AvatarFallback className="bg-rose-100 text-rose-700 text-xs font-semibold">
                  {currentUser?.avatar || 'RV'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-medium">{currentUser?.name || 'Employee'}</p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200">
                  Employee
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 min-h-[44px] min-w-[44px]"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden border-t border-rose-50 px-2 py-1">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full bg-rose-50/80">
              <TabsTrigger value="dashboard" className="flex-1 data-[state=active]:bg-rose-500 data-[state=active]:text-white text-xs gap-1 min-h-[44px]">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 data-[state=active]:bg-rose-500 data-[state=active]:text-white text-xs gap-1 min-h-[44px]">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex-1 data-[state=active]:bg-rose-500 data-[state=active]:text-white text-xs gap-1 min-h-[44px]">
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-3 sm:p-4 lg:p-6">
        <AnimatePresence mode="wait">
          {currentView === 'employee_dashboard' && (
            <motion.div
              key="emp-dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <EmployeeDashboard
                activeOrders={activeOrders}
                lowStockProducts={lowStockProducts}
                recentActivity={recentActivity}
                setView={setView}
              />
            </motion.div>
          )}

          {currentView === 'employee_orders' && (
            <motion.div
              key="emp-orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <EmployeeOrders
                activeOrders={activeOrders}
                handleProcessOrder={handleProcessOrder}
                handleStatusChange={handleStatusChange}
              />
            </motion.div>
          )}

          {currentView === 'employee_inventory' && (
            <motion.div
              key="emp-inventory"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <EmployeeInventory
                products={products}
                lowStockProducts={lowStockProducts}
                handleRestock={handleRestock}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <TrishulHubFooter variant="light" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Employee Dashboard ────────────────────────────────────────────────────
function EmployeeDashboard({
  activeOrders,
  lowStockProducts,
  recentActivity,
  setView,
}: {
  activeOrders: Order[];
  lowStockProducts: { name: string; stockCount: number; id: string }[];
  recentActivity: { id: string; text: string; status: Order['status']; time: string }[];
  setView: (v: 'employee_orders' | 'employee_inventory') => void;
}) {
  const stats = [
    {
      label: 'Orders to Process',
      value: EMPLOYEE_STATS.ordersToProcess,
      icon: Package,
      color: 'from-rose-500 to-pink-500',
      shadow: 'shadow-rose-200',
      bgLight: 'bg-rose-50',
    },
    {
      label: 'Low Stock Alerts',
      value: EMPLOYEE_STATS.lowStockAlerts,
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-200',
      bgLight: 'bg-amber-50',
    },
    {
      label: 'Pending Shipments',
      value: EMPLOYEE_STATS.pendingShipments,
      icon: Truck,
      color: 'from-sky-500 to-blue-500',
      shadow: 'shadow-sky-200',
      bgLight: 'bg-sky-50',
    },
    {
      label: 'Completed Today',
      value: EMPLOYEE_STATS.completedToday,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      shadow: 'shadow-emerald-200',
      bgLight: 'bg-emerald-50',
    },
  ];

  const quickActions = [
    { label: 'Process Orders', icon: ClipboardList, view: 'employee_orders' as const, color: 'bg-rose-500 hover:bg-rose-600' },
    { label: 'Check Inventory', icon: Warehouse, view: 'employee_inventory' as const, color: 'bg-amber-500 hover:bg-amber-600' },
    { label: 'View Reports', icon: BarChart3, view: 'employee_orders' as const, color: 'bg-violet-500 hover:bg-violet-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Good <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Morning</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your work overview for today.</p>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold mt-1.5">{stat.value}</p>
                  </div>
                  <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-md ${stat.shadow}`}>
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(action.view)}
              className={`flex items-center gap-3 ${action.color} text-white rounded-xl px-4 py-3 sm:px-5 sm:py-4 shadow-md transition-colors`}
            >
              <action.icon className="h-5 w-5" />
              <span className="font-medium">{action.label}</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-rose-500" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest order updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-lg bg-rose-50/50 px-4 py-3 border border-rose-100/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium truncate">{activity.text}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <StatusBadge status={activity.status} />
                  <span className="text-xs text-muted-foreground hidden sm:inline">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Employee Orders ───────────────────────────────────────────────────────
function EmployeeOrders({
  activeOrders,
  handleProcessOrder,
  handleStatusChange,
}: {
  activeOrders: Order[];
  handleProcessOrder: (id: string) => void;
  handleStatusChange: (id: string, status: string) => void;
}) {
  const statusOptions: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Processing</h1>
          <p className="text-muted-foreground text-sm">
            {activeOrders.length} active order{activeOrders.length !== 1 ? 's' : ''} require attention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            {activeOrders.filter((o) => o.status === 'pending').length} Pending
          </Badge>
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
            {activeOrders.filter((o) => o.status === 'processing').length} Processing
          </Badge>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">All orders are processed!</p>
            <p className="text-sm text-muted-foreground">No orders need attention right now.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg overflow-x-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-rose-50/50 hover:bg-rose-50/50">
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group hover:bg-rose-50/30 transition-colors"
                  >
                    <TableCell className="font-mono text-sm font-medium text-rose-700">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {getNextStatus(order.status) && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-sm min-h-[44px]"
                            onClick={() => handleProcessOrder(order.id)}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Process
                          </Button>
                        )}
                        <Select
                          onValueChange={(val) => handleStatusChange(order.id, val)}
                        >
                          <SelectTrigger className="w-8 h-8 sm:w-7 sm:h-7 p-0 border-0 hover:bg-rose-50 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s} value={s} className="capitalize">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            {activeOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm font-bold text-rose-700">{order.id}</p>
                    <p className="text-sm font-medium">{order.customerName}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot; {formatDate(order.createdAt)}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                  <div className="flex items-center gap-2">
                    {getNextStatus(order.status) && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm min-h-[44px] text-xs"
                        onClick={() => handleProcessOrder(order.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Process
                      </Button>
                    )}
                    <Select
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger className="w-8 h-8 sm:w-7 sm:h-7 p-0 border-0 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Employee Inventory ────────────────────────────────────────────────────
function EmployeeInventory({
  products,
  lowStockProducts,
  handleRestock,
}: {
  products: { id: string; name: string; brand: string; category: string; price: number; stockCount: number; inStock: boolean; image: string }[];
  lowStockProducts: { name: string; stockCount: number; id: string }[];
  handleRestock: (name: string) => void;
}) {
  const maxStock = Math.max(...products.map((p) => p.stockCount), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground text-sm">
            {products.length} products &middot;{' '}
            <span className="text-amber-600 font-medium">{lowStockProducts.length} low stock alerts</span>
          </p>
        </div>
        {lowStockProducts.length > 0 && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 w-fit">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            {lowStockProducts.length} items need restocking
          </Badge>
        )}
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Low Stock Items</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p) => (
              <Badge key={p.id} variant="outline" className="bg-white text-amber-700 border-amber-300">
                {p.name} ({p.stockCount} left)
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {products.map((product) => {
          const isLow = product.stockCount <= 20 || !product.inStock;
          const stockPercent = Math.round((product.stockCount / maxStock) * 100);

          return (
            <motion.div key={product.id} variants={itemVariants}>
              <Card
                className={`border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
                  isLow ? 'ring-2 ring-amber-300 ring-offset-2' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <CardTitle className="text-sm leading-tight">{product.name}</CardTitle>
                        <CardDescription className="text-xs">{product.brand}</CardDescription>
                      </div>
                    </div>
                    {isLow && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] shrink-0">
                        <AlertTriangle className="h-3 w-3 mr-0.5" />
                        Low
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{product.category}</span>
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                  </div>

                  {/* Stock Level */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Stock Level</span>
                      <span
                        className={`text-xs font-bold ${
                          product.stockCount === 0
                            ? 'text-red-600'
                            : isLow
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {product.stockCount} units
                      </span>
                    </div>
                    <Progress
                      value={stockPercent}
                      className={`h-2 ${
                        product.stockCount === 0
                          ? '[&>div]:bg-red-500'
                          : isLow
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-emerald-500'
                      }`}
                    />
                  </div>

                  <Button
                    size="sm"
                    variant={isLow ? 'default' : 'outline'}
                    className={`w-full text-xs min-h-[44px] ${
                      isLow
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm'
                        : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                    }`}
                    onClick={() => handleRestock(product.name)}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {isLow ? 'Restock Now' : 'Restock'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
