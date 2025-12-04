import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type AppNotification = { id: string; title: string; subtitle?: string; read?: boolean };

type AppContextType = {
  notifications: AppNotification[];
  addNotification: (n: AppNotification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  location: string;
  setLocation: (loc: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children?: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [location, setLocation] = useState<string>('Hyderabad');

  const addNotification = (n: AppNotification) => setNotifications((s) => [n, ...s]);
  const removeNotification = (id: string) => setNotifications((s) => s.filter((x) => x.id !== id));
  const clearNotifications = () => setNotifications([]);

  const value = useMemo(() => ({ notifications, addNotification, removeNotification, clearNotifications, location, setLocation }), [notifications, location]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
