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
      <div className="flex h-full items-center justify-center bg-[#F9FAFB] dark:bg-zinc-950">
        <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500">
             <X className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Access Denied</h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">You do not have permission to modify system settings.</p>
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
    <div className="flex h-full flex-col bg-[#F9FAFB] dark:bg-zinc-950">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Configuration & Admin</p>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Store Profile</h2>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Basic details about your pharmacy.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-8">
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Pharmacy Name</label>
                   <Input 
                     value={localSettings.pharmacyName} 
                     onChange={e => setLocalSettings(s => ({...s, pharmacyName: e.target.value}))}
                     className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 font-bold dark:text-zinc-100" 
                   />
                 </div>
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Currency</label>
                   <select 
                     value={localSettings.currency}
                     onChange={e => setLocalSettings(s => ({...s, currency: e.target.value}))}
                     className="h-12 w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 px-4 font-bold text-zinc-900 dark:text-zinc-100 outline-none transition-all focus:border-zinc-900 dark:focus:border-teal-600 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-teal-600"
                   >
                     <option value="IQD">Iraqi Dinar (IQD)</option>
                     <option value="USD">US Dollar (USD)</option>
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Address</label>
                   <Input 
                     value={localSettings.address} 
                     onChange={e => setLocalSettings(s => ({...s, address: e.target.value}))}
                     className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 font-bold dark:text-zinc-100" 
                   />
                 </div>
              </div>
            </div>
          </section>

          {/* Receipt Customization */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Receipt Customization</h2>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Format printed and digital receipts.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-8">
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Footer Message</label>
                   <textarea 
                     className="h-24 w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 p-4 font-medium text-zinc-900 dark:text-zinc-100 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-900 dark:focus:border-teal-600 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-teal-600"
                     value={localSettings.receiptFooter}
                     onChange={e => setLocalSettings(s => ({...s, receiptFooter: e.target.value}))}
                   />
                 </div>
                 <div className="flex items-center justify-between py-2">
                   <div>
                     <p className="font-bold text-zinc-900 dark:text-zinc-100">Print Automatic Receipts</p>
                     <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Automatically trigger thermal printer on checkout.</p>
                   </div>
                     <label className="relative inline-flex cursor-pointer items-center shrink-0">
                     <input 
                       type="checkbox" 
                       className="peer sr-only" 
                       checked={localSettings.printReceipts}
                       onChange={e => setLocalSettings(s => ({...s, printReceipts: e.target.checked}))}
                     />
                     <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-800 peer-checked:bg-zinc-900 dark:peer-checked:bg-teal-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-zinc-600 peer-checked:after:translate-x-[20px] rtl:peer-checked:after:-translate-x-[20px]"></div>
                     </label>
                 </div>
              </div>
            </div>
          </section>

          {/* User Management */}
          <section>
            <div className="mb-6 flex flex-col justify-between md:flex-row md:items-end">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">User Management</h2>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Manage cashiers and roles.</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 font-bold md:mt-0 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800" onClick={() => setIsAddUserModalOpen(true)}>Add New User</Button>
            </div>
            
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">User Details</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Role</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Permissions</th>
                        <th className="px-6 py-4 w-20"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                     {users.map(user => (
                       <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4">
                             <p className="font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                             <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${user.role === 'manager' || user.role === 'admin' ? 'bg-zinc-900 dark:bg-teal-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                               {user.role}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                            {user.role === 'manager' || user.role === 'admin' ? 'All permissions' : 'Basic POS, No Delete'}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteUser(user.id)}>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Preferences</h2>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Theme and display settings.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Dark Mode</p>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Switch to a darker theme for low-light environments.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center shrink-0">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={localSettings.isDarkMode}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setLocalSettings(prev => ({ ...prev, isDarkMode: checked }));
                      updateSettings({ isDarkMode: checked });
                    }}
                  />
                  <div className="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-800 peer-checked:bg-zinc-900 dark:peer-checked:bg-teal-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-zinc-600 peer-checked:after:translate-x-[20px] rtl:peer-checked:after:-translate-x-[20px]"></div>
                </label>
              </div>
            </div>
          </section>

        </div>
      </main>

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
             <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Add New User</h3>
                <button onClick={() => setIsAddUserModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
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
                     className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Email Address</label>
                  <Input 
                     type="email"
                     placeholder="john@example.com"
                     value={newUser.email}
                     onChange={e => setNewUser({...newUser, email: e.target.value})}
                     className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as User['role']})}
                    className="h-12 w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-4 font-bold text-zinc-900 dark:text-zinc-100 outline-none transition-all focus:border-zinc-900 dark:focus:border-teal-600 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-teal-600"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="pt-2">
                  <Button className="w-full h-12 bg-zinc-900 dark:bg-teal-600 font-bold text-white shadow-lg shadow-zinc-900/10 dark:shadow-teal-600/20" onClick={handleAddUser}>Add User</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
