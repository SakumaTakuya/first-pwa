'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History } from 'lucide-react'; // Using lucide-react as per GEMINI.md

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/history', label: 'History', icon: History },
];

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-16 z-40">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
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
