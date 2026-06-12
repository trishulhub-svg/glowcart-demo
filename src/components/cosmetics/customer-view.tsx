'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
  MapPin,
  ArrowLeft,
  Package,
  CheckCircle2,
  Circle,
  ChevronRight,
  User,
  FileText,
  Shield,
  LogOut,
  Store,
  ClipboardList,
  Phone,
  Mail,
  Lock,
  Banknote,
  Globe,
  Gift,
  Heart,
  Sparkles,
  Clock,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { type Product, PRODUCTS, CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TrishulHubFooter } from '@/components/cosmetics/trishulhub-footer';
import { Textarea } from '@/components/ui/textarea';

// ============================================================
// Animation Variants
// ============================================================
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 },
};

// ============================================================
// Helper Functions
// ============================================================
function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-purple-100 text-purple-800 border-purple-200',
    shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return map[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function CustomerHeader() {
  const {
    setView,
    getCartCount,
    currentUser,
    logout,
    currentView,
  } = useAppStore();

  const cartCount = getCartCount();

  const navItems = [
    { view: 'customer_shop' as const, label: 'Shop', icon: Store },
    { view: 'customer_cart' as const, label: 'Cart', icon: ShoppingCart },
    { view: 'customer_orders' as const, label: 'Orders', icon: ClipboardList },
  ];

  const activeNav = navItems.find((n) => currentView.startsWith(n.view.slice(0, -4)) || currentView === n.view)?.view || 'customer_shop';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => setView('customer_shop')}
          className="flex flex-col transition-opacity hover:opacity-80"
        >
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            GlowCart
          </span>
          <span className="text-[9px] sm:text-[11px] text-gray-400 font-medium leading-tight">by Trishul<span className="text-sky-600">Hub</span></span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center sm:gap-1">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant={activeNav === item.view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView(item.view)}
              className={
                activeNav === item.view
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
              }
            >
              <item.icon className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Right Side: Cart + User */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-rose-50 min-w-[44px] min-h-[44px]"
            onClick={() => setView('customer_cart')}
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </motion.span>
            )}
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 sm:h-8 sm:w-8 rounded-full">
                <Avatar className="h-9 w-9 sm:h-8 sm:w-8 border-2 border-rose-200">
                  <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-semibold text-white">
                    {currentUser?.avatar || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-9 w-9 border-2 border-rose-200">
                  <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-semibold text-white">
                    {currentUser?.avatar || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email || ''}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setView('customer_shop')}>
                <Store className="mr-2 h-4 w-4" /> Shop
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('customer_orders')}>
                <ClipboardList className="mr-2 h-4 w-4" /> My Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setView('customer_terms')}>
                <FileText className="mr-2 h-4 w-4" /> Terms & Conditions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('customer_privacy')}>
                <Shield className="mr-2 h-4 w-4" /> Privacy Policy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


        </div>
      </div>
    </header>
  );
}

