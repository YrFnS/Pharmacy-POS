'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { AlertTriangle, Clock, TrendingDown, PackageOpen, BadgeCheck, FileWarning, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { products, transactions, currentUser, writeOffBatch, settings } = useStore();
  const isDark = settings.isDarkMode;
  
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
  const today = useMemo(() => new Date(), []);
  const ninetyDays = useMemo(() => new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), [today]);
  
  const expiringBatches = allBatches.filter(b => {
    const expDate = new Date(b.expiryDate);
    return expDate <= ninetyDays && expDate >= today;
  }).sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const expiredBatches = allBatches.filter(b => {
    const expDate = new Date(b.expiryDate);
    return expDate < today;
  });

  const generateSalesData = useMemo(() => {
    const data = [];
    const avgDailyTarget = 150000; 
    let tCount = 0;
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      // Mock data logic using existing transactions if any, otherwise mock some based on transactions
      const dayTransactions = transactions.filter(t => new Date(t.timestamp).toDateString() === d.toDateString());
      const dayTotal = dayTransactions.reduce((sum, t) => sum + t.total, 0);
      
      const pseudoRandom = Math.abs(Math.sin(i + 1)) * 200000 + 50000;
      const value = dayTotal || pseudoRandom;
      data.push({
        name: format(d, 'EEE'),
        sales: value,
        target: avgDailyTarget,
        aboveAvg: value >= avgDailyTarget
      });
    }
    return data;
  }, [transactions, today]);

  const topProducts = useMemo(() => {
    return [...products].sort((a,b) => b.batches.reduce((sum, bt) => sum+(bt?.price || 0), 0) - a.batches.reduce((sum, bt) => sum+(bt?.price || 0), 0)).slice(0, 5);
  }, [products]);

  const bottomProducts = useMemo(() => {
    return [...products].sort((a,b) => a.batches.reduce((sum, bt) => sum+(bt?.price || 0), 0) - b.batches.reduce((sum, bt) => sum+(bt?.price || 0), 0)).slice(0, 5);
  }, [products]);

  if (currentUser?.role === 'cashier') {
    return (
      <div className="flex h-full items-center justify-center bg-[#F9FAFB]">
        <div className="text-center p-8 bg-white rounded-3xl border border-zinc-200 shadow-xl max-w-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
             <FileWarning className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Access Restricted</h2>
          <p className="mt-2 text-zinc-500">Dashboard analytics are only available to Managers and Administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB] dark:bg-zinc-950">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Overview & Analytics</p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Quick KPI Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                 <BadgeCheck className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Active Products</p>
               <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-100">{products.length}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                 <TrendingUp className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Items Sold Today</p>
               <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-100">{itemsSoldToday}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                 <Clock className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Expiring in 90 Days</p>
               <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-100">{expiringBatches.length}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                 <FileWarning className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Expired Items</p>
               <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-100">{expiredBatches.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Sales Performance Calendar (Recent Days) */}
            <div className="flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden p-6 col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Daily Performance vs Average</h2>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Goal: 150k IQD / Day</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Above Avg</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Below Avg</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 border-t border-l border-zinc-100 dark:border-zinc-800">
                {generateSalesData.map((day, idx) => (
                  <div key={idx} className="aspect-square border-r border-b border-zinc-100 dark:border-zinc-800 p-3 flex flex-col justify-between">
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{day.name}</span>
                    <div className="flex flex-col items-center justify-center flex-1">
                      <div className={cn(
                        "h-4 w-4 rounded-full mb-2 shadow-sm",
                        day.aboveAvg ? "bg-emerald-500 shadow-emerald-500/20" : "bg-red-500 shadow-red-500/20"
                      )}></div>
                      <span className={cn("text-xs font-black", day.aboveAvg ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                        {(day.sales / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Trends Chart */}
            <div className="flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden p-6 col-span-1 lg:col-span-2">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">Business Growth Trends</h2>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateSalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#E4E4E7'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 11, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 11}} dx={-10} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '12px', border: isDark ? '1px solid #27272a' : '1px solid #E4E4E7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Line type="monotone" dataKey="sales" stroke="#0D9488" strokeWidth={3} dot={{r: 4, fill: '#0D9488', strokeWidth: 2, stroke: isDark ? '#18181b' : '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Low Stock Alert */}
             <div className="flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-6">
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400">
                      <AlertTriangle className="h-5 w-5" />
                   </div>
                   <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Low Stock Alerts</h2>
                 </div>
                 <Link href="/inventory">
                   <Button variant="ghost" size="sm" className="text-zinc-500 dark:text-zinc-400 font-bold">View All</Button>
                 </Link>
               </div>
               <div className="flex-1 p-6">
                 <div className="space-y-4">
                   {lowStockItems.length === 0 ? (
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">All inventory levels are healthy.</p>
                   ) : (
                      lowStockItems.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-4">
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.product.brandName}</p>
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{item.product.genericName}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Stock Level</p>
                             <p className="text-lg font-black text-orange-600 dark:text-orange-400">{item.totalQty} <span className="text-xs font-bold uppercase">Units</span></p>
                          </div>
                        </div>
                      ))
                   )}
                 </div>
               </div>
               <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 border-t border-zinc-100 dark:border-zinc-800">
                 <Button className="w-full bg-zinc-900 dark:bg-teal-600 font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700">
                   Generate Reorder Report
                 </Button>
               </div>
             </div>
           </div>

          {/* Expiring Soon & Analytics */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Top/Least Selling Mock Analysis */}
            <div className="flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden p-6 col-span-1 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Top Selling Products</h3>
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                         <div className="flex items-center gap-3">
                           <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 text-[10px] font-black">{i+1}</span>
                           <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{p.brandName}</span>
                         </div>
                         <span className="text-xs font-black text-teal-600 dark:text-teal-400">High Demand</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Least Selling Products</h3>
                  <div className="space-y-3">
                    {bottomProducts.map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-[10px] font-black">{i+1}</span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{p.brandName}</span>
                        </div>
                        <span className="text-xs font-black text-orange-600 dark:text-orange-400">Low Turn</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-6">
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
                      <PackageOpen className="h-5 w-5" />
                   </div>
                   <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Action Required: Expired</h2>
                 </div>
                 <Link href="/inventory">
                   <Button variant="ghost" size="sm" className="text-zinc-500 dark:text-zinc-400 font-bold">View All</Button>
                 </Link>
               </div>
               <div className="flex-1 p-0">
                 <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                   {expiredBatches.length === 0 ? (
                      <div className="p-6 text-zinc-500 dark:text-zinc-400 text-sm">No expired batches found.</div>
                   ) : (
                      expiredBatches.map(batch => (
                        <div key={batch.id} className="flex items-center justify-between p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{batch.product.brandName}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Batch: {batch.batchNo}
                              </span>
                              <span className="rounded-md bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                                Expired: {batch.expiryDate}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-bold gap-2"
                            onClick={() => writeOffBatch(batch.product.id, batch.id)}
                          >
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
