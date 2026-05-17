'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { AlertTriangle, Clock, TrendingDown, PackageOpen, BadgeCheck, FileWarning, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export default function DashboardPage() {
  const { products, transactions } = useStore();
  
  // Calculate analytics
  const allBatches = products.flatMap(p => p.batches.map(b => ({ ...b, product: p })));
  
  const totalSalesToday = transactions.reduce((sum, t) => sum + t.total, 0);
  const itemsSoldToday = transactions.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Thresholds for alerts
  const lowStockThreshold = 20;
  
  const lowStockItems = products.map(p => {
    const totalQty = p.batches.reduce((sum, b) => sum + b.quantity, 0);
    return { product: p, totalQty };
  }).filter(item => item.totalQty < lowStockThreshold);
  
  // Expiry in next 6 months -> approx Nov 2024 to early 2025 since today is 2024 (actually it's 2026 based on timestamp 2026-05-17). Let's use Date.now() dynamic.
  const today = new Date();
  const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  
  const expiringBatches = allBatches.filter(b => {
    const expDate = new Date(b.expiryDate);
    return expDate <= ninetyDays && expDate >= today;
  }).sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const expiredBatches = allBatches.filter(b => {
    const expDate = new Date(b.expiryDate);
    return expDate < today;
  });

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Overview & Alerts</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Quick KPI Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                 <BadgeCheck className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500">Active Products</p>
               <p className="mt-1 text-3xl font-black text-zinc-900">{products.length}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                 <TrendingDown className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500">Items Sold Today</p>
               <p className="mt-1 text-3xl font-black text-zinc-900">{itemsSoldToday}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                 <Clock className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500">Expiring in 90 Days</p>
               <p className="mt-1 text-3xl font-black text-zinc-900">{expiringBatches.length}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                 <FileWarning className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500">Expired Items</p>
               <p className="mt-1 text-3xl font-black text-zinc-900">{expiredBatches.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Low Stock Alert */}
            <div className="flex flex-col rounded-3xl border border-zinc-200/50 bg-white shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b border-zinc-100 p-6">
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <AlertTriangle className="h-5 w-5" />
                   </div>
                   <h2 className="text-lg font-bold text-zinc-900">Low Stock Alerts</h2>
                 </div>
                 <Button variant="ghost" size="sm" className="text-zinc-500 font-bold">View All</Button>
               </div>
               <div className="flex-1 p-6">
                 <div className="space-y-4">
                   {lowStockItems.length === 0 ? (
                      <p className="text-zinc-500 text-sm">All inventory levels are healthy.</p>
                   ) : (
                      lowStockItems.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                          <div>
                            <p className="font-bold text-zinc-900">{item.product.brandName}</p>
                            <p className="text-xs font-semibold text-zinc-500">{item.product.genericName}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stock Level</p>
                             <p className="text-lg font-black text-orange-600">{item.totalQty} <span className="text-xs font-bold uppercase">Units</span></p>
                          </div>
                        </div>
                      ))
                   )}
                 </div>
               </div>
               <div className="bg-zinc-50 p-4 border-t border-zinc-100">
                 <Button className="w-full bg-zinc-900 font-bold text-white hover:bg-zinc-800">
                   Generate Reorder Report
                 </Button>
               </div>
            </div>

            {/* Expiring Soon */}
            <div className="flex flex-col rounded-3xl border border-zinc-200/50 bg-white shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b border-zinc-100 p-6">
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <PackageOpen className="h-5 w-5" />
                   </div>
                   <h2 className="text-lg font-bold text-zinc-900">Action Required: Expired</h2>
                 </div>
               </div>
               <div className="flex-1 p-0">
                 <div className="divide-y divide-zinc-100">
                   {expiredBatches.length === 0 ? (
                      <div className="p-6 text-zinc-500 text-sm">No expired batches found.</div>
                   ) : (
                      expiredBatches.map(batch => (
                        <div key={batch.id} className="flex items-center justify-between p-6 hover:bg-zinc-50/50">
                          <div>
                            <p className="font-bold text-zinc-900">{batch.product.brandName}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                Batch: {batch.batchNo}
                              </span>
                              <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                                Expired: {batch.expiryDate}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold gap-2">
                             Write-off
                             <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                   )}
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
