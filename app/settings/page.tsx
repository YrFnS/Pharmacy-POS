'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { Save, Store, Users, Receipt, CheckCircle2, UserPlus, X, Trash2 } from 'lucide-react';
import { useStore, User } from '@/lib/store';

export default function SettingsPage() {
  const { settings, updateSettings, users, addUser, updateUser, deleteUser, currentUser } = useStore();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [success, setSuccess] = useState(false);
  
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'cashier' as User['role'] });

  if (currentUser?.role === 'cashier') {
    return (
      <div className="flex h-full items-center justify-center bg-[#F9FAFB]">
        <div className="text-center p-8 bg-white rounded-3xl border border-zinc-200 shadow-xl max-w-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
             <X className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Access Denied</h2>
          <p className="mt-2 text-zinc-500">You do not have permission to modify system settings.</p>
        </div>
      </div>
    );
  }

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    addUser(newUser);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'cashier' });
  };
  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Settings</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Configuration & Admin</p>
        </div>
        <div className="flex gap-3">
           <Button 
             className={`gap-2 rounded-xl font-bold text-white shadow-xl ${success ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-zinc-900 hover:bg-zinc-800 shadow-zinc-900/10'}`}
             onClick={handleSaveSettings}
           >
             {success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
             {success ? 'Saved!' : 'Save All Changes'}
           </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-5xl space-y-12 pb-12">
          
          {/* Store Profile */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Store Profile</h2>
                <p className="text-xs font-semibold text-zinc-500">Basic details about your pharmacy.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-8">
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">Pharmacy Name</label>
                   <Input 
                     value={localSettings.pharmacyName} 
                     onChange={e => setLocalSettings(s => ({...s, pharmacyName: e.target.value}))}
                     className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-bold" 
                   />
                 </div>
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">Currency</label>
                   <select 
                     value={localSettings.currency}
                     onChange={e => setLocalSettings(s => ({...s, currency: e.target.value}))}
                     className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 font-bold text-zinc-900 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                   >
                     <option value="IQD">Iraqi Dinar (IQD)</option>
                     <option value="USD">US Dollar (USD)</option>
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">Address</label>
                   <Input 
                     value={localSettings.address} 
                     onChange={e => setLocalSettings(s => ({...s, address: e.target.value}))}
                     className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-bold" 
                   />
                 </div>
              </div>
            </div>
          </section>

          {/* Receipt Customization */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Receipt Customization</h2>
                <p className="text-xs font-semibold text-zinc-500">Format printed and digital receipts.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-8">
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">Footer Message</label>
                   <textarea 
                     className="h-24 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                     value={localSettings.receiptFooter}
                     onChange={e => setLocalSettings(s => ({...s, receiptFooter: e.target.value}))}
                   />
                 </div>
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-bold text-zinc-900">Print Automatic Receipts</p>
                     <p className="text-sm font-semibold text-zinc-500">Automatically trigger thermal printer on checkout.</p>
                   </div>
                   <label className="relative inline-flex cursor-pointer items-center">
                     <input 
                       type="checkbox" 
                       className="peer sr-only" 
                       checked={localSettings.printReceipts}
                       onChange={e => setLocalSettings(s => ({...s, printReceipts: e.target.checked}))}
                     />
                     <div className="peer h-7 w-14 rounded-full bg-zinc-200 after:absolute after:start-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-zinc-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zinc-900 peer-focus:ring-offset-2"></div>
                   </label>
                 </div>
              </div>
            </div>
          </section>

          {/* User Management */}
          <section>
            <div className="mb-6 flex flex-col justify-between md:flex-row md:items-end">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">User Management</h2>
                  <p className="text-xs font-semibold text-zinc-500">Manage cashiers and roles.</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 font-bold md:mt-0" onClick={() => setIsAddUserModalOpen(true)}>Add New User</Button>
            </div>
            
            <div className="rounded-3xl border border-zinc-200/50 bg-white shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50/50 border-b border-zinc-100">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">User Details</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Role</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Permissions</th>
                        <th className="px-6 py-4 w-20"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                     {users.map(user => (
                       <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-zinc-900">{user.name}</p>
                             <p className="text-xs font-semibold text-zinc-500">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${user.role === 'manager' || user.role === 'admin' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                               {user.role}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-zinc-500">
                            {user.role === 'manager' || user.role === 'admin' ? 'All permissions' : 'Basic POS, No Delete'}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteUser(user.id)}>
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>

          {/* Preferences */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Preferences</h2>
                <p className="text-xs font-semibold text-zinc-500">Theme and display settings.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-900">Dark Mode</p>
                  <p className="text-sm font-semibold text-zinc-500">Switch to a darker theme for low-light environments.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={localSettings.isDarkMode}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, isDarkMode: e.target.checked }))}
                  />
                  <div className="peer h-7 w-14 rounded-full bg-zinc-200 after:absolute after:start-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-zinc-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zinc-900 peer-focus:ring-offset-2"></div>
                </label>
              </div>
            </div>
          </section>

        </div>
      </main>

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h3 className="font-bold text-zinc-900">Add New User</h3>
                <button onClick={() => setIsAddUserModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-5 w-5" />
                </button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Full Name</label>
                  <Input 
                     autoFocus
                     placeholder="John Doe"
                     value={newUser.name}
                     onChange={e => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Email Address</label>
                  <Input 
                     type="email"
                     placeholder="john@example.com"
                     value={newUser.email}
                     onChange={e => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as User['role']})}
                    className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 font-bold text-zinc-900 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="pt-2">
                  <Button className="w-full h-12 bg-zinc-900 font-bold" onClick={handleAddUser}>Add User</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
