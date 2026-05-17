'use client';

import React from 'react';
import { Button, Input } from '@/components/ui';
import { Save, Store, Users, Receipt, Link as LinkIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col bg-[#F9FAFB]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-8 backdrop-blur-xl">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Settings</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Configuration & Admin</p>
        </div>
        <div className="flex gap-3">
           <Button className="gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-white shadow-xl shadow-zinc-900/10">
             <Save className="h-4 w-4" />
             Save All Changes
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
                   <Input defaultValue="Al-Shifa Pharmacy" className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-bold" />
                 </div>
                 <div>
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">Currency</label>
                   <select className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 font-bold text-zinc-900 outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900">
                     <option value="IQD">Iraqi Dinar (IQD)</option>
                     <option value="USD">US Dollar (USD)</option>
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-400">Address</label>
                   <Input defaultValue="Baghdad, Mansour Dist, 14th St" className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 font-bold" />
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
                     defaultValue="Thank you for your visit. No refunds on open medicine."
                   />
                 </div>
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-bold text-zinc-900">Print Automatic Receipts</p>
                     <p className="text-sm font-semibold text-zinc-500">Automatically trigger thermal printer on checkout.</p>
                   </div>
                   <label className="relative inline-flex cursor-pointer items-center">
                     <input type="checkbox" className="peer sr-only" defaultChecked />
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
              <Button variant="outline" className="mt-4 font-bold md:mt-0">Add New User</Button>
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
                     <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-zinc-900">Dr. Ahmed</p>
                           <p className="text-xs font-semibold text-zinc-500">ahmed@alshifa.com</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex rounded-md bg-zinc-900 px-2 py-1 text-xs font-bold text-white">Manager</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-zinc-500">All permissions</td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="font-bold underline">Edit</Button>
                        </td>
                     </tr>
                     <tr className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-zinc-900">Ali Cashier</p>
                           <p className="text-xs font-semibold text-zinc-500">ali@alshifa.com</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">Cashier</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-zinc-500">Basic POS, No Delete</td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="font-bold underline">Edit</Button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
