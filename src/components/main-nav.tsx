'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History } from 'lucide-react'; // Using lucide-react as per GEMINI.md

const navItems = [
  { href: '/session/ongoing', label: 'Home', icon: Home },
  { href: '/history', label: 'History', icon: History },
];

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <nav 
      className="bg-surface border-t border-border z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-accent' : 'text-text-sub'}`}>
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
