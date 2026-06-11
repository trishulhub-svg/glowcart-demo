// ============================================
// GLOWCART - Cosmetic Demo Site Mock Data
// ============================================

export type UserRole = 'admin' | 'employee' | 'delivery' | 'customer';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  ingredients: string;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  deliveryPersonName: string;
  status: 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  currentLocation: string;
  estimatedDelivery: string;
  timeline: { status: string; location: string; time: string; completed: boolean }[];
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
}

// ---- Demo Users ----
export const DEMO_USERS: Record<UserRole, DemoUser> = {
  admin: {
    id: 'usr_admin_001',
    name: 'Priya Sharma',
    email: 'admin@glowcart.demo',
    role: 'admin',
    avatar: 'PS',
    phone: '+91 98765 43210',
  },
  employee: {
    id: 'usr_emp_001',
    name: 'Rahul Verma',
    email: 'rahul@glowcart.demo',
    role: 'employee',
    avatar: 'RV',
    phone: '+91 98765 43211',
  },
  delivery: {
    id: 'usr_del_001',
    name: 'Amit Patel',
    email: 'amit@glowcart.demo',
    role: 'delivery',
    avatar: 'AP',
    phone: '+91 98765 43212',
  },
  customer: {
    id: 'usr_cus_001',
    name: 'Sneha Gupta',
    email: 'sneha@glowcart.demo',
    role: 'customer',
    avatar: 'SG',
    phone: '+91 98765 43213',
  },
};

