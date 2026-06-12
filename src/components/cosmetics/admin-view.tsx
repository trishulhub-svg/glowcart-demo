'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';
import { type Order, ADMIN_STATS, DEMO_USERS, PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrishulHubBadge } from '@/components/cosmetics/trishulhub-footer';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  UserPlus,
  Box,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  Sparkles,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  Filter,
  IndianRupee,
  BarChart3,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

// ---- Constants ----
const ROSE = {
  50: '#fff1f2',
  100: '#ffe4e6',
  200: '#fecdd3',
  300: '#fda4af',
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
  700: '#be123c',
  800: '#9f1239',
  900: '#881337',
};

const GOLD = '#d4a853';

const CHART_COLORS = [ROSE[500], ROSE[400], ROSE[300], '#fbbf24', GOLD, ROSE[600]];

const PIE_DATA = [
  { name: 'Serums', value: 28 },
  { name: 'Lipsticks', value: 22 },
  { name: 'Foundations', value: 18 },
  { name: 'Skincare', value: 16 },
  { name: 'Others', value: 16 },
];

// ---- Status Helpers ----
const ORDER_STATUS_CONFIG: Record<
  Order['status'],
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: <Clock className="h-3 w-3" />,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  processing: {
    label: 'Processing',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    icon: <Activity className="h-3 w-3" />,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50 border-cyan-200',
    icon: <Truck className="h-3 w-3" />,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: <XCircle className="h-3 w-3" />,
  },
};

