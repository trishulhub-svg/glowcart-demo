import { create } from 'zustand';
import {
  type UserRole,
  type DemoUser,
  type Product,
  type CartItem,
  type Order,
  type Shipment,
  DEMO_USERS,
  PRODUCTS,
  ORDERS,
  SHIPMENTS,
} from './mock-data';

// ---- App View Types ----
export type AppView =
  | 'login'
  | 'customer_shop'
  | 'customer_cart'
  | 'customer_checkout'
  | 'customer_orders'
  | 'customer_order_detail'
  | 'customer_tracking'
  | 'customer_terms'
  | 'customer_privacy'
  | 'admin_dashboard'
  | 'admin_products'
  | 'admin_orders'
  | 'admin_users'
  | 'admin_terms'
  | 'employee_dashboard'
  | 'employee_orders'
  | 'employee_inventory'
  | 'delivery_dashboard'
  | 'delivery_active'
  | 'delivery_history'
  | 'delivery_profile';

interface AppState {
  // Auth
  currentUser: DemoUser | null;
  currentRole: UserRole | null;
  isLoggedIn: boolean;

  // Navigation
  currentView: AppView;
  previousView: AppView | null;
  selectedOrderId: string | null;
  selectedProductId: string | null;

  // Customer
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  shipments: Shipment[];

  // Search & Filter
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  login: (role: UserRole) => void;
  logout: () => void;
  setView: (view: AppView) => void;
  setSelectedOrder: (orderId: string | null) => void;
  setSelectedProduct: (productId: string | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: string, address: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateShipmentStatus: (shipmentId: string, status: Shipment['status'], location: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  currentRole: null,
  isLoggedIn: false,

  // Navigation
  currentView: 'login',
  previousView: null,
  selectedOrderId: null,
  selectedProductId: null,

  // Customer
  cart: [],
  orders: [...ORDERS],
  products: [...PRODUCTS],
  shipments: [...SHIPMENTS],

  // Search & Filter
  searchQuery: '',
  selectedCategory: null,

  // Actions
  login: (role: UserRole) => {
    const user = DEMO_USERS[role];
    set({
      currentUser: user,
      currentRole: role,
      isLoggedIn: true,
      currentView: role === 'admin' ? 'admin_dashboard'
        : role === 'employee' ? 'employee_dashboard'
        : role === 'delivery' ? 'delivery_dashboard'
        : 'customer_shop',
      cart: [],
      previousView: null,
    });
  },

  logout: () => {
    set({
      currentUser: null,
      currentRole: null,
      isLoggedIn: false,
      currentView: 'login',
      previousView: null,
      selectedOrderId: null,
      selectedProductId: null,
      cart: [],
      searchQuery: '',
      selectedCategory: null,
    });
  },

  setView: (view: AppView) => {
    const { currentView } = get();
    set({ previousView: currentView, currentView: view });
  },

  setSelectedOrder: (orderId: string | null) => set({ selectedOrderId: orderId }),
  setSelectedProduct: (productId: string | null) => set({ selectedProductId: productId }),

  addToCart: (product: Product) => {
    const { cart } = get();
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId: string) => {
    const { cart } = get();
    set({ cart: cart.filter((item) => item.product.id !== productId) });
  },

  updateCartQuantity: (productId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      set({ cart: cart.filter((item) => item.product.id !== productId) });
    } else {
      set({
        cart: cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },

  clearCart: () => set({ cart: [] }),

  placeOrder: (paymentMethod: string, address: string) => {
    const { cart, currentUser, orders } = get();
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: currentUser?.id || '',
      customerName: currentUser?.name || '',
      customerEmail: currentUser?.email || '',
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      status: 'pending',
      paymentMethod,
      shippingAddress: address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({
      orders: [newOrder, ...orders],
      cart: [],
      currentView: 'customer_orders',
    });
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    const { orders } = get();
    set({
      orders: orders.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
      ),
    });
  },

  updateShipmentStatus: (shipmentId: string, status: Shipment['status'], location: string) => {
    const { shipments } = get();
    set({
      shipments: shipments.map((ship) =>
        ship.id === shipmentId
          ? {
              ...ship,
              status,
              currentLocation: location,
              timeline: ship.timeline.map((t, i) => {
                const statusMap = ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
                const statusIdx = statusMap.indexOf(status);
                const timelineStatuses = ['Order Confirmed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
                if (i <= statusIdx + 1) return { ...t, completed: true };
                return t;
              }),
            }
          : ship
      ),
    });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
