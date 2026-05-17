'use client';

import React, { useState } from 'react';
import { mockProducts } from '@/lib/mock';
import { Input, Button } from '@/components/ui';
import { Search, Plus, Filter, Package, AlertTriangle, ArrowDownToLine, MoreVertical, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = mockProducts.filter(p => 
    p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  );

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Inventory</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Master Product List</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2 rounded-xl">
             <ArrowDownToLine className="h-4 w-4" />
             Export
           </Button>
           <Button className="gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800" onClick={() => setIsAddModalOpen(true)}>
             <Plus className="h-4 w-4" />
             Add Product
           </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                   <Package className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-zinc-500">Total Products</p>
                   <p className="text-2xl font-black">{mockProducts.length}</p>
                 </div>
               </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                   <AlertTriangle className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-zinc-500">Low Stock items</p>
                   <p className="text-2xl font-black">2</p>
                 </div>
               </div>
            </div>
             <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                   <AlertTriangle className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-zinc-500">Expiring Soon</p>
                   <p className="text-2xl font-black">4</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200/50 bg-white p-3 shadow-sm">
            <div className="relative w-80">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input 
                className="h-10 rounded-xl border-none bg-zinc-50 ps-10 font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900"
                placeholder="Search brand, generic, or barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 rounded-xl text-zinc-600">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Data Table */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200/50 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Product / Generic</th>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Category</th>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Barcode</th>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Total Qty</th>
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map(p => {
                  const totalQty = p.batches.reduce((sum, b) => sum + b.quantity, 0);
                  const isExpanded = expandedRows[p.id];
                  
                  return (
                    <React.Fragment key={p.id}>
                      <tr className={cn("transition-colors hover:bg-zinc-50", isExpanded && "bg-zinc-50/80")}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-zinc-900 text-base">{p.brandName}</div>
                          <div className="text-xs font-semibold text-zinc-500">{p.genericName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-600">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-zinc-500">{p.barcode}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            "inline-flex rounded-md px-2 py-1 text-sm font-bold",
                            totalQty < 20 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                          )}>
                            {totalQty}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                           <Button 
                             size="sm" 
                             variant="ghost" 
                             className="h-8 w-8 rounded-lg p-0"
                             onClick={() => toggleRow(p.id)}
                           >
                             <ArrowDownToLine className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180" : "")} />
                           </Button>
                        </td>
                        <td className="px-6 py-4">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-zinc-50/50 px-6 py-4">
                            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden p-2">
                               <table className="w-full text-sm">
                                  <thead>
                                     <tr className="border-b border-zinc-100">
                                        <th className="px-4 py-2 font-bold text-zinc-400 uppercase tracking-widest text-[9px] text-left">Batch No</th>
                                        <th className="px-4 py-2 font-bold text-zinc-400 uppercase tracking-widest text-[9px] text-left">Expiry</th>
                                        <th className="px-4 py-2 font-bold text-zinc-400 uppercase tracking-widest text-[9px] text-right">Qty</th>
                                        <th className="px-4 py-2 font-bold text-zinc-400 uppercase tracking-widest text-[9px] text-right">Price</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     {p.batches.map(b => (
                                        <tr key={b.id} className="hover:bg-zinc-50/50">
                                           <td className="px-4 py-2 font-mono text-xs">{b.batchNo}</td>
                                           <td className="px-4 py-2">
                                              <span className={cn(
                                                "font-semibold",
                                                new Date(b.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 6)) ? "text-amber-600" : "text-zinc-600"
                                              )}>
                                                {b.expiryDate}
                                              </span>
                                           </td>
                                           <td className="px-4 py-2 text-right font-bold text-zinc-900">{b.quantity}</td>
                                           <td className="px-4 py-2 text-right font-medium text-zinc-600">{b.price.toLocaleString()} IQD</td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-100 px-8 py-6">
              <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                   <Package className="h-5 w-5" />
                 </div>
                 <h2 className="text-xl font-bold tracking-tight text-zinc-900">Add New Product</h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 outline-none hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Barcode</label>
                  <Input placeholder="Scan or enter barcode" className="h-12 rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-zinc-900" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Brand Name</label>
                  <Input placeholder="e.g. Panadol Advance" className="h-12 rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-zinc-900" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Generic Name</label>
                  <Input placeholder="e.g. Paracetamol" className="h-12 rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-zinc-900" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Category</label>
                  <select className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 font-semibold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer">
                     <option>Pain Relief</option>
                     <option>Antibiotics</option>
                     <option>Cholesterol</option>
                     <option>Respiratory</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Manufacturer</label>
                  <Input placeholder="e.g. GSK" className="h-12 rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-zinc-900" />
                </div>
                <div className="col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Shelf Location</label>
                  <Input placeholder="e.g. A3-Shelf-2" className="h-12 rounded-xl bg-white focus-visible:ring-2 focus-visible:ring-zinc-900" />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 bg-white p-6 flex justify-end gap-3">
               <Button variant="outline" className="h-12 font-bold px-8" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
               <Button className="h-12 bg-zinc-900 shadow-lg font-bold px-8" onClick={() => setIsAddModalOpen(false)}>Save Product</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