// ---- Products ----
export const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Radiance Renewal Serum',
    brand: 'LuxeGlow',
    category: 'Serums',
    price: 1299,
    originalPrice: 1799,
    rating: 4.8,
    reviews: 2341,
    image: '✨',
    description: 'A powerful anti-aging serum infused with vitamin C, hyaluronic acid, and niacinamide. This lightweight formula penetrates deep into the skin to reduce fine lines, even out skin tone, and restore natural radiance.',
    ingredients: 'Vitamin C (L-Ascorbic Acid), Hyaluronic Acid, Niacinamide, Vitamin E, Aloe Vera Extract',
    inStock: true,
    stockCount: 145,
    featured: true,
  },
  {
    id: 'prod_002',
    name: 'Velvet Matte Lipstick',
    brand: 'ColorQueen',
    category: 'Lipsticks',
    price: 699,
    originalPrice: 899,
    rating: 4.6,
    reviews: 5672,
    image: '💄',
    description: 'Long-lasting velvet matte lipstick with a creamy, comfortable formula. Glides on smoothly and stays put for up to 12 hours without drying your lips. Enriched with shea butter and jojoba oil.',
    ingredients: 'Shea Butter, Jojoba Oil, Vitamin E, Candelilla Wax, Carnauba Wax',
    inStock: true,
    stockCount: 320,
    featured: true,
  },
  {
    id: 'prod_003',
    name: 'Hydra Boost Moisturizer',
    brand: 'SkinEssence',
    category: 'Moisturizers',
    price: 899,
    rating: 4.7,
    reviews: 3456,
    image: '🧴',
    description: 'Intensive hydration moisturizer with ceramides and squalane. Locks in moisture for 72 hours while strengthening the skin barrier. Perfect for dry and combination skin types.',
    ingredients: 'Ceramides, Squalane, Glycerin, Hyaluronic Acid, Green Tea Extract',
    inStock: true,
    stockCount: 89,
    featured: true,
  },
  {
    id: 'prod_004',
    name: 'Silk Foundation SPF 30',
    brand: 'FlawlessBeauty',
    category: 'Foundations',
    price: 1499,
    originalPrice: 1999,
    rating: 4.5,
    reviews: 1893,
    image: '🎭',
    description: 'Buildable coverage foundation with built-in SPF 30 protection. The silk-infused formula provides a flawless, natural finish that lasts all day. Available in 24 shades.',
    ingredients: 'Silk Amino Acids, Titanium Dioxide, Vitamin C, Vitamin E, Aloe Vera',
    inStock: true,
    stockCount: 210,
    featured: false,
  },
  {
    id: 'prod_005',
    name: 'Rose Gold Eyeshadow Palette',
    brand: 'ColorQueen',
    category: 'Eyeshadows',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 7823,
    image: '🎨',
    description: 'Stunning 18-shade eyeshadow palette featuring rose gold tones, warm neutrals, and shimmer accents. Highly pigmented, blendable formula for both everyday and dramatic looks.',
    ingredients: 'Mica, Talc, Magnesium Stearate, Dimethicone, Vitamin E',
    inStock: true,
    stockCount: 56,
    featured: true,
  },
  {
    id: 'prod_006',
    name: 'Gentle Cleansing Oil',
    brand: 'SkinEssence',
    category: 'Cleansers',
    price: 599,
    rating: 4.4,
    reviews: 2134,
    image: '🫧',
    description: 'Lightweight cleansing oil that melts away makeup, sunscreen, and impurities without stripping your skin. Emulsifies on contact with water for easy rinsing. Suitable for all skin types.',
    ingredients: 'Sunflower Seed Oil, Jojoba Oil, Vitamin E, Olive Oil, Rosehip Oil',
    inStock: true,
    stockCount: 178,
    featured: false,
  },
  {
    id: 'prod_007',
    name: 'Volume Lash Mascara',
    brand: 'FlawlessBeauty',
    category: 'Mascaras',
    price: 499,
    originalPrice: 699,
    rating: 4.3,
    reviews: 4521,
    image: '👁️',
    description: 'Volumizing mascara with a unique curved brush that lifts, curls, and adds dramatic volume. Smudge-proof and flake-free formula that lasts from morning to night.',
    ingredients: 'Beeswax, Carnauba Wax, Vitamin E, Panthenol, Biotin',
    inStock: true,
    stockCount: 445,
    featured: false,
  },
  {
    id: 'prod_008',
    name: 'Retinol Night Cream',
    brand: 'LuxeGlow',
    category: 'Creams',
    price: 2199,
    originalPrice: 2799,
    rating: 4.7,
    reviews: 1567,
    image: '🌙',
    description: 'Advanced retinol night cream formulated with encapsulated retinol and bakuchiol. Reduces wrinkles, fine lines, and age spots while you sleep. Dermatologist tested and suitable for sensitive skin.',
    ingredients: 'Encapsulated Retinol, Bakuchiol, Peptides, Squalane, Vitamin E',
    inStock: true,
    stockCount: 67,
    featured: true,
  },
  {
    id: 'prod_009',
    name: 'Setting Spray Pro',
    brand: 'ColorQueen',
    category: 'Setting Sprays',
    price: 799,
    rating: 4.5,
    reviews: 3289,
    image: '💦',
    description: 'Professional-grade setting spray that locks in your makeup for up to 16 hours. Micro-fine mist applies evenly without disturbing your look. Controls oil and adds a natural glow.',
    ingredients: 'Aloe Vera, Glycerin, Vitamin E, Green Tea Extract, Rose Water',
    inStock: true,
    stockCount: 234,
    featured: false,
  },
  {
    id: 'prod_010',
    name: 'Vitamin C Brightening Mask',
    brand: 'SkinEssence',
    category: 'Face Masks',
    price: 399,
    originalPrice: 499,
    rating: 4.6,
    reviews: 6234,
    image: '🧖',
    description: 'Brightening sheet mask infused with pure vitamin C and niacinamide. Instantly brightens dull skin, reduces dark spots, and provides an intense hydration boost. Pack of 5.',
    ingredients: 'Vitamin C, Niacinamide, Hyaluronic Acid, Licorice Root Extract, Arbutin',
    inStock: true,
    stockCount: 512,
    featured: true,
  },
  {
    id: 'prod_011',
    name: 'Bronzing Powder',
    brand: 'FlawlessBeauty',
    category: 'Bronzers',
    price: 899,
    rating: 4.4,
    reviews: 1892,
    image: '☀️',
    description: 'Silky-smooth bronzing powder that creates a natural sun-kissed glow. Buildable formula with micro-shimmer particles for a luminous finish. Suitable for all skin tones.',
    ingredients: 'Mica, Talc, Dimethicone, Vitamin E, Jojoba Oil',
    inStock: true,
    stockCount: 156,
    featured: false,
  },
  {
    id: 'prod_012',
    name: 'Blush Duo Compact',
    brand: 'ColorQueen',
    category: 'Blushes',
    price: 649,
    originalPrice: 849,
    rating: 4.5,
    reviews: 2756,
    image: '🌸',
    description: 'Dual-tone blush compact with a matte and shimmer shade. The buttery-soft formula blends seamlessly for a natural flush of color. Includes a mirror and brush for on-the-go application.',
    ingredients: 'Mica, Talc, Magnesium Stearate, Dimethicone, Vitamin E',
    inStock: false,
    stockCount: 0,
    featured: false,
  },
];

