'use client';

import Link from 'next/link';
import { useSessionStore } from '@/stores/session-store';
import { usePathname } from 'next/navigation';
import { Home, History, Plus, Dumbbell } from 'lucide-react';
import { useMainNavStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

export const MainNav: React.FC = () => {
  const { isActive: isSessionActive } = useSessionStore();
  const pathname = usePathname();
  const { navConfig } = useMainNavStore();

  const navItems = useMemo(() => [
    isSessionActive ?
      {
        href: '/session/ongoing',
        label: 'Training',
        icon: Dumbbell,
      } :
      {
        href: '/',
        label: 'Home',
        icon: Home,
      },
    { href: '/history', label: 'History', icon: History },
  ], [isSessionActive]);

  return (
    <nav
      className="z-30 fixed bottom-0 left-0 right-0 flex flex-rows justify-center items-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className=" h-20 flex items-center max-w-md flex-grow transition-all duration-150 ease-in-out p-2">
        <div className="flex justify-around grow-1 rounded-full glass border border-border inset-shadow-sm inset-shadow-white/60 shadow-md p-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col grow-1 items-center justify-center ${isActive ? 'text-primary' : 'text-text-sub'}`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className={`h-20 transition-all duration-150 overflow-hidden ${navConfig.actionButton ? 'p-2' : 'max-w-0 py-2'}`}
      >
        <Button
          variant="fab"
          size="fab"
          onClick={navConfig.actionButton?.onClick}
          disabled={!navConfig.actionButton}
        >
          <Plus size={28} />
        </Button>
      </div>
    </nav>
  );
};