// ============================================================
// 1. CUSTOMER SHOP VIEW
// ============================================================
function CustomerShopView() {
  const { products, addToCart, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-white">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <Badge className="mb-4 border-rose-300/30 bg-white/10 text-rose-100 hover:bg-white/20">
              <Sparkles className="mr-1 h-3 w-3" /> New Arrivals
            </Badge>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Discover Your{' '}
              <span className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
                Glow
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-rose-100 sm:text-lg">
              Premium beauty essentials crafted with care. From serums to lipsticks, find everything you need for your perfect routine.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-rose-700 hover:bg-rose-50 font-semibold"
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Heart className="mr-2 h-4 w-4" /> Wishlist
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" fillOpacity="0.05" />
            <path d="M0 60V45C360 15 720 15 1080 45C1260 60 1380 55 1440 45V60H0Z" fill="rgba(255,241,242,0.5)" />
          </svg>
        </div>
      </motion.section>

      <div id="products-section" className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Category Filter Bar */}
        <div className="mb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="overflow-x-auto flex gap-2 pb-2 -mb-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                className={
                  selectedCategory === null
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shrink-0 px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap'
                    : 'shrink-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600 px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap'
                }
                onClick={() => setSelectedCategory(null)}
              >
                All Products
              </Button>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? 'default' : 'outline'}
                  size="sm"
                  className={
                    selectedCategory === cat.name
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shrink-0 px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap'
                      : 'shrink-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600 px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap'
                  }
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                  }
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                  <Badge variant="secondary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for products, brands, categories..."
            className="pl-10 border-rose-200 focus-visible:ring-rose-400 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedCategory && (
              <span>
                {' '}
                in <span className="font-medium text-rose-600">{selectedCategory}</span>
              </span>
            )}
          </p>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              onClick={() => setSelectedCategory(null)}
            >
              <X className="mr-1 h-3 w-3" /> Clear filter
            </Button>
          )}
        </div>

        {/* Product Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={staggerItem} layout>
                <Card className="group relative overflow-hidden border-rose-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-100/50 hover:-translate-y-1 hover:border-rose-200">
                  {/* Product Image/Emoji */}
                  <div className="relative flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-3 sm:p-6">
                    <span className="h-14 w-14 sm:h-20 sm:w-20 flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">
                      {product.image}
                    </span>
                    {product.featured && (
                      <Badge className="absolute left-2 top-2 bg-amber-500 text-white text-[10px] px-1.5">
                        <Star className="mr-0.5 h-2.5 w-2.5 fill-white" /> Featured
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className="absolute right-2 top-2 bg-red-500 text-white text-[10px] px-1.5">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                        <Badge variant="secondary" className="text-sm font-semibold">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3 sm:p-4">
                    <div className="mb-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-rose-500">
                        {product.brand}
                      </p>
                    </div>
                    <h3 className="mb-1.5 line-clamp-1 text-xs sm:text-sm font-semibold leading-tight text-gray-900 group-hover:text-rose-700 transition-colors">
                      {product.name}
                    </h3>
                    {renderStars(product.rating)}
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
                    <Button
                      className="w-full transition-all duration-200 text-[11px] sm:text-xs h-8 sm:h-9"
                      size="sm"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                      variant={addedId === product.id ? 'default' : 'outline'}
                      style={
                        addedId === product.id
                          ? { backgroundColor: '#16a34a', borderColor: '#16a34a', color: 'white' }
                          : undefined
                      }
                    >
                      {addedId === product.id ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" /> Add to Cart
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 2. CUSTOMER CART VIEW
// ============================================================
function CustomerCartView() {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, setView } = useAppStore();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="mb-6 text-7xl"
          >
            🛒
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven&apos;t added any products yet.
          </p>
          <Button
            className="mt-6 bg-rose-600 hover:bg-rose-700 text-white"
            onClick={() => setView('customer_shop')}
          >
            <Store className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart <span className="text-rose-600">({cart.length})</span>
          </h1>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setView('customer_shop')}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Continue Shopping
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-rose-100 bg-white">
                  <CardContent className="p-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 text-2xl sm:text-3xl">
                        {item.product.image}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-rose-500">
                            {item.product.brand}
                          </p>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {item.product.name}
                          </h3>
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-sm sm:text-base font-bold text-gray-900">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="min-w-[36px] min-h-[36px] border-rose-200 hover:bg-rose-50"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="min-w-[36px] min-h-[36px] border-rose-200 hover:bg-rose-50"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm sm:text-base font-bold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="min-w-[36px] min-h-[36px] text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-rose-100 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(999 - subtotal)} more for free shipping
                </p>
              )}
              {shipping > 0 && subtotal > 0 && (
                <Progress value={(subtotal / 999) * 100} className="h-1.5" />
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-base font-bold text-rose-600">{formatPrice(total)}</span>
              </div>
              {shipping === 0 && (
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700">
                  <Truck className="h-3.5 w-3.5" /> You qualify for free shipping!
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                size="lg"
                onClick={() => setView('customer_checkout')}
              >
                Proceed to Checkout <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 3. CUSTOMER CHECKOUT VIEW
// ============================================================
function CustomerCheckoutView() {
  const { cart, placeOrder, getCartTotal, setView, currentUser } = useAppStore();
  const [address, setAddress] = useState(
    currentUser?.name
      ? `${currentUser.name}, 42, MG Road, Mumbai, Maharashtra 400001`
      : ''
  );
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (!address.trim() || !termsAccepted) return;
    setIsPlacing(true);
    setTimeout(() => {
      placeOrder(paymentMethod, address);
      setIsPlacing(false);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800">No items to checkout</h2>
          <p className="mt-2 text-muted-foreground">Add some products to your cart first.</p>
          <Button
            className="mt-6 bg-rose-600 hover:bg-rose-700"
            onClick={() => setView('customer_shop')}
          >
            <Store className="mr-2 h-4 w-4" /> Go to Shop
          </Button>
        </motion.div>
      </div>
    );
  }

  const paymentOptions = [
    { value: 'Credit Card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
    { value: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { value: 'Net Banking', label: 'Net Banking', icon: Globe, desc: 'All major banks' },
    { value: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => setView('customer_cart')}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Cart
        </Button>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping Address */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="border-rose-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <MapPin className="h-4 w-4 text-rose-500" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className="border-rose-200 focus-visible:ring-rose-400"
                      defaultValue={currentUser?.name || ''}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+91 XXXXX XXXXX"
                      className="border-rose-200 focus-visible:ring-rose-400"
                      defaultValue={currentUser?.phone || ''}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-medium">
                    Full Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="House no., Street, City, State, PIN"
                    className="min-h-[80px] border-rose-200 focus-visible:ring-rose-400"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card className="border-rose-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="h-4 w-4 text-rose-500" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-2 grid-cols-1 sm:grid-cols-2"
                >
                  {paymentOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                        paymentMethod === opt.value
                          ? 'border-rose-400 bg-rose-50 ring-1 ring-rose-400'
                          : 'border-gray-200 hover:border-rose-200 hover:bg-rose-50/50'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="text-rose-600" />
                      <opt.icon className={`h-4 w-4 ${paymentMethod === opt.value ? 'text-rose-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>

          {/* Terms */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <div className="flex items-start gap-3 rounded-lg border border-rose-100 bg-rose-50/50 p-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                I agree to the{' '}
                <button
                  type="button"
                  className="font-medium text-rose-600 underline underline-offset-2 hover:text-rose-700"
                  onClick={() => setView('customer_terms')}
                >
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="font-medium text-rose-600 underline underline-offset-2 hover:text-rose-700"
                  onClick={() => setView('customer_privacy')}
                >
                  Privacy Policy
                </button>
              </label>
            </div>
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 border-rose-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-lg">
                        {item.product.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator />
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-base font-bold text-rose-600">{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                size="lg"
                disabled={!address.trim() || !termsAccepted || isPlacing}
                onClick={handlePlaceOrder}
              >
                {isPlacing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                  />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {isPlacing ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Smartphone icon component (for UPI payment)
function Smartphone({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

// ============================================================
// 4. CUSTOMER ORDERS VIEW
// ============================================================
function CustomerOrdersView() {
  const { orders, setView, setSelectedOrder, currentUser } = useAppStore();

  const myOrders = useMemo(
    () => orders.filter((o) => o.customerId === currentUser?.id),
    [orders, currentUser?.id]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>
      </motion.div>

      {myOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="text-lg font-semibold text-gray-700">No orders yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start shopping to see your orders here!
          </p>
          <Button
            className="mt-4 bg-rose-600 hover:bg-rose-700"
            onClick={() => setView('customer_shop')}
          >
            <Store className="mr-2 h-4 w-4" /> Shop Now
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {myOrders.map((order) => (
            <motion.div key={order.id} variants={staggerItem}>
              <Card
                className="cursor-pointer border-rose-100 bg-white transition-all hover:shadow-md hover:border-rose-200"
                onClick={() => {
                  setSelectedOrder(order.id);
                  setView('customer_order_detail');
                }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{order.id}</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          {formatDate(order.createdAt)} &middot; {order.items.length}{' '}
                          {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                        <Badge className={`text-[9px] sm:text-[10px] ${getStatusColor(order.status)}`} variant="outline">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// 5. CUSTOMER ORDER DETAIL VIEW
// ============================================================
function CustomerOrderDetailView() {
  const { orders, shipments, selectedOrderId, setView, setSelectedOrder } = useAppStore();

  const order = orders.find((o) => o.id === selectedOrderId);
  const shipment = shipments.find((s) => s.orderId === selectedOrderId);

  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">❓</div>
          <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
          <Button className="mt-4 bg-rose-600 hover:bg-rose-700" onClick={() => setView('customer_orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStatusIdx = statusOrder.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground"
          onClick={() => {
            setSelectedOrder(null);
            setView('customer_orders');
          }}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Orders
        </Button>

        <div className="mb-6 flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Order {order.id}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Badge className={`text-xs sm:text-sm shrink-0 ${getStatusColor(order.status)}`} variant="outline">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </motion.div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card className="mb-6 border-rose-100">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const isCompleted = i <= currentStatusIdx;
                  const isCurrent = i === currentStatusIdx;
                  return (
                    <div key={step.key} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={false}
                            animate={{
                              scale: isCurrent ? 1.1 : 1,
                              backgroundColor: isCompleted ? '#e11d48' : '#f3f4f6',
                            }}
                            transition={{ duration: 0.3 }}
                            className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full ${
                              isCompleted ? 'text-white' : 'text-gray-400'
                            }`}
                          >
                            <step.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </motion.div>
                          <span
                            className={`mt-1 text-[8px] sm:text-xs font-medium ${
                              isCompleted ? 'text-rose-600' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i < currentStatusIdx ? 'bg-rose-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cancelled banner */}
      {order.status === 'cancelled' && (
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <X className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-800">Order Cancelled</p>
              <p className="text-xs text-red-600">This order was cancelled on {formatDate(order.updatedAt)}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Order Items */}
      <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
        <Card className="mb-6 border-rose-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item, i) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-xl">
                    {product?.image || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} &times; {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              );
            })}
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-rose-600">{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shipping Address */}
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
        <Card className="mb-6 border-rose-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="h-4 w-4 text-rose-500" /> Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Track Shipment Button */}
      {shipment && (order.status === 'shipped' || order.status === 'processing') && (
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Button
            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            size="lg"
            onClick={() => setView('customer_tracking')}
          >
            <Truck className="mr-2 h-4 w-4" /> Track Shipment
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// 6. CUSTOMER TRACKING VIEW
// ============================================================
function CustomerTrackingView() {
  const { shipments, selectedOrderId, setView } = useAppStore();

  const shipment = shipments.find((s) => s.orderId === selectedOrderId);

  if (!shipment) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">📍</div>
          <h2 className="text-xl font-bold text-gray-800">Tracking not available</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Shipment tracking is not available for this order.
          </p>
          <Button
            className="mt-4 bg-rose-600 hover:bg-rose-700"
            onClick={() => setView('customer_orders')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = shipment.timeline.filter((t) => t.completed).length;
  const progressPercent = (completedCount / shipment.timeline.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground"
          onClick={() => setView('customer_order_detail')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Order
        </Button>
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">Track Shipment</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Order {selectedOrderId} &middot; Shipment {shipment.id}
        </p>
      </motion.div>

      {/* Current Status Card */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card className="mb-6 border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-rose-100">
                <Truck className="h-5 w-5 sm:h-7 sm:w-7 text-rose-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-rose-600">Current Location</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{shipment.currentLocation}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Estimated delivery: {shipment.estimatedDelivery}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercent} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {Math.round(progressPercent)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
        <Card className="border-rose-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Shipment Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="space-y-0">
              {shipment.timeline.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: step.completed ? 1 : 0.85,
                      }}
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full ${
                        step.completed
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </motion.div>
                    {i < shipment.timeline.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 min-h-[32px] ${
                          step.completed && shipment.timeline[i + 1]?.completed
                            ? 'bg-rose-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.status}
                    </p>
                    <p className={`text-xs ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.location}
                    </p>
                    <p className={`text-[11px] ${step.completed ? 'text-muted-foreground' : 'text-gray-300'}`}>
                      {step.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delivery Person */}
      <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
        <Card className="mt-6 border-rose-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-rose-200">
                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-semibold text-white">
                  {shipment.deliveryPersonName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{shipment.deliveryPersonName}</p>
                <p className="text-xs text-muted-foreground">Delivery Partner</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8 border-rose-200 hover:bg-rose-50">
                  <Phone className="h-3.5 w-3.5 text-rose-600" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 border-rose-200 hover:bg-rose-50">
                  <Mail className="h-3.5 w-3.5 text-rose-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============================================================
// 7. CUSTOMER TERMS VIEW
// ============================================================
function CustomerTermsView() {
  const { setView } = useAppStore();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using the GlowCart website and mobile application (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use the Service. These Terms constitute a legally binding agreement between you ("User," "you," or "your") and GlowCart Private Limited ("GlowCart," "we," "us," or "our").

We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Service. Your continued use of the Service following the posting of revised Terms constitutes your acceptance of such changes. We encourage you to review these Terms periodically.`,
    },
    {
      title: '2. Account Registration',
      content: `To access certain features of the Service, you must register for an account. When registering, you agree to: (a) provide accurate, current, and complete information; (b) maintain and promptly update your account information to keep it accurate, current, and complete; (c) maintain the security and confidentiality of your login credentials; (d) immediately notify GlowCart if you discover any unauthorized use of your account.

You are solely responsible for all activities that occur under your account. GlowCart shall not be liable for any loss or damage arising from your failure to comply with these requirements. We reserve the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
      title: '3. Product Information & Pricing',
      content: `GlowCart endeavors to display product information, including descriptions, images, and prices, as accurately as possible. However, we do not guarantee that product descriptions, photographs, or other content on the Service are entirely accurate, complete, reliable, or error-free.

All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. Prices are subject to change without prior notice. In the event of a pricing error, GlowCart reserves the right to cancel any orders placed at the incorrect price and will notify you of such cancellation. Promotional offers, discounts, and coupon codes are subject to specific terms and conditions and may be modified or withdrawn at any time.`,
    },
    {
      title: '4. Order Acceptance & Cancellation',
      content: `Placing an order on the Service constitutes an offer to purchase the selected products. All orders are subject to acceptance by GlowCart. We reserve the right to refuse or cancel any order for any reason, including but not limited to: product unavailability, pricing errors, or suspected fraudulent transactions.

You may cancel an order before it has been shipped by contacting our customer service team. Once an order has been dispatched, cancellation is not possible, and the return/refund policy will apply. GlowCart reserves the right to cancel orders in cases of suspected fraud, violation of these Terms, or any other legitimate business reason, and will provide a full refund in such cases.`,
    },
    {
      title: '5. Payment Terms',
      content: `GlowCart accepts the following payment methods: credit cards (Visa, Mastercard, American Express), debit cards, Unified Payments Interface (UPI), net banking, and Cash on Delivery (COD). All online payments are processed through secure, PCI-DSS compliant payment gateways.

For COD orders, an additional handling fee may apply. Payment must be made in full at the time of delivery. In case of payment failure, the order will be cancelled. GlowCart reserves the right to offer or restrict payment methods based on order value, delivery location, or other factors. EMI options may be available on select products and payment methods, subject to terms specified by the issuing bank.`,
    },
    {
      title: '6. Shipping & Delivery',
      content: `GlowCart ships products across India through our partnered logistics providers. Estimated delivery timelines vary based on the delivery location and product availability. We strive to meet the estimated delivery dates but do not guarantee them, as delays may occur due to factors beyond our control.

Free shipping is available on orders above ₹999. Orders below this threshold are subject to a shipping fee of ₹99. Delivery charges, if applicable, will be displayed at checkout. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. GlowCart is not responsible for delays caused by customs, natural disasters, strikes, or other force majeure events.`,
    },
    {
      title: '7. Returns & Refunds',
      content: `GlowCart offers a 15-day return policy from the date of delivery for most products. To be eligible for a return, the product must be unused, in its original packaging, and in the same condition as received. Certain categories such as hygiene products, intimate items, and personalized items may not be eligible for returns due to safety and hygiene standards.

To initiate a return, contact our customer service team through the Service or email support@glowcart.com. Upon receiving and inspecting the returned product, we will process the refund within 7-10 business days. Refunds will be credited to the original payment method. For COD orders, refunds will be processed via bank transfer to your provided account details. Shipping costs for returns due to product defects or wrong items delivered will be borne by GlowCart. Returns due to change of mind will incur return shipping charges.`,
    },
    {
      title: '8. Intellectual Property',
      content: `All content on the Service, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the property of GlowCart or its content suppliers and is protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without prior written consent, except as permitted by law. The GlowCart name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of GlowCart Private Limited. You must not use such marks without our prior written permission.`,
    },
    {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by applicable law, GlowCart, its directors, employees, partners, agents, suppliers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses resulting from: (a) your access to or use of, or inability to access or use, the Service; (b) any conduct or content of any third party on the Service; (c) any content obtained from the Service; (d) unauthorized access, use, or alteration of your transmissions or content.

In no event shall GlowCart's total aggregate liability exceed the amount paid by you to GlowCart in the twelve (12) months preceding the claim. This limitation of liability applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis.`,
    },
    {
      title: '10. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.

You agree to attempt to resolve any disputes with GlowCart informally first by contacting our customer service team. If the dispute is not resolved within 30 days, either party may pursue legal action. These Terms constitute the entire agreement between you and GlowCart regarding the use of the Service.`,
    },
    {
      title: '11. Contact Information',
      content: `For any questions, concerns, or feedback regarding these Terms and Conditions, please contact us:

GlowCart Private Limited
Registered Office: 42, MG Road, Fort, Mumbai, Maharashtra 400001, India
Email: legal@glowcart.com
Customer Support: support@glowcart.com
Phone: +91 1800 123 4567 (Toll-Free)
Business Hours: Monday to Saturday, 9:00 AM - 6:00 PM IST`,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground"
          onClick={() => setView('customer_shop')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Shop
        </Button>
        <div className="mb-8">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated: January 6, 2025
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
          >
            <Card className="border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl font-semibold text-rose-700">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line">{section.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 8. CUSTOMER PRIVACY VIEW
// ============================================================
function CustomerPrivacyView() {
  const { setView } = useAppStore();

  const sections = [
    {
      title: '1. Information We Collect',
      content: `GlowCart Private Limited ("GlowCart," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application (collectively, the "Service").

We collect the following categories of personal information:

Personal Identification Information: Name, email address, phone number, date of birth, and gender when you create an account or place an order.

Address Information: Shipping and billing addresses provided during checkout or saved in your profile.

Payment Information: Credit/debit card details, UPI IDs, and bank account information. Note that payment data is processed directly by our PCI-DSS compliant payment gateway partners and is not stored on our servers.

Order and Transaction Data: Products purchased, order history, transaction amounts, and payment methods used.

Device and Usage Data: IP address, browser type, operating system, device identifiers, pages visited, time spent on pages, click patterns, and referring URLs collected automatically through cookies and similar technologies.

Communication Data: Customer service inquiries, chat transcripts, feedback, and survey responses.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the collected information for the following purposes:

Order Processing: To process and fulfill your orders, manage deliveries, handle returns and refunds, and send order confirmations and shipping notifications.

Account Management: To create and manage your account, authenticate your identity, and provide customer support.

Personalization: To personalize your shopping experience, provide product recommendations, and display relevant content based on your preferences and browsing history.

Communication: To send transactional emails (order updates, shipping notifications), promotional communications (with your consent), and important service announcements.

Analytics and Improvement: To analyze usage trends, improve our Service, develop new features, and measure the effectiveness of our marketing campaigns.

Security and Fraud Prevention: To detect, prevent, and address fraud, unauthorized transactions, and other illegal activities, and to protect the security of our Service and users.

Legal Compliance: To comply with applicable laws, regulations, legal processes, or governmental requests.`,
    },
    {
      title: '3. Data Protection & Security',
      content: `GlowCart takes the security of your personal information seriously and implements industry-standard measures to protect it:

Encryption: All data transmitted between your device and our servers is encrypted using TLS 1.3 (Transport Layer Security). Sensitive payment information is encrypted at rest using AES-256 encryption.

Secure Storage: Personal data is stored on secure servers with restricted access, protected by firewalls, intrusion detection systems, and regular security audits. Database access is limited to authorized personnel through role-based access control (RBAC).

Payment Security: We do not store complete credit card numbers or CVV codes on our servers. Payment processing is handled through PCI-DSS Level 1 certified payment gateways that comply with the highest industry security standards.

Regular Audits: We conduct regular security assessments, vulnerability scans, and penetration testing to identify and address potential security risks.

Data Minimization: We collect only the personal information necessary for the purposes described in this policy and retain it only for as long as needed.

While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.`,
    },
    {
      title: '4. Cookies and Tracking Technologies',
      content: `We use cookies, web beacons, pixels, and similar tracking technologies to enhance your experience on our Service:

Essential Cookies: Required for the basic functionality of the Service, such as maintaining your session and shopping cart.

Analytics Cookies: Used to understand how visitors interact with our Service, measure traffic, and identify trends. We use tools such as Google Analytics for this purpose.

Advertising Cookies: Used to deliver relevant advertisements and measure the effectiveness of our advertising campaigns. These cookies may be set by our advertising partners.

Preference Cookies: Remember your settings and preferences, such as language, region, and display settings.

You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of the Service. Most browsers allow you to refuse or accept cookies, delete existing cookies, and set preferences for certain websites.`,
    },
    {
      title: '5. Third-Party Sharing',
      content: `We may share your personal information with the following third parties only as necessary to provide our Service:

Logistics Partners: To deliver your orders, we share your name, phone number, and delivery address with our partnered courier services (e.g., BlueDart, Delhivery, Ecom Express).

Payment Processors: Payment information is shared with our PCI-DSS compliant payment gateway partners (e.g., Razorpay, PayU) solely for processing transactions.

Service Providers: We engage third-party vendors for hosting, analytics, email delivery, and customer support who may have access to your information under strict contractual obligations of confidentiality.

Legal Requirements: We may disclose your information if required by law, regulation, or legal process, or if we believe such disclosure is necessary to protect our rights, the safety of our users, or the public.

Business Transfers: In the event of a merger, acquisition, reorganization, or sale of assets, your personal information may be transferred as part of such transaction, subject to continued adherence to this Privacy Policy.

We do not sell, rent, or trade your personal information to third parties for their marketing purposes.`,
    },
    {
      title: '6. Your Rights',
      content: `You have the following rights regarding your personal information:

Right to Access: You can request a copy of the personal information we hold about you by contacting us at privacy@glowcart.com.

Right to Correction: You can update or correct your account information at any time through your account settings or by contacting our customer support.

Right to Deletion: You can request the deletion of your personal information, subject to legal retention requirements. Upon verification, we will delete your data within 30 days.

Right to Data Portability: You can request your data in a structured, commonly used, and machine-readable format.

Right to Opt-Out: You can opt out of promotional communications by clicking the unsubscribe link in any marketing email or by updating your communication preferences in your account settings.

Right to Withdraw Consent: Where processing is based on your consent, you may withdraw consent at any time without affecting the lawfulness of processing carried out prior to withdrawal.

To exercise any of these rights, please contact us at privacy@glowcart.com or through the "Privacy Settings" section in your account.`,
    },
    {
      title: '7. Children\'s Privacy',
      content: `The Service is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove such information from our servers.

If you are a parent or guardian and believe your child under 13 has provided us with personal information, please contact us at privacy@glowcart.com, and we will take appropriate action to delete such information promptly.

For users between 13 and 18 years of age, we recommend parental guidance when using the Service and making purchases.`,
    },
    {
      title: '8. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make changes, we will:

Update the "Last Updated" date at the top of this Privacy Policy.

For material changes, provide a prominent notice on our Service, such as a banner or email notification, at least 15 days before the changes take effect.

Your continued use of the Service after the effective date of the revised Privacy Policy constitutes your acceptance of the changes. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`,
    },
    {
      title: '9. Contact Us',
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

GlowCart Private Limited
Registered Office: 42, MG Road, Fort, Mumbai, Maharashtra 400001, India
Privacy Email: privacy@glowcart.com
Customer Support: support@glowcart.com
Data Protection Officer: dpo@glowcart.com
Phone: +91 1800 123 4567 (Toll-Free)
Business Hours: Monday to Saturday, 9:00 AM - 6:00 PM IST

You also have the right to lodge a complaint with the relevant data protection authority if you believe that our processing of your personal information violates applicable data protection laws.`,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <motion.div {...fadeInUp}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground"
          onClick={() => setView('customer_shop')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Shop
        </Button>
        <div className="mb-8">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated: January 6, 2025
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
          >
            <Card className="border-rose-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl font-semibold text-rose-700">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line">{section.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN CUSTOMER VIEW COMPONENT
// ============================================================
export function CustomerView() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'customer_shop':
        return <CustomerShopView />;
      case 'customer_cart':
        return <CustomerCartView />;
      case 'customer_checkout':
        return <CustomerCheckoutView />;
      case 'customer_orders':
        return <CustomerOrdersView />;
      case 'customer_order_detail':
        return <CustomerOrderDetailView />;
      case 'customer_tracking':
        return <CustomerTrackingView />;
      case 'customer_terms':
        return <CustomerTermsView />;
      case 'customer_privacy':
        return <CustomerPrivacyView />;
      default:
        return <CustomerShopView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CustomerHeader />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {renderView()}
        </motion.main>
      </AnimatePresence>
      <TrishulHubFooter variant="light" />
    </div>
  );
}

export default CustomerView;
