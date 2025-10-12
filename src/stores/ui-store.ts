import { create } from 'zustand';
interface ActionButtonConfig {
  onClick: () => void;
}

interface NavConfig {
  actionButton: ActionButtonConfig | null;
}

interface MainNavState {
  navConfig: NavConfig;
  setNavConfig: (config: Partial<NavConfig>) => void;
  resetNavConfig: () => void;
}

const initialConfig: NavConfig = {
  actionButton: null,
};

export const useMainNavStore = create<MainNavState>((set) => ({
  navConfig: initialConfig,
  setNavConfig: (config) => set((state) => ({ navConfig: { ...state.navConfig, ...config } })),
  resetNavConfig: () => set({ navConfig: initialConfig }),
}));
