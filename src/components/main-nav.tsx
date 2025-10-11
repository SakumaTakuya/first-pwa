'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History } from 'lucide-react';

interface MainNavProps {
  actionButton?: React.ReactNode;
}

const navItems = [
  { href: '/session/ongoing', label: 'Home', icon: Home },
  { href: '/history', label: 'History', icon: History },
];

export const MainNav: React.FC<MainNavProps> = ({ actionButton }) => {
  const pathname = usePathname();

  return (
    <nav
      className="z-30 fixed bottom-0 left-0 right-0 flex flex-rows gap-x-4 justify-around items-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="bg-surface/80 backdrop-blur-lg flex items-center max-w-md h-20 border rounded-full flex-grow transition-all duration-300 ease-in-out">
        <div className="flex gap-x-10 justify-around grow-1">
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

      {actionButton && (
        <div>
          {actionButton}
        </div>
      )}
    </nav>
  );
};