// ---- Orders ----
export const ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'usr_cus_001',
    customerName: 'Sneha Gupta',
    customerEmail: 'sneha@glowcart.demo',
    items: [
      { productId: 'prod_001', productName: 'Radiance Renewal Serum', quantity: 1, price: 1299 },
      { productId: 'prod_002', productName: 'Velvet Matte Lipstick', quantity: 2, price: 699 },
    ],
    total: 2697,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    shippingAddress: '42, MG Road, Mumbai, Maharashtra 400001',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-18T14:20:00Z',
  },
  {
    id: 'ORD-2024-002',
    customerId: 'usr_cus_001',
    customerName: 'Sneha Gupta',
    customerEmail: 'sneha@glowcart.demo',
    items: [
      { productId: 'prod_005', productName: 'Rose Gold Eyeshadow Palette', quantity: 1, price: 1899 },
      { productId: 'prod_007', productName: 'Volume Lash Mascara', quantity: 1, price: 499 },
    ],
    total: 2398,
    status: 'shipped',
    paymentMethod: 'UPI',
    shippingAddress: '42, MG Road, Mumbai, Maharashtra 400001',
    createdAt: '2025-01-02T09:15:00Z',
    updatedAt: '2025-01-04T11:00:00Z',
  },
  {
    id: 'ORD-2024-003',
    customerId: 'usr_cus_002',
    customerName: 'Anita Desai',
    customerEmail: 'anita@example.com',
    items: [
      { productId: 'prod_008', productName: 'Retinol Night Cream', quantity: 1, price: 2199 },
    ],
    total: 2199,
    status: 'processing',
    paymentMethod: 'Credit Card',
    shippingAddress: '15, Park Street, Kolkata, West Bengal 700016',
    createdAt: '2025-01-05T16:45:00Z',
    updatedAt: '2025-01-05T17:00:00Z',
  },
  {
    id: 'ORD-2024-004',
    customerId: 'usr_cus_003',
    customerName: 'Meera Iyer',
    customerEmail: 'meera@example.com',
    items: [
      { productId: 'prod_003', productName: 'Hydra Boost Moisturizer', quantity: 1, price: 899 },
      { productId: 'prod_006', productName: 'Gentle Cleansing Oil', quantity: 1, price: 599 },
      { productId: 'prod_010', productName: 'Vitamin C Brightening Mask', quantity: 2, price: 399 },
    ],
    total: 2296,
    status: 'confirmed',
    paymentMethod: 'Net Banking',
    shippingAddress: '8, Brigade Road, Bangalore, Karnataka 560001',
    createdAt: '2025-01-06T08:20:00Z',
    updatedAt: '2025-01-06T08:30:00Z',
  },
  {
    id: 'ORD-2024-005',
    customerId: 'usr_cus_004',
    customerName: 'Riya Kapoor',
    customerEmail: 'riya@example.com',
    items: [
      { productId: 'prod_004', productName: 'Silk Foundation SPF 30', quantity: 1, price: 1499 },
      { productId: 'prod_009', productName: 'Setting Spray Pro', quantity: 1, price: 799 },
    ],
    total: 2298,
    status: 'pending',
    paymentMethod: 'COD',
    shippingAddress: '22, Linking Road, Mumbai, Maharashtra 400050',
    createdAt: '2025-01-06T12:00:00Z',
    updatedAt: '2025-01-06T12:00:00Z',
  },
  {
    id: 'ORD-2024-006',
    customerId: 'usr_cus_005',
    customerName: 'Kavita Reddy',
    customerEmail: 'kavita@example.com',
    items: [
      { productId: 'prod_011', productName: 'Bronzing Powder', quantity: 1, price: 899 },
      { productId: 'prod_012', productName: 'Blush Duo Compact', quantity: 1, price: 649 },
    ],
    total: 1548,
    status: 'cancelled',
    paymentMethod: 'UPI',
    shippingAddress: '10, Banjara Hills, Hyderabad, Telangana 500034',
    createdAt: '2025-01-04T14:30:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
  },
];

