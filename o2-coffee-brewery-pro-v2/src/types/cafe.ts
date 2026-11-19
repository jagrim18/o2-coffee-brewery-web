export type PageRoute = "welcome" | "login" | "menu" | "manager" | "admin";
export type UserRole = "guest" | "manager" | "admin" | null;
export type StationType = "Coffee Bar" | "Kitchen";
export type TableStatus = "Vacant" | "Ordering" | "Preparing" | "Served" | "Counter Bill Pending";
export type PaymentMethod = "Pay at Counter" | "Instant UPI" | "Split UPI";
export type PaymentStatus = "Pending at Counter" | "Paid";

export interface AuthSession {
  role: UserRole;
  name: string;
  tableNumber?: string;
  email?: string;
}

export interface RecipeItem {
  ingredientId: string;
  amount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: "Signature Brews" | "Study Fuel" | "Boho Bakes" | "All-Day Eatery";
  station: StationType;
  prepTime: number;
  isVeg: boolean;
  isVegan?: boolean;
  featured?: boolean;
  image: string;
  recipe: RecipeItem[];
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  milk: "Regular" | "Oat (+₹40)" | "Almond (+₹45)";
  sugar: "Normal" | "Less Sugar" | "No Sugar";
  extraShot: boolean;
  notes: string;
  addedBy: string;
  unitPrice: number;
}

export interface OrderItemSummary {
  name: string;
  qty: number;
  station: StationType;
  modifiers: string[];
  price: number;
}

export interface OrderRecord {
  id: string;
  tableNumber: string;
  customerName: string;
  items: OrderItemSummary[];
  subtotal: number;
  gst: number;
  totalAmount: number;
  kitchenStatus: "Preparing" | "Ready" | "Served";
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAtTime: string;
  minutesAgo: number;
  timestampHour: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  maxCapacity: number;
  lowThreshold: number;
  costPerUnit: number;
  supplier: string;
}

export interface CafeTable {
  id: string;
  number: string;
  zone: "Indoor Botanical" | "Outdoor Patio" | "Study Nook";
  seats: number;
  status: TableStatus;
  guestName?: string;
  occupiedMinutes: number;
  pendingBill: number;
  paidBill: number;
}

export interface HourlyMetric {
  hour: string;
  orders: number;
  revenue: number;
}

export interface ActivityLog {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: string;
}
