'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Plus } from 'lucide-react';
import { useMainNavStore } from '@/stores/ui-store';

const navItems = [
  { href: '/session/ongoing', label: 'Home', icon: Home },
  { href: '/history', label: 'History', icon: History },
];

export const MainNav: React.FC = () => {
  const pathname = usePathname();
  const { navConfig } = useMainNavStore();

  return (
    <nav
      className="z-30 fixed bottom-0 left-0 right-0 flex flex-rows gap-x-2 justify-center items-center m-2"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="bg-surface/80 backdrop-blur-lg flex items-center max-w-md h-16 border rounded-full flex-grow transition-all duration-300 ease-in-out">
        <div className="flex justify-around grow-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center ${isActive ? 'text-accent' : 'text-text-sub'}`}>
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className={`transition-all duration-150 overflow-hidden ${navConfig.actionButton ? 'max-w-16 ml-auto' : 'max-w-0 ml-0'
          }`}
      >
        <button
          onClick={navConfig.actionButton?.onClick}
          disabled={!navConfig.actionButton}
          className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        >
          <Plus size={28} />
        </button>
      </div>
    </nav>
  );
};