// ---- Shipments ----
export const SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-2024-001',
    orderId: 'ORD-2024-002',
    deliveryPersonId: 'usr_del_001',
    deliveryPersonName: 'Amit Patel',
    status: 'in_transit',
    currentLocation: 'Mumbai Hub - Andheri',
    estimatedDelivery: '2025-01-07',
    timeline: [
      { status: 'Order Confirmed', location: 'GlowCart Warehouse, Delhi', time: '2025-01-02 09:30 AM', completed: true },
      { status: 'Picked Up', location: 'Delhi Distribution Center', time: '2025-01-03 11:00 AM', completed: true },
      { status: 'In Transit', location: 'Mumbai Hub - Andheri', time: '2025-01-04 06:30 AM', completed: true },
      { status: 'Out for Delivery', location: 'Mumbai - MG Road Area', time: 'Expected Today', completed: false },
      { status: 'Delivered', location: 'Customer Address', time: 'Expected by 5:00 PM', completed: false },
    ],
  },
  {
    id: 'SHP-2024-002',
    orderId: 'ORD-2024-003',
    deliveryPersonId: 'usr_del_002',
    deliveryPersonName: 'Vikram Singh',
    status: 'picked_up',
    currentLocation: 'Kolkata Distribution Center',
    estimatedDelivery: '2025-01-09',
    timeline: [
      { status: 'Order Confirmed', location: 'GlowCart Warehouse, Delhi', time: '2025-01-05 17:00 PM', completed: true },
      { status: 'Picked Up', location: 'Kolkata Distribution Center', time: '2025-01-06 08:00 AM', completed: true },
      { status: 'In Transit', location: 'On the way to Kolkata', time: 'Expected', completed: false },
      { status: 'Out for Delivery', location: 'Kolkata - Park Street Area', time: 'Expected', completed: false },
      { status: 'Delivered', location: 'Customer Address', time: 'Expected by Jan 9', completed: false },
    ],
  },
];

// ---- Categories ----
export const CATEGORIES = [
  { name: 'Serums', icon: '✨', count: 24 },
  { name: 'Lipsticks', icon: '💄', count: 36 },
  { name: 'Moisturizers', icon: '🧴', count: 18 },
  { name: 'Foundations', icon: '🎭', count: 42 },
  { name: 'Eyeshadows', icon: '🎨', count: 28 },
  { name: 'Cleansers', icon: '🫧', count: 15 },
  { name: 'Mascaras', icon: '👁️', count: 22 },
  { name: 'Creams', icon: '🌙', count: 19 },
  { name: 'Setting Sprays', icon: '💦', count: 12 },
  { name: 'Face Masks', icon: '🧖', count: 31 },
  { name: 'Bronzers', icon: '☀️', count: 14 },
  { name: 'Blushes', icon: '🌸', count: 26 },
];

// ---- Dashboard Stats (Admin) ----
export const ADMIN_STATS = {
  totalRevenue: 284750,
  totalOrders: 1847,
  totalCustomers: 956,
  totalProducts: 124,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  customerGrowth: 15.2,
  productGrowth: 4.1,
  recentOrders: ORDERS,
  topProducts: [
    { name: 'Rose Gold Eyeshadow Palette', sales: 342, revenue: 649158 },
    { name: 'Velvet Matte Lipstick', sales: 298, revenue: 208402 },
    { name: 'Radiance Renewal Serum', sales: 267, revenue: 346733 },
    { name: 'Vitamin C Brightening Mask', sales: 234, revenue: 93366 },
    { name: 'Retinol Night Cream', sales: 189, revenue: 415611 },
  ],
  monthlyRevenue: [
    { month: 'Aug', revenue: 32000 },
    { month: 'Sep', revenue: 38000 },
    { month: 'Oct', revenue: 42000 },
    { month: 'Nov', revenue: 55000 },
    { month: 'Dec', revenue: 61000 },
    { month: 'Jan', revenue: 56750 },
  ],
};

// ---- Employee Stats ----
export const EMPLOYEE_STATS = {
  ordersToProcess: 23,
  lowStockAlerts: 5,
  pendingShipments: 12,
  completedToday: 8,
};
