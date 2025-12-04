import { firebaseAuth } from '@/lib/firebaseConfig';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setInitializing(false);
    });

    return unsub;
  }, []);

  return { user, initializing };
}
