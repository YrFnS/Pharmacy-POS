import { create } from 'zustand';
import { Language } from './i18n';

export const initialProducts: Product[] = [
  {
    id: "p1",
    barcode: "890113830023",
    brandName: "Panadol Advance 500mg",
    genericName: "Paracetamol",
    category: "Pain Relief",
    batches: [
      { id: "b1_1", batchNo: "A1029", expiryDate: "2026-10-01", quantity: 50, price: 2500 },
      { id: "b1_2", batchNo: "A1010", expiryDate: "2024-12-01", quantity: 15, price: 2500 },
    ]
  },
  {
    id: "p2",
    barcode: "501270410052",
    brandName: "Augmentin 1g",
    genericName: "Amoxicillin / Clavulanate",
    category: "Antibiotics",
    batches: [
      { id: "b2_1", batchNo: "X882", expiryDate: "2025-06-15", quantity: 20, price: 15000 },
    ]
  },
  {
    id: "p3",
    barcode: "366479802111",
    brandName: "Lipitor 20mg",
    genericName: "Atorvastatin",
    category: "Cholesterol",
    batches: [
      { id: "b3_1", batchNo: "LIP20", expiryDate: "2027-01-20", quantity: 100, price: 35000 },
    ]
  },
  {
    id: "p4",
    barcode: "88019239100",
    brandName: "Ventolin Inhaler 100mcg",
    genericName: "Salbutamol",
    category: "Respiratory",
    batches: [
      { id: "b4_1", batchNo: "VEN99", expiryDate: "2026-08-10", quantity: 30, price: 8000 },
      { id: "b4_2", batchNo: "VEN88", expiryDate: "2024-11-01", quantity: 5, price: 8000 },
    ]
  },
  {
    id: "p5",
    barcode: "3400934920256",
    brandName: "Doliprane 1000mg",
    genericName: "Paracetamol",
    category: "Pain Relief",
    batches: [
      { id: "b5_1", batchNo: "DOL1K", expiryDate: "2025-11-30", quantity: 80, price: 4000 },
    ]
  },
  {
    id: "p6",
    barcode: "4004944015008",
    brandName: "Voltaren Emulgel 50g",
    genericName: "Diclofenac Diethylamine",
    category: "Topical Pain Relief",
    batches: [
      { id: "b6_1", batchNo: "VOLT1", expiryDate: "2026-03-22", quantity: 45, price: 12000 },
      { id: "b6_2", batchNo: "VOLT2", expiryDate: "2026-09-01", quantity: 60, price: 12000 },
    ]
  },
  {
    id: "p7",
    barcode: "5000158066113",
    brandName: "Gaviscon Double Action",
    genericName: "Sodium Alginate / Antacid",
    category: "Gastrointestinal",
    batches: [
      { id: "b7_1", batchNo: "GAV6", expiryDate: "2025-05-15", quantity: 24, price: 9500 },
    ]
  },
  {
    id: "p8",
    barcode: "6281086001045",
    brandName: "Amoxil 500mg Caps",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    batches: [
      { id: "b8_1", batchNo: "AMX500", expiryDate: "2027-02-14", quantity: 150, price: 6000 },
    ]
  },
  {
    id: "p9",
    barcode: "8901117009028",
    brandName: "Cataflam 50mg",
    genericName: "Diclofenac Potassium",
    category: "Pain Relief",
    batches: [
      { id: "b9_1", batchNo: "CAT50", expiryDate: "2024-10-10", quantity: 12, price: 5500 },
    ]
  },
  {
    id: "p10",
    barcode: "3582452093417",
    brandName: "Zyrtec 10mg",
    genericName: "Cetirizine",
    category: "Antihistamine",
    batches: [
      { id: "b10_1", batchNo: "ZYR10", expiryDate: "2026-12-05", quantity: 200, price: 8000 },
    ]
  }
];

export const initialCustomers: Customer[] = [
  { id: "c1", name: "Walk-in Customer", phone: "", debt: 0 },
  { id: "c2", name: "Ahmed Hassan", phone: "07701234567", debt: 15000 },
  { id: "c3", name: "Sarah Ali", phone: "07809876543", debt: 0 },
  { id: "c4", name: "Mohammed Al-Rubaie", phone: "07901112233", debt: 45000 },
  { id: "c5", name: "Fatima Zahra", phone: "07712223344", debt: 2000 },
  { id: "c6", name: "Omar Tariq", phone: "07813334455", debt: 0 },
  { id: "c7", name: "Zainab Kareem", phone: "07504445566", debt: 120000 },
];

