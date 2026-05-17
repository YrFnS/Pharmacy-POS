'use client';

import { useStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { Wallet, X, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ShiftModal() {
  const { isShiftOpen, setIsShiftOpen, shiftCash, setShiftCash, isShiftModalOpen, setIsShiftModalOpen, transactions } = useStore();
  const [amount, setAmount] = useState('');

  if (!isShiftModalOpen) return null;

  // Calculate cash sales in current shift (simulated by looking at transactions from today or since a specific timestamp)
  // For now, let's just sum all cash transactions in the store state.
  const cashSales = transactions
    .filter(t => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.total, 0);

  const expectedInDrawer = shiftCash + cashSales;
  const actualAmount = Number(amount) || 0;
  const difference = actualAmount - expectedInDrawer;

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    setShiftCash(Number(amount) || 0);
    setIsShiftOpen(true);
    setAmount('');
    setIsShiftModalOpen(false);
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    setIsShiftOpen(false);
    setShiftCash(0);
    setAmount('');
    setIsShiftModalOpen(false);
  };
  
  const handleCloseModal = () => {
    setAmount('');
    setIsShiftModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xl p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${!isShiftOpen ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}`}>
                {isShiftOpen ? <Calculator className="h-6 w-6" /> : <Wallet className="h-6 w-6" />}
             </div>
             <div>
                <h2 className="text-xl font-black tracking-tight text-zinc-900">{isShiftOpen ? 'Close Shift' : 'Open Shift'}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{isShiftOpen ? 'End of day Z-Report' : 'Start your day'}</p>
             </div>
           </div>
           <button onClick={handleCloseModal} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
              <X className="h-5 w-5" />
           </button>
        </div>

        {!isShiftOpen ? (
          <form onSubmit={handleOpenShift} className="space-y-6">
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-500">Starting Cash in Drawer</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">IQD</span>
                <Input 
                  type="number"
                  placeholder="0"
                  className="h-16 rounded-2xl border-none bg-zinc-50 text-center text-3xl font-black shadow-inner ring-1 ring-zinc-200 focus-visible:ring-2 focus-visible:ring-teal-600"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="h-14 w-full rounded-xl bg-teal-600 text-lg font-bold text-white shadow-xl shadow-teal-600/20 active:scale-[0.98] hover:bg-teal-700">
              Start Shift
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCloseShift} className="space-y-6">
             <div className="rounded-3xl bg-zinc-50 p-6 shadow-sm ring-1 ring-zinc-200/50 mb-6 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-zinc-500">Starting Cash</span>
                    <span className="font-black text-zinc-900">{shiftCash.toLocaleString()} IQD</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-zinc-500">Cash Sales</span>
                    <span className="font-black text-emerald-600">+ {cashSales.toLocaleString()} IQD</span>
                 </div>
                 <div className="h-px w-full bg-zinc-200"></div>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-500">Expected in Drawer</span>
                    <span className="font-black text-zinc-900 text-xl">{expectedInDrawer.toLocaleString()} IQD</span>
                 </div>
                 {amount && (
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-zinc-200">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Difference</span>
                      <span className={cn(
                        "font-black text-sm",
                        difference === 0 ? "text-emerald-500" : difference > 0 ? "text-blue-500" : "text-red-500"
                      )}>
                        {difference > 0 ? '+' : ''}{difference.toLocaleString()} IQD
                      </span>
                    </div>
                 )}
             </div>
             
             <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-500">Actual Cash Counted</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">IQD</span>
                <Input 
                  type="number"
                  placeholder="0"
                  className="h-16 rounded-2xl border-none bg-white text-center text-3xl font-black shadow-sm ring-1 ring-zinc-200 focus-visible:ring-2 focus-visible:ring-amber-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="h-14 w-full rounded-xl bg-zinc-900 text-lg font-bold text-white shadow-xl shadow-zinc-900/10 active:scale-[0.98] hover:bg-zinc-800">
              Close Shift & Print Report
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
