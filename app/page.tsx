'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useStore } from '@/lib/store';
import { mockProducts, mockCustomers } from '@/lib/mock';
import { Button, Input } from '@/components/ui';
import { PaymentModal } from '@/components/payment-modal';
import { Search, Trash2, Plus, Minus, CreditCard, Globe, ScrollText, User as UserIcon, Tag, Pill, PauseCircle, PlayCircle, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function POSPage() {
  const { t, language, isRtl } = useTranslation();
  const { 
    setLanguage, 
    cart,
    heldCarts,
    holdCart,
    resumeCart,
    addToCart, 
    removeFromCart, 
    updateQuantity,
    setDiscount,
    customerId,
    setCustomer,
    clearCart,
    setPaymentModalOpen,
    isShiftOpen,
    setIsShiftModalOpen,
    isReturnMode,
    setIsReturnMode
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSubstitutesFor, setShowSubstitutesFor] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRtl, language]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockProducts.filter(p => 
      p.brandName.toLowerCase().includes(query) || 
      p.genericName.toLowerCase().includes(query) ||
      p.barcode.includes(query)
    ).slice(0, 8); // nice limit
  }, [searchQuery]);

  const handleProductSelect = (product: typeof mockProducts[0]) => {
    const batch = product.batches[0];
    if (batch.quantity <= 0 && !isReturnMode) return;
    addToCart(product.id, batch.id);
    setSearchQuery('');
  };

  const cartData = cart.map(item => {
    const product = mockProducts.find(p => p.id === item.productId);
    const batch = product?.batches.find(b => b.id === item.batchId);
    const price = batch?.price || 0;
    const discountAmount = price * (item.discountPercent / 100);
    const finalPrice = price - discountAmount;
    return {
      ...item,
      product,
      batch,
      total: finalPrice * item.quantity * (item.isReturn ? -1 : 1)
    };
  });

  const subtotal = cartData.reduce((sum, item) => sum + item.total, 0);
  
  const getSubstitutes = (genericName: string, excludeId: string) => {
    return mockProducts.filter(p => p.genericName === genericName && p.id !== excludeId && p.batches.some(b => b.quantity > 0));
  };

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB] font-sans text-zinc-900 selection:bg-zinc-200">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-zinc-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm shadow-zinc-900/10">
            <Pill className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t('app_title')}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-100 p-1 pl-4">
             <div className="flex flex-col text-end">
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Shift</span>
               <span className={cn("text-xs font-bold", isShiftOpen ? "text-emerald-600" : "text-amber-600")}>
                 {isShiftOpen ? 'Open' : 'Closed'}
               </span>
             </div>
             <Button 
               size="sm" 
               variant={isShiftOpen ? "outline" : "default"} 
               className={cn("rounded-lg border-none shadow-none font-bold", isShiftOpen ? "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50" : "bg-teal-600 text-white hover:bg-teal-700")}
               onClick={() => setIsShiftModalOpen(true)}
             >
               {isShiftOpen ? 'Manage' : 'Open Shift'}
             </Button>
          </div>
          
          <div className="flex flex-col text-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{t('cashier')}</span>
            <span className="text-sm font-semibold text-zinc-900">Dr. Ahmed</span>
          </div>
          <div className="h-8 w-px bg-zinc-200"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="gap-2 rounded-lg"
          >
            <Globe className="h-4 w-4 text-zinc-500" />
            <span className="font-semibold">{language === 'en' ? 'عربي' : 'English'}</span>
          </Button>
        </div>
      </header>

    {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left column: Product Browse / Search */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#F9FAFB]">
          {/* Smart Search Area */}
          <div className="relative z-20 border-b border-zinc-200/50 bg-white p-4 drop-shadow-sm">
            <div className="relative mx-auto w-full max-w-4xl">
              <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                autoFocus
                className="h-12 rounded-xl border-zinc-200/80 bg-zinc-50/50 ps-12 text-base font-semibold shadow-inner placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-900 focus:bg-white"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-1/2 top-[calc(100%+8px)] z-50 max-h-[50vh] w-full max-w-4xl -translate-x-1/2 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                {searchResults.map((p) => {
                  const outOfStock = p.batches[0].quantity <= 0;
                  const disabled = outOfStock && !isReturnMode;
                  const substitutes = outOfStock ? getSubstitutes(p.genericName, p.id) : [];
                  
                  return (
                    <div key={p.id} className="flex flex-col border-b border-zinc-100 last:border-0 p-1">
                    <button
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg p-3 text-start transition-all focus:outline-none",
                        disabled ? (substitutes.length ? "hover:bg-zinc-50" : "opacity-50 cursor-not-allowed") : "hover:bg-zinc-50 focus:bg-zinc-50"
                      )}
                      disabled={disabled && substitutes.length === 0}
                      onClick={() => !disabled ? handleProductSelect(p) : setShowSubstitutesFor(showSubstitutesFor === p.id ? null : p.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <div className={cn("font-bold", !outOfStock ? "text-zinc-900" : "text-zinc-400")}>{p.brandName}</div>
                          <div className="text-xs font-medium text-zinc-500">
                            {p.genericName} • 
                            <span className={cn("font-bold ml-1", !outOfStock ? "text-emerald-600" : "text-red-500")}>
                              {!outOfStock ? `${p.batches[0].quantity} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-4 text-end">
                        {outOfStock && substitutes.length > 0 && (
                          <div className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-700 uppercase shadow-sm">
                            Show Substitutes
                          </div>
                        )}
                        <div className="text-end">
                          <div className={cn("font-bold", !outOfStock ? "text-teal-600" : "text-zinc-400")}>{p.batches[0].price.toLocaleString()} {t('currency')}</div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Exp: {p.batches[0].expiryDate}</div>
                        </div>
                      </div>
                    </button>
                    {showSubstitutesFor === p.id && outOfStock && substitutes.length > 0 && (
                      <div className="pl-6 pr-2 py-2 space-y-1 bg-amber-50/50 rounded-b-lg -mt-1 border-t border-amber-100/50">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Available Substitutes</div>
                        {substitutes.map(sub => (
                           <button 
                             key={sub.id}
                             onClick={() => handleProductSelect(sub)}
                             className="flex w-full items-center justify-between rounded-md p-2 hover:bg-white text-left transition-colors shadow-sm ring-1 ring-black/5"
                           >
                             <div>
                               <div className="font-bold text-zinc-900 text-sm">{sub.brandName}</div>
                               <div className="text-[10px] font-semibold text-zinc-500">{sub.batches[0].quantity} in stock</div>
                             </div>
                             <div className="text-right">
                               <div className="font-bold text-teal-600 text-sm">{sub.batches[0].price.toLocaleString()} {t('currency')}</div>
                             </div>
                           </button>
                        ))}
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Products Catalog</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {mockProducts.map(p => {
                 const outOfStock = p.batches[0].quantity <= 0;
                 const disabled = outOfStock && !isReturnMode;
                 return (
                 <button 
                   key={p.id}
                   className={cn(
                     "flex flex-col items-start rounded-2xl border border-zinc-200/60 bg-white p-4 text-left shadow-sm transition-all active:scale-[0.98]",
                     disabled ? "opacity-50 cursor-not-allowed" : "hover:border-teal-500/30 hover:bg-teal-50/10 hover:shadow-md"
                   )}
                   disabled={disabled}
                   onClick={() => handleProductSelect(p)}
                 >
                    <div className="mb-4 flex flex-row w-full justify-between items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
                         <Pill className="h-5 w-5" />
                      </div>
                      {outOfStock ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded-full">Out of stock</span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{p.batches[0].quantity} in stock</span>
                      )}
                    </div>
                    <div className="line-clamp-1 w-full text-base font-bold text-zinc-900">{p.brandName}</div>
                    <div className="mt-1 line-clamp-1 text-xs font-semibold text-zinc-500">{p.genericName}</div>
                    
                    <div className="mt-4 flex w-full items-end justify-between">
                      <div className={cn("text-sm font-black focus:outline-none", outOfStock ? "text-zinc-400" : "text-teal-600")}>
                        {p.batches[0].price.toLocaleString()} <span className="text-[10px]">IQD</span>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-400">
                        <Plus className="h-3 w-3" />
                      </div>
                    </div>
                 </button>
                 );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Cart, Customer, Totals */}
        <div className="w-[420px] shrink-0 border-s border-zinc-200/50 bg-white flex flex-col shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.02)] z-10">
          
          {/* Customer Selection */}
          <div className="border-b border-zinc-100 p-4">
            <div className="relative group">
              <UserIcon className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-hover:text-zinc-600" />
              <select 
                className="w-full appearance-none rounded-lg border-none bg-zinc-50/80 py-2.5 ps-10 pe-4 text-sm font-bold text-zinc-900 outline-none transition-all hover:bg-zinc-100 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                value={customerId}
                onChange={(e) => setCustomer(e.target.value)}
              >
                {mockCustomers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.debt > 0 ? `• Debt: ${c.debt.toLocaleString()}` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex bg-zinc-50 border-b border-zinc-100 p-2">
            <button
              onClick={() => setIsReturnMode(false)}
              className={cn("flex-1 rounded-lg py-2 text-xs font-bold transition-all", !isReturnMode ? "bg-white shadow-sm text-zinc-900 border border-zinc-200/50" : "text-zinc-500 hover:text-zinc-700")}
            >
              Sales Mode
            </button>
            <button
              onClick={() => setIsReturnMode(true)}
              className={cn("flex-1 rounded-lg py-2 text-xs font-bold transition-all", isReturnMode ? "bg-red-50 text-red-600 shadow-sm border border-red-200/50" : "text-zinc-500 hover:text-zinc-700")}
            >
              Return Mode
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto bg-zinc-50/30 p-2">
            {cartData.length === 0 ? (
               <div className="flex h-full flex-col items-center justify-center text-zinc-400 opacity-60">
                  <ScrollText className="mb-4 h-12 w-12" />
                  <p className="text-sm font-bold">{t('cart')} is empty</p>
               </div>
            ) : (
               <div className="space-y-4 pt-2">
                  {cartData.map((item) => (
                     <div key={item.cartItemId} className={cn("group relative flex flex-col gap-3 rounded-xl border p-3 shadow-sm transition-colors", item.isReturn ? "border-red-200/60 bg-red-50/30 hover:border-red-300" : "border-zinc-200/60 bg-white hover:border-zinc-300")}>
                        {item.isReturn && (
                           <div className="absolute -top-2 left-3 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 px-1.5 py-0.5 text-red-700 shadow-sm border border-red-200/50">Return</div>
                        )}
                        <div className="flex justify-between items-start gap-2">
                          <div className="w-full mt-1">
                            <div className="font-bold text-zinc-900 line-clamp-1">{item.product?.brandName}</div>
                            <div className="text-[10px] font-semibold text-zinc-500">{item.product?.genericName}</div>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                               <span>B: {item.batch?.batchNo}</span>
                               <span>•</span>
                               <span>Exp: {item.batch?.expiryDate}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
                          <div className={cn("flex items-center gap-1 rounded-lg p-1 border", item.isReturn ? "bg-red-50/50 border-red-100" : "bg-zinc-50 border-zinc-200/50")}>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-zinc-500 shadow-sm hover:text-zinc-900 active:scale-95"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold select-none">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-zinc-500 shadow-sm hover:text-zinc-900 active:scale-95"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1 mx-2">
                             <div className="relative">
                                <Percent className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                                <input 
                                  type="number"
                                  className="w-14 rounded-md border border-zinc-200 bg-white py-1 pl-6 pr-1 text-xs font-bold text-zinc-900 shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                                  placeholder="0"
                                  value={item.discountPercent || ''}
                                  onChange={(e) => setDiscount(item.cartItemId, parseFloat(e.target.value) || 0)}
                                  min="0"
                                  max="100"
                                />
                             </div>
                          </div>

                          <div className="text-right">
                             <div className={cn("text-sm font-black", item.isReturn ? "text-red-600" : "text-zinc-900")}>
                               {item.total.toLocaleString()} IQD
                             </div>
                             {item.quantity > 1 && (
                               <div className="text-[10px] font-bold text-zinc-400">{item.quantity} × {item.batch?.price.toLocaleString()}</div>
                             )}
                          </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
          </div>

          {/* Totals Area */}
          <div className="bg-white p-5 border-t border-zinc-200/80 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-semibold uppercase tracking-widest">{t('subtotal')}</span>
                <span className={cn("font-bold", subtotal < 0 ? "text-red-600" : "text-zinc-900")}>{subtotal.toLocaleString()} {t('currency')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-semibold uppercase tracking-widest">{t('discount')}</span>
                <span className="font-bold text-emerald-600">0 {t('currency')}</span>
              </div>
              
              <div className="mt-2 rounded-xl bg-zinc-900 p-4 text-white shadow-xl shadow-zinc-900/20">
                <div className="flex items-end justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{t('grand_total')}</span>
                  <div className="text-end">
                    <span className={cn("block text-3xl font-black tracking-tight leading-none mb-1", subtotal < 0 && "text-red-400")}>
                      {subtotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('currency')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button variant="outline" className="h-10 w-full text-xs font-bold" onClick={clearCart}>
                {t('clear_cart')}
              </Button>
              <Button variant="secondary" className="h-10 w-full text-xs font-bold gap-2" onClick={holdCart} disabled={cart.length === 0}>
                <PauseCircle className="h-4 w-4" /> {t('hold_cart')}
              </Button>
            </div>
            
            {heldCarts.length > 0 && (
              <div className="mb-3 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Held Transactions</div>
                {heldCarts.map(hc => (
                   <Button key={hc.id} variant="outline" className="w-full h-10 text-xs font-bold justify-between bg-amber-50/50 border-amber-200 text-amber-700 hover:bg-amber-100" onClick={() => resumeCart(hc.id)}>
                      <div className="flex items-center gap-2"><PlayCircle className="h-4 w-4" /> Resume Cart</div>
                      <span>{hc.cart.length} items</span>
                   </Button>
                ))}
              </div>
            )}

            <Button 
              size="lg" 
              className={cn("w-full h-14 text-base font-black shadow-xl transition-all active:scale-[0.98]", isShiftOpen ? (subtotal < 0 ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20" : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20") : "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none")}
              disabled={cart.length === 0 || !isShiftOpen}
              onClick={() => {
                if (isShiftOpen) setPaymentModalOpen(true);
              }}
            >
              <CreditCard className="me-2 h-5 w-5" />
              {!isShiftOpen ? 'Shift is Closed' : (subtotal < 0 ? 'Refund' : t('pay'))}
            </Button>
          </div>

        </div>
      </main>
      
      {/* Modals */}
      <PaymentModal />
    </div>
  );
}