export interface Batch {
  id: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  price: number;
}

export interface Product {
  id: string;
  barcode: string;
  brandName: string;
  genericName: string;
  category: string;
  batches: Batch[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  debt: number;
}

export interface TransactionItem {
  productId: string;
  batchId: string;
  quantity: number;
  price: number;
  discount: number;
  isReturn: boolean;
}

export interface Transaction {
  id: string;
  customerId: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'tab';
  timestamp: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  batchId: string;
  quantity: number;
  discountPercent: number;
  isReturn?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
}

export interface Settings {
  pharmacyName: string;
  currency: string;
  address: string;
  receiptFooter: string;
  printReceipts: boolean;
}

interface POSState {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  isReturnMode: boolean;
  setIsReturnMode: (mode: boolean) => void;

  products: Product[];
  customers: Customer[];
  transactions: Transaction[];

  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id' | 'batches'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  receiveStock: (productId: string, batch: Omit<Batch, 'id'>) => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'debt'>) => void;
  updateCustomer: (customer: Customer) => void;
  settleDebt: (customerId: string, amount: number) => void;

  isShiftOpen: boolean;
  setIsShiftOpen: (shift: boolean) => void;
  shiftCash: number;
  setShiftCash: (cash: number) => void;
  isShiftModalOpen: boolean;
  setIsShiftModalOpen: (open: boolean) => void;

