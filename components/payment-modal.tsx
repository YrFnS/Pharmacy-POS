'use client';

import { useStore } from '@/lib/store';
import { useTranslation } from '@/hooks/use-translation';
import { Button, Input } from '@/components/ui';
import { X, CheckCircle2, CircleDollarSign } from 'lucide-react';
import { useState } from 'react';

export function PaymentModal() {
  const { isPaymentModalOpen, setPaymentModalOpen, cart, completeSale, products, cartDiscountType, cartDiscountValue } = useStore();
  const { t, isRtl, language } = useTranslation();
  
  const [amountGiven, setAmountGiven] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'card'|'tab'>('cash');

  if (!isPaymentModalOpen) return null;

  const subtotalItems = cart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.productId);
    const b = p?.batches.find(batch => batch.id === item.batchId);
    const price = b?.price || 0;
    
    let discountAmount = 0;
    if (item.discountType === 'percent') {
      discountAmount = price * (item.discountValue / 100);
    } else {
      discountAmount = item.discountValue;
    }
    
    const finalPrice = price - discountAmount;
    return sum + (finalPrice * item.quantity * (item.isReturn ? -1 : 1));
  }, 0);

  let total = subtotalItems;
  if (cartDiscountValue > 0) {
    if (cartDiscountType === 'percent') {
      total = subtotalItems * (1 - cartDiscountValue / 100);
    } else {
      total = subtotalItems - cartDiscountValue;
    }
  }

  const absTotal = Math.abs(total);
  const amount = Number(amountGiven) || 0;
  const change = amount - absTotal;
  const isValid = total <= 0 ? true : amount >= total;

  const quickAmounts = [
    absTotal, // Exact amount
    Math.ceil(absTotal / 5000) * 5000,
    Math.ceil(absTotal / 10000) * 10000,
    Math.ceil(absTotal / 25000) * 25000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= absTotal).sort((a,b) => a-b);

  const handleComplete = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      completeSale(paymentMethod);
      setAmountGiven('');
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
         <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="mb-6 h-24 w-24 text-zinc-900" />
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">Payment Successful</h2>
            <p className="mt-3 text-lg font-medium text-zinc-500">Change due: <span className="font-bold text-zinc-900">{Math.max(0, change).toLocaleString()} {t('currency')}</span></p>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl" dir={isRtl ? 'rtl' : 'ltr'} lang={language}>
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-white px-8 py-6">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
               <CircleDollarSign className="h-5 w-5" />
             </div>
             <h2 className="text-xl font-bold tracking-tight text-zinc-900">{t('payment_methods')}</h2>
          </div>
          <button 
            onClick={() => setPaymentModalOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-50/50">
          
          {/* Payment Method Tabs */}
          <div className="flex rounded-xl bg-zinc-200/50 p-1">
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${paymentMethod === 'cash' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              onClick={() => setPaymentMethod('cash')}
            >
              Cash
            </button>
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              onClick={() => setPaymentMethod('card')}
            >
              Credit Card
            </button>
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${paymentMethod === 'tab' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              onClick={() => setPaymentMethod('tab')}
            >
              Store Credit
            </button>
          </div>

          {/* Total Display */}
          <div className="rounded-3xl bg-zinc-900 p-8 text-center shadow-xl shadow-zinc-900/10">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t('grand_total')}</div>
            <div className="mt-3 flex items-end justify-center gap-2">
              <span className="text-5xl font-black tracking-tight text-white">{total.toLocaleString()}</span>
              <span className="mb-1 text-lg font-bold text-zinc-400 uppercase">{t('currency')}</span>
            </div>
          </div>

          {/* Amount Tendered */}
          {paymentMethod === 'cash' ? (
            <>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Amount Received</label>
                <Input 
                  type="number" 
                  autoFocus
                  className="h-16 rounded-2xl bg-white text-center text-2xl font-bold shadow-sm placeholder:text-zinc-300"
                  placeholder="0"
                  value={amountGiven}
                  onChange={(e) => setAmountGiven(e.target.value)}
                />

                {/* Quick Cash Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {quickAmounts.map((amt, idx) => (
                    <Button 
                      key={idx}
                      variant="outline" 
                      className={`h-14 rounded-xl border-zinc-200 font-bold transition-all ${amount === amt ? 'border-zinc-900 bg-zinc-900 text-white' : 'hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'}`}
                      onClick={() => setAmountGiven(amt.toString())}
                    >
                      {idx === 0 ? t('exact_amount') : amt.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-200/60"></div>

              {/* Change Display */}
              <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/50">
                 <span className="text-lg font-bold text-zinc-500">{t('change_due')}</span>
                 <span className={`text-2xl font-black tracking-tight ${change >= 0 ? 'text-zinc-900' : 'text-red-500'}`}>
                    {change > 0 ? change.toLocaleString() : "0"} <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t('currency')}</span>
                 </span>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-zinc-500 font-semibold border-2 border-dashed border-zinc-200 rounded-2xl">
               Please ask the customer to complete the {paymentMethod === 'card' ? 'credit card' : 'store credit'} verification.
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-100 bg-white p-8 flex items-center justify-between">
           <label className="group flex cursor-pointer items-center gap-3">
              <div className="relative flex items-center">
                 <input type="checkbox" className="peer h-5 w-5 appearance-none rounded-md border-2 border-zinc-300 transition-all checked:border-zinc-900 checked:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 default:checked" defaultChecked />
                 <CheckCircle2 className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-white opacity-0 transition-opacity peer-checked:opacity-100 p-0.5" />
              </div>
              <span className="text-sm font-bold text-zinc-600 transition-colors group-hover:text-zinc-900">{t('print_receipt')}</span>
           </label>
           
           <Button 
             size="lg" 
             className="h-16 px-10 text-lg font-bold shadow-xl shadow-zinc-900/10 transition-transform active:scale-[0.98]"
             disabled={paymentMethod === 'cash' ? !isValid : false}
             onClick={handleComplete}
           >
             {t('complete_sale')}
           </Button>
        </div>

      </div>
    </div>
  );
}
