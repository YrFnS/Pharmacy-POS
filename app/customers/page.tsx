'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { Search, User, Receipt, CreditCard, CheckCircle2, UserPlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
  const { customers, products, updateCustomer, addCustomer, settleDebt, transactions, deleteCustomer, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [editCustomerForm, setEditCustomerForm] = useState({ id: '', name: '', phone: '', debt: 0 });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isManager = currentUser?.role === 'manager';

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    addCustomer(newCustomer);
    setIsAddModalOpen(false);
    setNewCustomer({ name: '', phone: '' });
  };

  const handleOpenEdit = () => {
    if (!selectedCustomer) return;
    setEditCustomerForm(selectedCustomer);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    updateCustomer(editCustomerForm);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      deleteCustomer(id);
      if (selectedCustomerId === id) setSelectedCustomerId(null);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const [expandedTransactions, setExpandedTransactions] = useState<Record<string, boolean>>({});

  const toggleTransaction = (id: string) => {
    setExpandedTransactions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const customerTransactions = selectedCustomer 
    ? transactions.filter(t => t.customerId === selectedCustomer.id).sort((a,b) => b.timestamp - a.timestamp)
    : [];
    
  const displayTransactions = showAllTransactions ? customerTransactions : customerTransactions.slice(0, 5);

  const getTransactionItemDetails = (items: any[]) => {
    return items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return { ...item, brandName: p?.brandName || 'Unknown Product' };
    });
  };

  return (
    <div className="flex h-full bg-[#F9FAFB] dark:bg-zinc-950">
      {/* Left side: List */}
      <div className="flex w-1/3 flex-col border-e border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm z-10 shrink-0">
        <div className="border-b border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Customers</h1>
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </Button>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">Directory & Accounts</p>
          
          <div className="relative">
            <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <Input 
              className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 ps-12 font-medium text-zinc-900 dark:text-zinc-100"
              placeholder="Search name or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredCustomers.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className={`flex w-full items-center justify-between rounded-xl p-4 text-left transition-all cursor-pointer ${
                  selectedCustomerId === c.id 
                    ? 'bg-zinc-900 dark:bg-teal-600 text-white shadow-md shadow-zinc-900/10' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                     selectedCustomerId === c.id ? 'bg-white/20' : 'bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className={cn("font-bold truncate", selectedCustomerId === c.id ? "text-white" : "text-zinc-900 dark:text-zinc-100")}>{c.name}</div>
                    <div className={`text-xs font-semibold ${selectedCustomerId === c.id ? 'text-zinc-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {isManager ? (c.phone || 'No phone number') : (c.phone ? '********' : 'No phone number')}
                  </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {c.debt > 0 && (
                    <div className={`text-right ${selectedCustomerId === c.id ? 'text-amber-400' : 'text-amber-600'}`}>
                      <div className="text-[10px] font-bold uppercase tracking-widest">Debt</div>
                      <div className="font-black">{c.debt.toLocaleString()}</div>
                    </div>
                  )}
                  {c.id !== 'c1' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-6 px-2 text-[10px] font-bold ${deleteConfirmId === c.id ? 'bg-red-500 text-white hover:bg-red-600' : 'text-red-500 hover:bg-red-50'}`}
                      onClick={(e) => handleDeleteClick(e, c.id)}
                    >
                      {deleteConfirmId === c.id ? 'Confirm?' : 'Delete'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Profile view */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFB] dark:bg-zinc-950">
        {selectedCustomer ? (
          <>
            <header className="flex shrink-0 items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 p-8 backdrop-blur-xl">
               <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{selectedCustomer.name}</h2>
                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">{isManager ? (selectedCustomer.phone || 'Walk-in Customer') : (selectedCustomer.phone ? '********' : 'Walk-in Customer')}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  {isManager && (
                    <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-100" onClick={handleOpenEdit}>
                      Edit Profile
                    </Button>
                  )}
               </div>
            </header>

            <main className="flex-1 overflow-auto p-8">
              <div className="mx-auto max-w-4xl space-y-8">
                
                {/* Debt Tracker */}
                <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
                   <div className="flex items-start justify-between">
                     <div>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Account Balance</h3>
                       <div className="mt-2 flex items-baseline gap-2">
                         <span className="text-5xl font-black text-zinc-900 dark:text-zinc-100">{selectedCustomer.debt.toLocaleString()}</span>
                         <span className="text-lg font-bold text-zinc-400 dark:text-zinc-500">IQD</span>
                       </div>
                       {selectedCustomer.debt > 0 ? (
                         <p className="mt-2 text-sm font-bold text-amber-600">Pending Debt</p>
                       ) : (
                         <p className="mt-2 text-sm font-bold text-emerald-600 flex items-center gap-1">
                           <CheckCircle2 className="h-4 w-4" /> Clear Balance
                         </p>
                       )}
                     </div>
                     {selectedCustomer.debt > 0 && (
                       <Button 
                          size="lg" 
                          className="h-14 rounded-2xl bg-zinc-900 px-8 text-base font-bold text-white shadow-xl shadow-zinc-900/10 hover:bg-zinc-800"
                          onClick={() => settleDebt(selectedCustomer.id, selectedCustomer.debt)}
                        >
                         <CreditCard className="mr-2 h-5 w-5" />
                         Settle Debt
                       </Button>
                     )}
                   </div>
                </div>

                {/* Purchase History */}
                <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                   <div className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 p-6 flex justify-between items-center">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Purchase History</h3>
                     {customerTransactions.length > 5 && (
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="font-bold dark:text-zinc-300"
                         onClick={() => setShowAllTransactions(!showAllTransactions)}
                       >
                         {showAllTransactions ? 'Show Less' : 'View All'}
                       </Button>
                     )}
                   </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 p-0">
                     {displayTransactions.map(rec => {
                        const isExpanded = expandedTransactions[rec.id];
                        const itemDetails = getTransactionItemDetails(rec.items);
                        return (
                          <div key={rec.id} className={cn("transition-colors", isExpanded ? "bg-zinc-50 dark:bg-zinc-800/50" : "hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30")}>
                            <div 
                              className={cn("flex items-center justify-between p-6 cursor-pointer", rec.total < 0 && "bg-red-50/20 dark:bg-red-950/10")}
                              onClick={() => toggleTransaction(rec.id)}
                            >
                               <div className="flex items-center gap-4">
                                 <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", rec.total < 0 ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400")}>
                                   <Receipt className="h-6 w-6" />
                                 </div>
                                 <div className="flex-1">
                                   <p className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                                     {rec.id} 
                                     {rec.total < 0 && <span className="ml-2 text-[10px] bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">RETURN</span>}
                                   </p>
                                   <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{new Date(rec.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                 </div>
                               </div>
                               <div className="text-right flex items-center gap-6">
                                  <div className="mr-8">
                                    <p className={cn("text-xl font-black", rec.total < 0 ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100")}>
                                      {rec.total.toLocaleString()} IQD
                                    </p>
                                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${rec.total < 0 ? 'text-red-500 dark:text-red-400' : (rec.paymentMethod !== 'tab' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}`}>
                                      {rec.paymentMethod.toUpperCase()}
                                    </p>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-100" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.print();
                                    }}
                                  >
                                    Print
                                  </Button>
                               </div>
                            </div>
                            {isExpanded && (
                              <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest">
                                        <th className="pb-2 text-left">Item</th>
                                        <th className="pb-2 text-center">Qty</th>
                                        <th className="pb-2 text-right">Price</th>
                                        <th className="pb-2 text-right">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                      {itemDetails.map((item, idx) => (
                                        <tr key={idx}>
                                          <td className="py-2 font-bold text-zinc-900 dark:text-zinc-100">{item.brandName}</td>
                                          <td className="py-2 text-center font-bold text-zinc-500 dark:text-zinc-400">{item.quantity}</td>
                                          <td className="py-2 text-right font-medium text-zinc-500 dark:text-zinc-400">{item.price.toLocaleString()}</td>
                                          <td className="py-2 text-right font-bold text-zinc-900 dark:text-zinc-100">{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                     {customerTransactions.length === 0 && (
                       <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 font-semibold">
                         No purchase history available.
                       </div>
                     )}
                   </div>
                </div>

              </div>
            </main>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200/50 text-zinc-400">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-zinc-500">Select a Customer</h2>
              <p className="text-sm text-zinc-400 mt-2">View details, account balance, and history.</p>
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
             <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Add New Customer</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="h-5 w-5" />
                </button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 block">Full Name</label>
                  <Input 
                     autoFocus
                     placeholder="Customer Name"
                     value={newCustomer.name}
                     onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                     className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 block">Phone Number</label>
                  <Input 
                     placeholder="e.g. 0770..."
                     value={newCustomer.phone}
                     onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                     className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
                <Button className="w-full h-12 bg-zinc-900 dark:bg-teal-600 font-bold text-white shadow-lg shadow-zinc-900/10 dark:shadow-teal-600/20" onClick={handleAddCustomer}>Add Customer</Button>
             </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
             <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Edit Customer</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="h-5 w-5" />
                </button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 block">Full Name</label>
                  <Input 
                     autoFocus
                     placeholder="Customer Name"
                     value={editCustomerForm.name}
                     onChange={e => setEditCustomerForm({...editCustomerForm, name: e.target.value})}
                     className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 block">Phone Number</label>
                  <Input 
                     placeholder="e.g. 0770..."
                     value={editCustomerForm.phone}
                     onChange={e => setEditCustomerForm({...editCustomerForm, phone: e.target.value})}
                     className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
                <Button className="w-full h-12 bg-zinc-900 dark:bg-teal-600 font-bold text-white shadow-lg shadow-zinc-900/10 dark:shadow-teal-600/20" onClick={handleSaveEdit}>Save Changes</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
