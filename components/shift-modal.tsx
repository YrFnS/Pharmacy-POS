'use client';

import { useStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Wallet, X, Calculator, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ShiftModal() {
  const { isShiftOpen, setIsShiftOpen, shiftCash, setShiftCash, isShiftModalOpen, setIsShiftModalOpen, transactions } = useStore();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('IQD');

  if (!isShiftModalOpen) return null;

  // Calculate cash sales in current shift (simulated by looking at transactions from today or since a specific timestamp)
  // For now, let's just sum all cash transactions in the store state.
  const cashSales = transactions
    .filter(t => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.total, 0);

  const expectedInDrawer = shiftCash + cashSales;

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

  const handleIncrement = (direction: 1 | -1) => {
    const step = currency === 'IQD' ? 250 : 1;
    const current = parseInt(amount || '0', 10);
    const next = current + (step * direction);
    if (next >= 0) setAmount(next.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleIncrement(-1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xl p-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-zinc-900 p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${!isShiftOpen ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                {isShiftOpen ? <Calculator className="h-6 w-6" /> : <Wallet className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{isShiftOpen ? 'Close Shift' : 'Open Shift'}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{isShiftOpen ? 'End of day Z-Report' : 'Start your day'}</p>
              </div>
           </div>
           <button onClick={handleCloseModal} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
              <X className="h-5 w-5" />
           </button>
        </div>

        {!isShiftOpen ? (
          <form onSubmit={handleOpenShift} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Currency</label>
                <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 shadow-inner border border-zinc-200/50 dark:border-zinc-700">
                  <button 
                    type="button"
                    onClick={() => setCurrency('IQD')}
                    className={cn("flex-1 py-3 text-sm font-black rounded-lg transition-all", currency === 'IQD' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
                  >
                    IQD
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={cn("flex-1 py-3 text-sm font-black rounded-lg transition-all", currency === 'USD' ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Starting Cash in Drawer</label>
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-16 w-16 shrink-0 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center"
                  onClick={() => handleIncrement(-1)}
                >
                  <Minus className="h-6 w-6 stroke-[3]" />
                </Button>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400 dark:text-zinc-500">{currency}</span>
                  <Input 
                    type="number"
                    placeholder="0"
                    className="h-16 w-full rounded-2xl border-none bg-white dark:bg-zinc-800 pl-16 pr-6 text-xl font-black text-zinc-900 dark:text-zinc-100 shadow-inner ring-1 ring-zinc-200 dark:ring-zinc-700 focus-visible:ring-2 focus-visible:ring-teal-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-16 w-16 shrink-0 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center"
                  onClick={() => handleIncrement(1)}
                >
                  <Plus className="h-6 w-6 stroke-[3]" />
                </Button>
              </div>
            </div>
            <Button type="submit" className="h-14 w-full rounded-xl bg-teal-600 text-lg font-bold text-white shadow-xl shadow-teal-600/20 active:scale-[0.98] hover:bg-teal-700">
              Start Shift
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCloseShift} className="space-y-6">
             <div className="rounded-3xl bg-zinc-50 dark:bg-zinc-800 p-6 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700 mb-6 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-zinc-500 dark:text-zinc-400">Starting Cash</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100">{shiftCash.toLocaleString()} IQD</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-zinc-500 dark:text-zinc-400">Cash Sales</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">+ {cashSales.toLocaleString()} IQD</span>
                 </div>
                 <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700"></div>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-500 dark:text-zinc-400">Expected in Drawer</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100 text-xl">{expectedInDrawer.toLocaleString()} IQD</span>
                 </div>
             </div>
             
             <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Actual Cash Counted</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400 dark:text-zinc-500">IQD</span>
                <Input 
                  type="number"
                  placeholder="0"
                  className="h-16 w-full rounded-2xl border-none bg-white dark:bg-zinc-800 text-xl font-black text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700 focus-visible:ring-2 focus-visible:ring-amber-500 pl-16 pr-6"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="h-14 w-full rounded-xl bg-zinc-900 dark:bg-teal-600 text-lg font-bold text-white shadow-xl shadow-zinc-900/10 active:scale-[0.98] hover:bg-zinc-800 dark:hover:bg-teal-700">
              Close Shift & Print Report
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
