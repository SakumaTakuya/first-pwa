import { create } from 'zustand';
interface ActionButtonConfig {
  onClick: () => void;
}

interface NavConfig {
  actionButton: ActionButtonConfig | null;
}

interface UiState {
  navConfig: NavConfig;
  setNavConfig: (config: Partial<NavConfig>) => void;
  resetNavConfig: () => void;
}

const initialConfig: NavConfig = {
  actionButton: null,
};

export const useUiStore = create<UiState>((set) => ({
  navConfig: initialConfig,
  setNavConfig: (config) => set((state) => ({ navConfig: { ...state.navConfig, ...config } })),
  resetNavConfig: () => set({ navConfig: initialConfig }),
}));
