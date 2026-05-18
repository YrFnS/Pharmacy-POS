'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Input, Button } from '@/components/ui';
import { Search, Plus, Filter, Package, AlertTriangle, ArrowDownToLine, MoreVertical, X, CheckCircle2, Trash2, Edit2, Pill, FlaskConical, Droplet, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const getProductIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('syrup') || cat.includes('oral') || cat.includes('gastro')) return <FlaskConical className="h-3 w-3" />;
  if (cat.includes('topical') || cat.includes('cream') || cat.includes('ointment')) return <Droplet className="h-3 w-3" />;
  return <Pill className="h-3 w-3" />;
};

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [filterType, setFilterType] = useState<'All' | 'Low Stock' | 'Expiring'>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Form state
  const [newProduct, setNewProduct] = useState({
    barcode: '',
    brandName: '',
    genericName: '',
    category: 'Pain Relief',
    initialBatch: {
      batchNo: '',
      expiryDate: '',
      quantity: '',
      price: '',
    }
  });

  const [editFormData, setEditFormData] = useState({
    brandName: '',
    genericName: '',
    category: '',
    barcode: '',
  });

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setEditFormData({
      brandName: product.brandName,
      genericName: product.genericName,
      category: product.category,
      barcode: product.barcode,
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    updateProduct({
      ...editingProduct,
      ...editFormData
    });
    setEditingProduct(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    try {
      const headers = ['Brand Name', 'Generic Name', 'Category', 'Barcode', 'Batch No', 'Expiry Date', 'Quantity', 'Price'];
      const rows: any[] = [];
      
      filteredProducts.forEach(p => {
        p.batches.forEach(b => {
          rows.push([
            p.brandName,
            p.genericName,
            p.category,
            p.barcode,
            b.batchNo,
            b.expiryDate,
            b.quantity,
            b.price
          ]);
        });
      });

      if (rows.length === 0) {
        return;
      }

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory_detailed_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const triggerPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      (e.target as any).showPicker?.();
    } catch (err) {
      // Cross-origin or other restriction - ignore and let default behavior happen
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    let matchesFilter = true;
    if (filterType === 'Low Stock') {
      const totalQty = p.batches.reduce((sum, b) => sum + b.quantity, 0);
      matchesFilter = totalQty < 20;
    } else if (filterType === 'Expiring') {
      const ninetyDays = new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000);
      matchesFilter = p.batches.some(b => new Date(b.expiryDate) <= ninetyDays);
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleAddProduct = () => {
    if (!newProduct.brandName || !newProduct.barcode) return;
    
    // Ensure at least one batch exists or create a placeholder one to prevent crashes
    const batches = [];
    batches.push({
      id: Math.random().toString(36).substr(2, 9),
      batchNo: newProduct.initialBatch.batchNo || 'INITIAL',
      expiryDate: newProduct.initialBatch.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
      quantity: parseInt(newProduct.initialBatch.quantity) || 0,
      price: parseInt(newProduct.initialBatch.price) || 0,
    });

    addProduct({
      barcode: newProduct.barcode,
      brandName: newProduct.brandName,
      genericName: newProduct.genericName,
      category: newProduct.category,
      batches: batches,
    });

    setIsAddModalOpen(false);
    setNewProduct({ 
      barcode: '', 
      brandName: '', 
      genericName: '', 
      category: 'Pain Relief',
      initialBatch: { batchNo: '', expiryDate: '', quantity: '', price: '' }
    });
  };

  const lowStockThreshold = 20;

  const lowStockCount = products.filter(p => {
    const totalQty = p.batches.reduce((sum, b) => sum + b.quantity, 0);
    return totalQty < lowStockThreshold;
  }).length;

  const today = new Date();
  const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const expiringCount = products.flatMap(p => p.batches).filter(b => {
    const expDate = new Date(b.expiryDate);
    return expDate <= ninetyDays && expDate >= today;
  }).length;

  return (
    <div className="flex h-full flex-col bg-[#F9FAFB] dark:bg-zinc-950">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Inventory</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Master Product List</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2 rounded-xl text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={handleExport}>
             <ArrowDownToLine className="h-4 w-4" />
             Export
           </Button>
           <Button className="gap-2 rounded-xl bg-zinc-900 dark:bg-teal-600 hover:bg-zinc-800 dark:hover:bg-teal-700 text-white" onClick={() => setIsAddModalOpen(true)}>
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
            <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                   <Package className="h-5 w-5" />
                 </div>
                  <div>
                   <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Total Products</p>
                   <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{products.length}</p>
                 </div>
               </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                   <AlertTriangle className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Low Stock items</p>
                   <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{lowStockCount}</p>
                 </div>
               </div>
            </div>
             <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                   <Clock className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Expiring Soon</p>
                   <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{expiringCount}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm">
            <div className="relative w-80">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input 
                className="h-10 rounded-xl border-none bg-zinc-50 dark:bg-zinc-800 ps-10 font-medium text-zinc-900 dark:text-zinc-100 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-teal-600"
                placeholder="Search brand, generic, or barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 relative">
              <select 
                className="appearance-none h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-600 dark:text-zinc-400 outline-none cursor-pointer focus:ring-2 focus:ring-zinc-900 dark:focus:ring-teal-600 focus:border-zinc-900 dark:focus:border-teal-600"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Button 
                variant="outline" 
                className={cn("gap-2 rounded-xl text-zinc-600 dark:text-zinc-400 dark:border-zinc-800", filterType !== 'All' && "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-900/20")}
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="h-4 w-4" />
                {filterType === 'All' ? 'More Filters' : filterType}
              </Button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    className={cn("w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition-colors", filterType === 'All' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100")}
                    onClick={() => { setFilterType('All'); setIsFilterMenuOpen(false); }}
                  >
                    All Items
                  </button>
                  <button 
                    className={cn("w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition-colors", filterType === 'Low Stock' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100")}
                    onClick={() => { setFilterType('Low Stock'); setIsFilterMenuOpen(false); }}
                  >
                    Low Stock
                  </button>
                  <button 
                    className={cn("w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition-colors", filterType === 'Expiring' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100")}
                    onClick={() => { setFilterType('Expiring'); setIsFilterMenuOpen(false); }}
                  >
                    Expiring Soon
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col h-[calc(100vh-320px)]">
            <div className="overflow-auto flex-1 relative">
              <table className="w-full text-left text-sm relative">
                <thead className="bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur sticky top-0 z-10 shadow-sm text-zinc-600 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Product / Generic</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Category</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Barcode</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Total Qty</th>
                    <th className="px-6 py-4 w-12"></th>
                    <th className="px-6 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProducts.map(p => {
                  const totalQty = p.batches.reduce((sum, b) => sum + b.quantity, 0);
                  const isExpanded = expandedRows[p.id];
                  
                  return (
                    <React.Fragment key={p.id}>
                      <tr className={cn("transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50", isExpanded && "bg-zinc-50/80 dark:bg-zinc-800/30")}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-base">{p.brandName}</div>
                          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{p.genericName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                            {getProductIcon(p.category)}
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">{p.barcode}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            "inline-flex rounded-md px-2 py-1 text-sm font-bold",
                            totalQty < 20 ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          )}>
                            {totalQty}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-lg p-0 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                              onClick={() => toggleRow(p.id)}
                              title={isExpanded ? 'Hide Details' : 'Show Details'}
                            >
                              {isExpanded ? <Plus className="h-4 w-4 rotate-45 transition-transform" /> : <MoreVertical className="h-4 w-4" />}
                            </Button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className={cn("h-8 w-8 rounded-lg transition-colors", deleteConfirmId === p.id ? "bg-red-500 text-white hover:bg-red-600" : "text-red-500 dark:text-red-400")}
                              onClick={() => {
                                if (deleteConfirmId === p.id) {
                                  deleteProduct(p.id);
                                  setDeleteConfirmId(null);
                                } else {
                                  setDeleteConfirmId(p.id);
                                  setTimeout(() => setDeleteConfirmId(null), 3000);
                                }
                              }}
                            >
                              {deleteConfirmId === p.id ? <CheckCircle2 className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all hover:border-teal-200 dark:hover:border-teal-800"
                              onClick={() => handleEditClick(p)}
                              title="Edit Product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4">
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden p-2">
                               <table className="w-full text-sm">
                                         <thead>
                                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                               <th className="px-4 py-2 font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] text-left">Batch No</th>
                                               <th className="px-4 py-2 font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] text-left">Expiry</th>
                                               <th className="px-4 py-2 font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] text-right">Qty</th>
                                               <th className="px-4 py-2 font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[9px] text-right">Price</th>
                                            </tr>
                                         </thead>
                                  <tbody>
                                         {p.batches.map(b => (
                                            <tr key={b.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                               <td className="px-4 py-2 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">{b.batchNo}</td>
                                               <td className="px-4 py-2">
                                                  <span className={cn(
                                                    "font-semibold",
                                                    new Date(b.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 6)) ? "text-amber-600 dark:text-amber-400" : "text-zinc-800 dark:text-zinc-200"
                                                  )}>
                                                    {b.expiryDate}
                                                  </span>
                                               </td>
                                               <td className="px-4 py-2 text-right font-bold text-zinc-900 dark:text-zinc-100">{b.quantity}</td>
                                               <td className="px-4 py-2 text-right font-bold text-zinc-900 dark:text-zinc-100">{(b?.price || 0).toLocaleString()} IQD</td>
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

        </div>
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl flex flex-col max-h-[90vh] border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-8 py-6">
              <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                   <Package className="h-5 w-5" />
                 </div>
                 <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Add New Product</h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Barcode</label>
                  <Input 
                    placeholder="Scan or enter barcode" 
                    className="h-12 rounded-xl bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-teal-600" 
                    value={newProduct.barcode}
                    onChange={e => setNewProduct({...newProduct, barcode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Brand Name</label>
                  <Input 
                    placeholder="e.g. Panadol Advance" 
                    className="h-12 rounded-xl bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-teal-600" 
                    value={newProduct.brandName}
                    onChange={e => setNewProduct({...newProduct, brandName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Generic Name</label>
                  <Input 
                    placeholder="e.g. Paracetamol" 
                    className="h-12 rounded-xl bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-teal-600" 
                    value={newProduct.genericName}
                    onChange={e => setNewProduct({...newProduct, genericName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Category</label>
                  <select 
                    className="h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 dark:focus:border-teal-600 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-teal-600 cursor-pointer"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                     <option>Pain Relief</option>
                     <option>Antibiotics</option>
                     <option>Cholesterol</option>
                     <option>Respiratory</option>
                     <option>Gastrointestinal</option>
                     <option>Antihistamine</option>
                     <option>Topical Pain Relief</option>
                  </select>
                </div>

                <div className="col-span-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">Initial Stock (Batch)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Batch Number</label>
                      <Input 
                        placeholder="e.g. B123" 
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                        value={newProduct.initialBatch.batchNo}
                        onChange={e => setNewProduct({...newProduct, initialBatch: {...newProduct.initialBatch, batchNo: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Expiry Date</label>
                    <div className="relative group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-teal-600">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-teal-400 pointer-events-none z-10" />
                        <Input 
                          type="date"
                          className="text-zinc-900 dark:text-zinc-100 pl-10 border-none bg-white dark:bg-zinc-800 h-11 [color-scheme:light] dark:[color-scheme:dark] cursor-pointer focus-visible:ring-0 w-full font-bold"
                          value={newProduct.initialBatch.expiryDate}
                          onChange={e => setNewProduct({...newProduct, initialBatch: {...newProduct.initialBatch, expiryDate: e.target.value}})}
                          onClick={triggerPicker}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Quantity</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                        value={newProduct.initialBatch.quantity}
                        onChange={e => setNewProduct({...newProduct, initialBatch: {...newProduct.initialBatch, quantity: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Sale Price (IQD)</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                        value={newProduct.initialBatch.price}
                        onChange={e => setNewProduct({...newProduct, initialBatch: {...newProduct.initialBatch, price: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex justify-end gap-3">
               <Button variant="outline" className="h-12 font-bold px-8 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
               <Button className="h-12 bg-zinc-900 dark:bg-teal-600 shadow-lg font-bold px-8 text-white" onClick={handleAddProduct}>Save Product</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-8 py-6">
              <div className="flex items-center gap-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <Edit2 className="h-5 w-5" />
                 </div>
                 <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Edit Product</h2>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 dark:bg-zinc-900/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Barcode</label>
                  <Input 
                    value={editFormData.barcode}
                    className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12 rounded-xl"
                    onChange={e => setEditFormData({...editFormData, barcode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Brand Name</label>
                  <Input 
                    value={editFormData.brandName}
                    className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12 rounded-xl"
                    onChange={e => setEditFormData({...editFormData, brandName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Generic Name</label>
                  <Input 
                    value={editFormData.genericName}
                    className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12 rounded-xl"
                    onChange={e => setEditFormData({...editFormData, genericName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Category</label>
                  <select 
                    className="h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 dark:focus:border-teal-600 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-teal-600 cursor-pointer"
                    value={editFormData.category}
                    onChange={e => setEditFormData({...editFormData, category: e.target.value})}
                  >
                     <option>Pain Relief</option>
                     <option>Antibiotics</option>
                     <option>Cholesterol</option>
                     <option>Respiratory</option>
                     <option>Gastrointestinal</option>
                     <option>Antihistamine</option>
                     <option>Topical Pain Relief</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 p-6 flex justify-end gap-3 bg-zinc-50/30 dark:bg-zinc-900 rounded-b-3xl">
               <Button variant="outline" className="h-12 font-bold px-8 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={() => setEditingProduct(null)}>Cancel</Button>
               <Button className="h-12 bg-zinc-900 dark:bg-teal-600 shadow-lg font-bold px-8 text-white" onClick={handleUpdateProduct}>Update Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
