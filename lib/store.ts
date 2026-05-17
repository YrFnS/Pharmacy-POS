import { create } from 'zustand';
import { Language } from './i18n';
import { mockProducts, mockCustomers } from './mock';

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
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<POSState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  
  isReturnMode: false,
  setIsReturnMode: (mode) => set({ isReturnMode: mode }),

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
    const existing = cart.find(item => item.productId === productId && item.batchId === batchId && item.isReturn === isReturnMode);
    
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
}));