const ROLE_COLORS: Record<string, { badge: string; text: string }> = {
  admin: { badge: 'bg-red-100 text-red-700 border-red-200', text: 'Admin' },
  employee: { badge: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Employee' },
  delivery: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Delivery' },
  customer: { badge: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Customer' },
};

// ---- Navigation Items ----
const NAV_ITEMS = [
  { view: 'admin_dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { view: 'admin_products' as const, label: 'Products', icon: Package },
  { view: 'admin_orders' as const, label: 'Orders', icon: ShoppingBag },
  { view: 'admin_users' as const, label: 'Users', icon: Users },
  { view: 'admin_terms' as const, label: 'Terms', icon: FileText },
];

// ---- Format Helpers ----
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ---- Animation Variants ----
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

// ============================
// Main Admin View Component
// ============================
export default function AdminView() {
  const { currentView, setView, currentUser, logout, orders, products, updateOrderStatus } =
    useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  // ---- Filtered Data ----
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const demoUsersList = Object.values(DEMO_USERS);

  // ---- Stock Level Indicator ----
  function getStockLevel(count: number): { color: string; label: string; barColor: string } {
    if (count === 0) return { color: 'text-red-600', label: 'Out of Stock', barColor: 'bg-red-500' };
    if (count < 50) return { color: 'text-amber-600', label: 'Low Stock', barColor: 'bg-amber-500' };
    return { color: 'text-emerald-600', label: 'In Stock', barColor: 'bg-emerald-500' };
  }

  // ---- Handle Order Click ----
  function handleOrderClick(order: Order) {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  }

  // =====================
  // Sidebar Component
  // =====================
  function Sidebar() {
    return (
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar panel */}
        <aside
          className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-rose-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo */}
          <div className="flex h-18 items-center gap-3.5 border-b border-rose-100 px-5 py-3">
            <div className="relative h-11 w-11 flex-shrink-0">
              <Image src="/trishulhub-logo.png" alt="TrishulHub" width={44} height={44} className="object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Glow<span className="text-rose-500">Cart</span>
              </h1>
              <div className="mt-0.5">
                <span className="text-[11px] text-gray-500 font-medium">by Trishul<span className="text-sky-600">Hub</span></span>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                Admin Panel
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    setView(item.view);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      isActive ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* TrishulHub branding */}
          <div className="py-3 px-3 border-t border-gray-100">
            <TrishulHubBadge variant="light" />
          </div>

          {/* User info at bottom */}
          <div className="border-t border-rose-100 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-rose-200">
                <AvatarFallback className="bg-rose-100 text-xs font-semibold text-rose-600">
                  {currentUser?.avatar || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {currentUser?.name || 'Admin'}
                </p>
                <p className="truncate text-xs text-gray-400">{currentUser?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // =====================
  // Stat Card Component
  // =====================
  function StatCard({
    title,
    value,
    growth,
    icon,
    gradient,
  }: {
    title: string;
    value: string;
    growth: number;
    icon: React.ReactNode;
    gradient: string;
  }) {
    const isPositive = growth > 0;
    return (
      <motion.div variants={staggerItem} className="min-w-0">
        <Card className="relative overflow-hidden border-0 shadow-md shadow-gray-100/50 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {title}
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">{value}</p>
                <div className="flex items-center gap-1.5">
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {growth}%
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${gradient} shadow-sm`}
              >
                {icon}
              </div>
            </div>
          </CardContent>
          {/* Decorative accent */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-rose-400 to-pink-500 opacity-60" />
        </Card>
      </motion.div>
    );
  }

  // =====================
  // Dashboard View
  // =====================
  function DashboardView() {
    return (
      <motion.div
        key="dashboard"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back, {currentUser?.name?.split(' ')[0]}! Here&apos;s your overview.</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-700"
              onClick={() => setView('admin_products')}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Product
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => setView('admin_orders')}
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
              View Orders
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(ADMIN_STATS.totalRevenue)}
            growth={ADMIN_STATS.revenueGrowth}
            icon={<IndianRupee className="h-5 w-5 text-rose-600" />}
            gradient="bg-rose-50"
          />
          <StatCard
            title="Total Orders"
            value={ADMIN_STATS.totalOrders.toLocaleString('en-IN')}
            growth={ADMIN_STATS.orderGrowth}
            icon={<ShoppingCart className="h-5 w-5 text-pink-600" />}
            gradient="bg-pink-50"
          />
          <StatCard
            title="Total Customers"
            value={ADMIN_STATS.totalCustomers.toLocaleString('en-IN')}
            growth={ADMIN_STATS.customerGrowth}
            icon={<UserPlus className="h-5 w-5 text-amber-600" />}
            gradient="bg-amber-50"
          />
          <StatCard
            title="Total Products"
            value={ADMIN_STATS.totalProducts.toLocaleString('en-IN')}
            growth={ADMIN_STATS.productGrowth}
            icon={<Box className="h-5 w-5 text-emerald-600" />}
            gradient="bg-emerald-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Card className="border-0 shadow-md shadow-gray-100/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Revenue Overview
                    </CardTitle>
                    <CardDescription>Monthly revenue for the last 6 months</CardDescription>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                    <BarChart3 className="h-4 w-4 text-rose-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ADMIN_STATS.monthlyRevenue} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        tickFormatter={(v) => `₹${v / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #fecdd3',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#revenueGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      />
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={ROSE[500]} />
                          <stop offset="100%" stopColor={ROSE[300]} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Pie Chart */}
          <motion.div variants={staggerItem}>
            <Card className="h-full border-0 shadow-md shadow-gray-100/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Sales by Category
                    </CardTitle>
                    <CardDescription>Product distribution</CardDescription>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <Star className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {PIE_DATA.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #fecdd3',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [`${value}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
                  {PIE_DATA.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i] }}
                      />
                      <span className="text-[11px] text-gray-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders + Top Products */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5">
          {/* Recent Orders */}
          <motion.div variants={staggerItem} className="lg:col-span-3">
            <Card className="border-0 shadow-md shadow-gray-100/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Recent Orders
                    </CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => setView('admin_orders')}
                  >
                    View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-80 overflow-y-auto overflow-x-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase text-gray-400">
                          Order
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-gray-400">
                          Customer
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-gray-400">
                          Total
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase text-gray-400">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ADMIN_STATS.recentOrders.slice(0, 5).map((order) => {
                        const cfg = ORDER_STATUS_CONFIG[order.status];
                        return (
                          <TableRow
                            key={order.id}
                            className="cursor-pointer"
                            onClick={() => handleOrderClick(order)}
                          >
                            <TableCell className="font-mono text-xs font-semibold text-gray-700">
                              {order.id}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {order.customerName}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-gray-800">
                              {formatCurrency(order.total)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`gap-1 border text-[11px] font-medium ${cfg.color} ${cfg.bg}`}
                              >
                                {cfg.icon}
                                {cfg.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Card className="h-full border-0 shadow-md shadow-gray-100/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Top Products
                    </CardTitle>
                    <CardDescription>Best sellers this month</CardDescription>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ADMIN_STATS.topProducts.map((product, i) => {
                    const maxSales = ADMIN_STATS.topProducts[0].sales;
                    const percentage = Math.round((product.sales / maxSales) * 100);
                    return (
                      <div key={product.name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-xs font-bold text-rose-500">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] sm:max-w-[160px]">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            {product.sales} sold
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={staggerItem}>
          <Card className="border-0 shadow-md shadow-gray-100/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 border-rose-100 py-4 text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                  onClick={() => toast.info('Product creation is a demo feature')}
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-xs font-medium">Add Product</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 border-amber-100 py-4 text-amber-600 hover:bg-amber-50 hover:border-amber-200"
                  onClick={() => setView('admin_orders')}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="text-xs font-medium">Manage Orders</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 border-emerald-100 py-4 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                  onClick={() => toast.info('Report generation is a demo feature')}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs font-medium">View Reports</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 border-purple-100 py-4 text-purple-600 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => setView('admin_users')}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-medium">Manage Users</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // =====================
  // Products View
  // =====================
  function ProductsView() {
    return (
      <motion.div
        key="products"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
            <p className="text-sm text-gray-500">
              Manage your product catalog ({products.length} total)
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-700"
            onClick={() => toast.info('Product creation is a demo feature')}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search/Filter Bar */}
        <Card className="border-0 shadow-md shadow-gray-100/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-sm text-gray-700 outline-none transition-colors focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="h-4 w-4" />
                <span>{filteredProducts.length} products</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-0 shadow-md shadow-gray-100/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-gray-50/50">
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Product
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Brand
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Price
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Stock
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stock = getStockLevel(product.stockCount);
                    const stockPercent = Math.min(
                      (product.stockCount / 500) * 100,
                      100
                    );
                    return (
                      <TableRow key={product.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-lg">
                              {product.image}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 max-w-[200px] truncate">
                                {product.name}
                              </p>
                              <p className="text-[11px] text-gray-400">ID: {product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{product.brand}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[11px] font-medium">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="ml-1.5 text-xs text-gray-400 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${stock.color}`}>
                                {product.stockCount}
                              </span>
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full ${stock.barColor}`}
                                  style={{ width: `${stockPercent}%` }}
                                />
                              </div>
                            </div>
                            <span className={`text-[11px] font-medium ${stock.color}`}>
                              {stock.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.inStock ? (
                            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="border-red-200 bg-red-50 text-red-700 text-[11px]">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() =>
                                  toast.info('Product editing is a demo feature')
                                }
                              >
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  toast.error('Product deletion is a demo feature')
                                }
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // =====================
  // Orders View
  // =====================
  function OrdersView() {
    return (
      <motion.div
        key="orders"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h2>
            <p className="text-sm text-gray-500">
              Manage customer orders ({orders.length} total)
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Filter:</span>
            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <Card className="border-0 shadow-md shadow-gray-100/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-gray-50/50">
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Order ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Customer
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Items
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Total
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-300" />
                          <p className="text-sm text-gray-400">No orders found for this filter</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const cfg = ORDER_STATUS_CONFIG[order.status];
                      return (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer group"
                          onClick={() => handleOrderClick(order)}
                        >
                          <TableCell className="font-mono text-xs font-semibold text-rose-600">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {order.customerName}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {order.customerEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-gray-800">
                            {formatCurrency(order.total)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`gap-1 border text-[11px] font-medium ${cfg.color} ${cfg.bg}`}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={order.status}
                              onValueChange={(val) =>
                                updateOrderStatus(order.id, val as Order['status'])
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
          <DialogContent className="w-[95vw] max-w-lg">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="font-mono text-rose-600">{selectedOrder.id}</span>
                    <Badge
                      variant="outline"
                      className={`gap-1 border text-[11px] font-medium ${ORDER_STATUS_CONFIG[selectedOrder.status].color} ${ORDER_STATUS_CONFIG[selectedOrder.status].bg}`}
                    >
                      {ORDER_STATUS_CONFIG[selectedOrder.status].icon}
                      {ORDER_STATUS_CONFIG[selectedOrder.status].label}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Order placed on {formatDate(selectedOrder.createdAt)}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1">Customer</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedOrder.customerName}
                    </p>
                    <p className="text-xs text-gray-500">{selectedOrder.customerEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity} x {formatCurrency(item.price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-medium text-gray-700">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>

                  {/* Update Status */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">Update Status</span>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(val) => {
                        updateOrderStatus(selectedOrder.id, val as Order['status']);
                        setSelectedOrder({
                          ...selectedOrder,
                          status: val as Order['status'],
                        });
                        toast.success(`Order ${selectedOrder.id} updated to ${val}`);
                      }}
                    >
                      <SelectTrigger className="w-[150px] h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOrderDetailOpen(false)}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  }

  // =====================
  // Users View
  // =====================
  function UsersView() {
    const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>(
      Object.fromEntries(demoUsersList.map((u) => [u.id, true]))
    );

    function toggleUserStatus(userId: string) {
      setUserStatuses((prev) => {
        const newStatus = !prev[userId];
        toast.success(`User ${newStatus ? 'activated' : 'deactivated'} (demo)`);
        return { ...prev, [userId]: newStatus };
      });
    }

    return (
      <motion.div
        key="users"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">
            Manage user accounts and roles ({demoUsersList.length} demo users)
          </p>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-md shadow-gray-100/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <Table className="min-w-[650px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-gray-50/50">
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      User
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Role
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Phone
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-gray-500 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoUsersList.map((user) => {
                    const roleStyle = ROLE_COLORS[user.role];
                    const isActive = userStatuses[user.id] !== false;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-rose-100">
                              <AvatarFallback className="bg-rose-50 text-xs font-semibold text-rose-600">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                              <p className="text-[11px] text-gray-400 font-mono">{user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] font-semibold border ${roleStyle.badge}`}
                          >
                            {roleStyle.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{user.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] font-medium border ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => toast.info('User editing is a demo feature')}
                              >
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {isActive ? (
                                  <>
                                    <XCircle className="mr-2 h-3.5 w-3.5" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  toast.error('User deletion is a demo feature')
                                }
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // =====================
  // Terms View
  // =====================
  function TermsView() {
    return (
      <motion.div
        key="terms"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Terms & Conditions
          </h2>
          <p className="text-sm text-gray-500">View-only document management</p>
        </div>

        <Card className="border-0 shadow-md shadow-gray-100/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  GlowCart Terms of Service
                </CardTitle>
                <CardDescription>Last updated: January 6, 2025</CardDescription>
              </div>
              <Badge className="bg-rose-50 text-rose-600 border border-rose-200 text-[11px]">
                <Eye className="mr-1 h-3 w-3" />
                View Only
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">1. Acceptance of Terms</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                By accessing and using GlowCart (&quot;the Platform&quot;), you agree to be bound by
                these Terms of Service. GlowCart is a cosmetic e-commerce platform that
                connects customers with beauty and skincare products from various brands.
              </p>
            </section>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">2. User Accounts</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Users must register for an account to make purchases. You are responsible for
                maintaining the confidentiality of your account credentials. GlowCart offers
                different account types including Customer, Employee, Delivery Partner, and
                Admin roles, each with specific permissions and access levels.
              </p>
            </section>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">3. Products & Pricing</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                All product prices are listed in Indian Rupees (INR) and include applicable
                taxes. GlowCart reserves the right to modify prices at any time without prior
                notice. Promotional discounts and offers are subject to terms specified at the
                time of promotion.
              </p>
            </section>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">4. Orders & Shipping</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Orders are confirmed upon payment verification. GlowCart partners with verified
                delivery services to ensure timely delivery. Estimated delivery times may vary
                based on location and availability. Order status can be tracked through the
                platform in real-time.
              </p>
            </section>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">5. Returns & Refunds</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Unopened products may be returned within 7 days of delivery. Refunds are
                processed to the original payment method within 5-7 business days. Damaged or
                incorrect items must be reported within 48 hours of delivery with photographic
                evidence.
              </p>
            </section>
            <Separator />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">6. Privacy & Data</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Personal data is collected and processed in accordance with our Privacy Policy.
                GlowCart uses industry-standard encryption to protect payment information. User
                data is never shared with third parties without explicit consent.
              </p>
            </section>
            <Separator />
            <div className="rounded-lg bg-rose-50 p-4 border border-rose-100">
              <p className="text-xs text-rose-600 font-medium">
                This is a demo application for demonstration purposes only. No real transactions
                or data are processed.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // =====================
  // Render
  // =====================
  function renderSubView() {
    switch (currentView) {
      case 'admin_dashboard':
        return <DashboardView />;
      case 'admin_products':
        return <ProductsView />;
      case 'admin_orders':
        return <OrdersView />;
      case 'admin_users':
        return <UsersView />;
      case 'admin_terms':
        return <TermsView />;
      default:
        return <DashboardView />;
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50/80">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar (Mobile) */}
        <div className="flex h-14 items-center gap-2 border-b border-gray-100 bg-white px-2 sm:px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
              <Image src="/trishulhub-logo.png" alt="TrishulHub" width={36} height={36} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight">
                Glow<span className="text-rose-500">Cart</span>
              </span>
              <span className="text-[8px] sm:text-[10px] text-gray-500 font-medium leading-tight">by Trishul<span className="text-sky-600">Hub</span></span>
            </div>
          </div>
          <div className="ml-auto">
            <Avatar className="h-8 w-8 border border-rose-200">
              <AvatarFallback className="bg-rose-50 text-xs font-semibold text-rose-600">
                {currentUser?.avatar || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 lg:h-screen">
          <AnimatePresence mode="wait">{renderSubView()}</AnimatePresence>
        </div>
      </main>
    </div>
  );
}
