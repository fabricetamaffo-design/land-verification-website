import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import type { Route } from './types';

interface NavigationContextValue {
  route: Route;
  stack: Route[];
  navigate: (route: Route) => void;
  replace: (route: Route) => void;
  goBack: () => void;
  reset: (route: Route) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'Home' }]);
  const route = stack[stack.length - 1];

  const value = useMemo<NavigationContextValue>(() => ({
    route,
    stack,
    navigate: (next) => setStack((current) => [...current, next]),
    replace: (next) => setStack((current) => [...current.slice(0, -1), next]),
    goBack: () => setStack((current) => current.length > 1 ? current.slice(0, -1) : current),
    reset: (next) => setStack([next]),
  }), [route, stack]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider');
  return ctx;
}
