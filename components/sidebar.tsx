'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  Clock,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useStore } from '@/lib/store';

import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  const { t, isRtl } = useTranslation();
  const { setIsShiftOpen, clearCart } = useStore();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Current shift data will remain, but cart will be cleared.')) {
      clearCart();
      setIsShiftOpen(false);
      window.location.reload(); // Simple way to "logout" in this app
    }
  };

  const links = [
    { href: '/', icon: ShoppingCart, label: 'POS' },
    { href: '/inventory', icon: Package, label: 'Inventory' },
    { href: '/procurement', icon: Clock, label: 'Procurement' },
    { href: '/customers', icon: Users, label: 'Customers' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="flex flex-col items-center py-6 w-20 bg-white border-e border-zinc-200/50 shadow-sm z-50 shrink-0">
      {/* Brand logo space */}
      <div className="mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
          <Package className="h-5 w-5" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                isActive 
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10" 
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
            </Link>
          );
        })}
      </nav>
      
      {/* User profile / Logout space down here */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <button 
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>

        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-200">
           <Image 
             src="https://picsum.photos/seed/doctor/100/100" 
             alt="Doctor profile" 
             fill
             className="object-cover" 
             referrerPolicy="no-referrer"
           />
        </div>
      </div>
    </aside>
  );
}
