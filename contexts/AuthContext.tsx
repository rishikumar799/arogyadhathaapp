import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';
import * as userService from '@/lib/userService';
import type { User as FirebaseUser } from 'firebase/auth';

type SignInFn = (email: string, password: string) => Promise<any>;
type SignUpFn = (payload: any) => Promise<any>;

type AuthContextType = {
  user: FirebaseUser | null;
  initializing: boolean;
  signIn: SignInFn;
  signUp: SignUpFn;
  signOut: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children?: ReactNode }) {
  const { user, initializing } = useAuth();

  const value = useMemo<AuthContextType>(() => {
    return {
      user,
      initializing,
      signIn: userService.signInUser,
      signUp: userService.signUpUser,
      signOut: userService.signOut,
    };
  }, [user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
  return ctx;
}
