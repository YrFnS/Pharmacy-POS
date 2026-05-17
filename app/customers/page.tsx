'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button, Input } from '@/components/ui';
import { Search, User, Receipt, CreditCard, CheckCircle2, UserPlus, X } from 'lucide-react';

export default function CustomersPage() {
  const { customers, updateCustomer, addCustomer, settleDebt } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    addCustomer(newCustomer);
    setIsAddModalOpen(false);
    setNewCustomer({ name: '', phone: '' });
  };

  const { transactions, products } = useStore();
  const customerTransactions = transactions.filter(t => t.customerId === selectedCustomerId);

  const purchaseHistory = customerTransactions.map(t => ({
    id: t.id,
    date: new Date(t.timestamp).toLocaleDateString(),
    total: t.total,
    paid: t.paymentMethod !== 'tab'
  }));

  return (
    <div className="flex h-full bg-[#F9FAFB]">
      {/* Left side: List */}
      <div className="flex w-1/3 flex-col border-e border-zinc-200/50 bg-white shadow-sm z-10 shrink-0">
        <div className="border-b border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Customers</h1>
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-zinc-100" onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-5 w-5 text-zinc-600" />
            </Button>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">Directory & Accounts</p>
          
          <div className="relative">
            <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <Input 
              className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 ps-12 font-medium"
              placeholder="Search name or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredCustomers.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className={`flex w-full items-center justify-between rounded-xl p-4 text-left transition-all ${
                  selectedCustomerId === c.id 
                    ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/10' 
                    : 'hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                     selectedCustomerId === c.id ? 'bg-white/20' : 'bg-zinc-200/50 text-zinc-500'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className={`text-xs font-semibold ${selectedCustomerId === c.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {c.phone || 'No phone number'}
                    </div>
                  </div>
                </div>
                {c.debt > 0 && (
                  <div className={`text-right ${selectedCustomerId === c.id ? 'text-amber-400' : 'text-amber-600'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-widest">Debt</div>
                    <div className="font-black">{c.debt.toLocaleString()}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Profile view */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFB]">
        {selectedCustomer ? (
          <>
            <header className="flex shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 p-8 backdrop-blur-xl">
               <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900">{selectedCustomer.name}</h2>
                    <p className="text-sm font-bold text-zinc-500 mt-1">{selectedCustomer.phone || 'Walk-in Customer'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-xl font-bold">Edit Profile</Button>
               </div>
            </header>

            <main className="flex-1 overflow-auto p-8">
              <div className="mx-auto max-w-4xl space-y-8">
                
                {/* Debt Tracker */}
                <div className="rounded-3xl border border-zinc-200/50 bg-white p-8 shadow-sm">
                   <div className="flex items-start justify-between">
                     <div>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Account Balance</h3>
                       <div className="mt-2 flex items-baseline gap-2">
                         <span className="text-5xl font-black text-zinc-900">{selectedCustomer.debt.toLocaleString()}</span>
                         <span className="text-lg font-bold text-zinc-400">IQD</span>
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
                <div className="rounded-3xl border border-zinc-200/50 bg-white shadow-sm overflow-hidden">
                   <div className="border-b border-zinc-100 bg-zinc-50/50 p-6 flex justify-between items-center">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Purchase History</h3>
                     <Button variant="ghost" size="sm" className="font-bold">View All</Button>
                   </div>
                   <div className="divide-y divide-zinc-100 p-0">
                     {purchaseHistory.length === 0 ? (
                       <div className="p-8 text-center text-zinc-400">
                         <p className="text-sm font-bold italic">No purchase history found for this customer.</p>
                       </div>
                     ) : (
                       purchaseHistory.map(rec => (
                         <div key={rec.id} className="flex items-center justify-between p-6 hover:bg-zinc-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                                <Receipt className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900"># {rec.id}</p>
                                <p className="text-xs font-semibold text-zinc-500">{rec.date}</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                               <div>
                                 <p className="text-xl font-black text-zinc-900">{rec.total.toLocaleString()} IQD</p>
                                 <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${rec.paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                                   {rec.paid ? 'Paid' : 'Unpaid'}
                                 </p>
                               </div>
                               <Button variant="outline" className="rounded-xl border-zinc-200 font-bold hover:bg-zinc-100">
                                 Receipt
                               </Button>
                            </div>
                         </div>
                       ))
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
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h3 className="font-bold text-zinc-900">Add New Customer</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-5 w-5" />
                </button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Full Name</label>
                  <Input 
                     autoFocus
                     placeholder="Customer Name"
                     value={newCustomer.name}
                     onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Phone Number</label>
                  <Input 
                     placeholder="e.g. 0770..."
                     value={newCustomer.phone}
                     onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
                <Button className="w-full h-12 bg-zinc-900 font-bold" onClick={handleAddCustomer}>Add Customer</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
