import { create } from 'zustand';
import { Language } from './i18n';
import { mockProducts, mockCustomers } from './mock';

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
  deleteBatch: (productId: string, batchId: string) => void;

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

  // Settings & Users
  settings: {
    pharmacyName: string;
    currency: string;
    address: string;
    receiptFooter: string;
    autoPrintReceipt: boolean;
  };
  updateSettings: (settings: Partial<POSState['settings']>) => void;
  
  users: {
    id: string;
    name: string;
    email: string;
    role: 'Manager' | 'Cashier';
    permissions: string;
  }[];
  addUser: (user: Omit<POSState['users'][0], 'id'>) => void;
  updateUser: (user: POSState['users'][0]) => void;
  deleteUser: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<POSState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  
  isReturnMode: false,
  setIsReturnMode: (mode) => set({ isReturnMode: mode }),

  products: mockProducts,
  customers: mockCustomers,
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
  deleteBatch: (productId, batchId) => set(state => ({
    products: state.products.map(p => 
      p.id === productId 
        ? { ...p, batches: p.batches.filter(b => b.id !== batchId) }
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

  settings: {
    pharmacyName: 'Al-Shifa Pharmacy',
    currency: 'IQD',
    address: 'Baghdad, Mansour Dist, 14th St',
    receiptFooter: 'Thank you for your visit. No refunds on open medicine.',
    autoPrintReceipt: true,
  },
  updateSettings: (newSettings) => set(state => ({ 
    settings: { ...state.settings, ...newSettings } 
  })),

  users: [
    { id: '1', name: 'Dr. Ahmed', email: 'ahmed@alshifa.com', role: 'Manager', permissions: 'All permissions' },
    { id: '2', name: 'Ali Cashier', email: 'ali@alshifa.com', role: 'Cashier', permissions: 'Basic POS, No Delete' },
  ],
  addUser: (user) => set(state => ({
    users: [...state.users, { ...user, id: generateId() }]
  })),
  updateUser: (updated) => set(state => ({
    users: state.users.map(u => u.id === updated.id ? updated : u)
  })),
  deleteUser: (id) => set(state => ({
    users: state.users.filter(u => u.id !== id)
  })),

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
  }
}));
