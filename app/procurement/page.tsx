'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { Truck, Plus, Trash2, Search, Save, PackagePlus, CheckCircle2 } from 'lucide-react';

export default function ProcurementPage() {
  const { products, receiveStock } = useStore();
  const [supplier, setSupplier] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState(false);
  
  // receiving items list
  const [receivedItems, setReceivedItems] = useState<any[]>([]);

  // search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.brandName.toLowerCase().includes(query) || 
      p.genericName.toLowerCase().includes(query) ||
      p.barcode.includes(query)
    ).slice(0, 5);
  }, [searchQuery, products]);

  const handleCompleteReception = () => {
    if (receivedItems.length === 0) return;
    
    receivedItems.forEach(item => {
      receiveStock(item.product.id, {
        batchNo: item.batchNo,
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        price: item.costPrice * 1.3, // Simple markup for simulation
      });
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setReceivedItems([]);
      setSupplier('');
      setInvoiceNo('');
    }, 2000);
  };

  const handleCreateDraftItem = (product: any) => {
    setReceivedItems(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        product,
        batchNo: '',
        expiryDate: '',
        quantity: 0,
        costPrice: 0,
      }
    ]);
    setSearchQuery('');
  };

  const updateItem = (id: string, field: string, value: any) => {
    setReceivedItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setReceivedItems(prev => prev.filter(item => item.id !== id));
  };

  const totalCost = receivedItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Receive Stock</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Procurement & Incoming</p>
        </div>
        <div className="flex gap-3">
           <Button 
             className="gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20" 
             disabled={receivedItems.length === 0}
             onClick={handleCompleteReception}
           >
             <Save className="h-4 w-4" />
             Complete Reception
           </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        {success ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="h-20 w-20 text-teal-600" />
            <h2 className="text-2xl font-black text-zinc-900">Stock Received Successfully</h2>
            <p className="text-zinc-500 font-medium">Inventory has been updated.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-8">
          
          {/* Top Form: Metadata */}
          <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">Shipment Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-500">Supplier Name</label>
                <select 
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm font-bold text-zinc-900 outline-none transition-all hover:bg-zinc-100 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                >
                  <option value="">Select Supplier...</option>
                  <option value="modern-pharma">Modern Pharma Dist.</option>
                  <option value="iraq-medical">Iraq Medical Supplies</option>
                  <option value="global-med">Global Med Logistics</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-500">Invoice Number</label>
                <Input 
                  placeholder="e.g. INV-2026-991" 
                  className="rounded-xl border-zinc-200 bg-zinc-50/50 h-11"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Add item */}
          <div className="relative rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm">
             <div className="relative">
              <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <Input
                className="h-14 rounded-2xl border-none bg-zinc-50 ps-12 text-lg font-medium shadow-none ring-1 ring-zinc-200 focus-visible:ring-2 focus-visible:ring-teal-600"
                placeholder="Scan barcode or search products to receive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
             {searchResults.length > 0 && (
              <div className="absolute left-6 right-6 top-[85px] z-50 max-h-60 overflow-y-auto rounded-2xl border border-zinc-200/60 bg-white p-2 shadow-xl backdrop-blur-xl">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    className="group flex w-full items-center justify-between rounded-xl p-3 text-start transition-all hover:bg-zinc-100/80"
                    onClick={() => handleCreateDraftItem(p)}
                  >
                    <div>
                      <div className="font-bold text-zinc-900">{p.brandName}</div>
                      <div className="text-xs font-medium text-zinc-500">{p.genericName}</div>
                    </div>
                    <Plus className="h-5 w-5 text-zinc-400 group-hover:text-teal-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Received Items */}
          <div className="rounded-2xl border border-zinc-200/50 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Product Info</th>
                  <th className="px-4 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Batch No</th>
                  <th className="px-4 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Expiry</th>
                  <th className="px-4 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] w-24">Qty</th>
                  <th className="px-4 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] w-32">Cost Price</th>
                  <th className="px-4 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Total</th>
                  <th className="px-4 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {receivedItems.length === 0 ? (
                  <tr>
                     <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-400">
                           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50">
                             <PackagePlus className="h-8 w-8 text-zinc-300" />
                           </div>
                           <p className="text-lg font-bold text-zinc-500">No items scanned yet</p>
                        </div>
                     </td>
                  </tr>
                ) : (
                  receivedItems.map((item, idx) => (
                    <tr key={item.id} className="bg-white hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900">{item.product.brandName}</div>
                        <div className="text-xs text-zinc-500">{item.product.barcode}</div>
                      </td>
                      <td className="px-2 py-4">
                        <Input 
                          placeholder="e.g. B109"
                          className="h-9 w-full bg-white text-xs font-mono font-bold"
                          value={item.batchNo}
                          onChange={(e) => updateItem(item.id, 'batchNo', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <Input 
                          type="month"
                          className="h-9 w-full bg-white text-xs font-semibold"
                          value={item.expiryDate}
                          onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <Input 
                          type="number"
                          min="0"
                          className="h-9 w-full bg-white text-right font-bold"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-2 py-4">
                        <Input 
                          type="number"
                          min="0"
                          className="h-9 w-full bg-white text-right font-bold"
                          value={item.costPrice === 0 ? '' : item.costPrice}
                          onChange={(e) => updateItem(item.id, 'costPrice', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="font-bold text-zinc-900">{(item.quantity * item.costPrice).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-4">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {receivedItems.length > 0 && (
              <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 flex justify-end">
                 <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Purchase Value</p>
                    <p className="text-3xl font-black text-zinc-900">{totalCost.toLocaleString()} IQD</p>
                 </div>
              </div>
            )}
          </div>

        </div>
        )}
      </main>
    </div>
  );
}