  cart: CartItem[];
  heldCarts: { id: string, cart: CartItem[], timestamp: number }[];
  addToCart: (productId: string, batchId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  setDiscount: (cartItemId: string, discountPercent: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  holdCart: () => void;
  resumeCart: (id: string) => void;
  
  customerId: string;
  setCustomer: (id: string) => void;
  
  isPaymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  completeSale: (paymentMethod: Transaction['paymentMethod']) => void;

  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<POSState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  
  isReturnMode: false,
  setIsReturnMode: (mode) => set({ isReturnMode: mode }),

  products: initialProducts,
  customers: initialCustomers,
  transactions: [],

  setProducts: (products) => set({ products }),
  addProduct: (newProd) => set(state => ({
    products: [...state.products, { ...newProd, id: generateId(), batches: [] }]
  })),
  updateProduct: (updated) => set(state => ({
    products: state.products.map(p => p.id === updated.id ? updated : p)
  })),
  deleteProduct: (id) => set(state => ({
    products: state.products.filter(p => p.id !== id)
  })),
  receiveStock: (productId, batch) => set(state => ({
    products: state.products.map(p => 
      p.id === productId 
        ? { ...p, batches: [...p.batches, { ...batch, id: generateId() }] }
        : p
    )
  })),

  addCustomer: (cust) => set(state => ({
    customers: [...state.customers, { ...cust, id: generateId(), debt: 0 }]
  })),
  updateCustomer: (updated) => set(state => ({
    customers: state.customers.map(c => c.id === updated.id ? updated : c)
  })),
  settleDebt: (customerId, amount) => set(state => ({
    customers: state.customers.map(c => 
      c.id === customerId ? { ...c, debt: Math.max(0, c.debt - amount) } : c
    )
  })),

  isShiftOpen: false,
  setIsShiftOpen: (shift) => set({ isShiftOpen: shift }),
  shiftCash: 0,
  setShiftCash: (cash) => set({ shiftCash: cash }),
  isShiftModalOpen: false,
  setIsShiftModalOpen: (open) => set({ isShiftModalOpen: open }),

  cart: [],
  heldCarts: [],
  addToCart: (productId, batchId) => {
    const { cart, isReturnMode } = get();
    const existing = cart.find(item => item.productId === productId && item.batchId === batchId && !!item.isReturn === isReturnMode);
    
    if (existing) {
      set({
        cart: cart.map(item => 
          item.cartItemId === existing.cartItemId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({
        cart: [...cart, { 
          cartItemId: generateId(), 
          productId, 
          batchId, 
          quantity: 1, 
          discountPercent: 0,
          isReturn: isReturnMode
        }]
      });
    }
  },
  
  updateQuantity: (cartItemId, delta) => {
    set(state => ({
      cart: state.cart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    }));
  },

  setDiscount: (cartItemId, discountPercent) => {
    set(state => ({
      cart: state.cart.map(item => 
        item.cartItemId === cartItemId ? { ...item, discountPercent } : item
      )
    }));
  },
  
  removeFromCart: (cartItemId) => {
    set(state => ({
      cart: state.cart.filter(item => item.cartItemId !== cartItemId)
    }));
  },
  
  clearCart: () => set({ cart: [] }),
  
  holdCart: () => {
    set(state => {
      if (state.cart.length === 0) return state;
      return {
        heldCarts: [...state.heldCarts, { id: generateId(), cart: [...state.cart], timestamp: Date.now() }],
        cart: []
      };
    });
  },
  
  resumeCart: (id) => {
    set(state => {
      const held = state.heldCarts.find(h => h.id === id);
      if (!held) return state;
      return {
        cart: held.cart,
        heldCarts: state.heldCarts.filter(h => h.id !== id)
      };
    });
  },
  
  customerId: 'c1', // Default to walk-in
  setCustomer: (id) => set({ customerId: id }),
  
  isPaymentModalOpen: false,
  setPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),

  completeSale: (paymentMethod) => {
    const { cart, products, customers, customerId, transactions } = get();
    if (cart.length === 0) return;

    let grandTotal = 0;
    const transactionItems: TransactionItem[] = [];

    // 1. Calculate Totals and prepare transaction items
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const batch = product?.batches.find(b => b.id === item.batchId);
      const price = batch?.price || 0;
      const discount = price * (item.discountPercent / 100);
      const finalPrice = price - discount;
      const itemTotal = finalPrice * item.quantity * (item.isReturn ? -1 : 1);
      
      grandTotal += itemTotal;
      transactionItems.push({
        productId: item.productId,
        batchId: item.batchId,
        quantity: item.quantity,
        price,
        discount: item.discountPercent,
        isReturn: !!item.isReturn
      });
    });

    // 2. Add to Transactions
    const newTransaction: Transaction = {
      id: generateId(),
      customerId,
      items: transactionItems,
      total: grandTotal,
      paymentMethod,
      timestamp: Date.now()
    };

    // 3. Update Inventory Stock
    const updatedProducts = products.map(p => {
      const productItems = cart.filter(ci => ci.productId === p.id);
      if (productItems.length === 0) return p;

      return {
        ...p,
        batches: p.batches.map(b => {
          const cartItem = productItems.find(ci => ci.batchId === b.id);
          if (!cartItem) return b;
          // Substract if sale, add if return
          const modifier = cartItem.isReturn ? 1 : -1;
          return { ...b, quantity: Math.max(0, b.quantity + (cartItem.quantity * modifier)) };
        })
      };
    });

    // 4. Update Customer Debt if "tab" payment
    const updatedCustomers = customers.map(c => {
      if (c.id === customerId && paymentMethod === 'tab') {
        return { ...c, debt: c.debt + grandTotal };
      }
      return c;
    });

    set({
      transactions: [...transactions, newTransaction],
      products: updatedProducts,
      customers: updatedCustomers,
      cart: [],
      isPaymentModalOpen: false
    });
  },

  settings: {
    pharmacyName: 'Al-Shifa Pharmacy',
    currency: 'IQD',
    address: 'Baghdad, Mansour Dist, 14th St',
    receiptFooter: 'Thank you for your visit. No refunds on open medicine.',
    printReceipts: true
  },
  updateSettings: (newSettings) => set(state => ({ settings: { ...state.settings, ...newSettings } })),

  users: [
    { id: 'u1', name: 'Dr. Ahmed', email: 'ahmed@alshifa.com', role: 'manager' },
    { id: 'u2', name: 'Ali Cashier', email: 'ali@alshifa.com', role: 'cashier' }
  ],
  addUser: (user) => set(state => ({ users: [...state.users, { ...user, id: generateId() }] })),
  updateUser: (updated) => set(state => ({ users: state.users.map(u => u.id === updated.id ? updated : u) })),
  deleteUser: (id) => set(state => ({ users: state.users.filter(u => u.id !== id) }))
}));
