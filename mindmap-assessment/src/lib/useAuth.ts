import { useState, useEffect, useCallback } from 'react';
import { authClient } from './authClient';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await authClient.getSession();
    if (result.data?.session && result.data?.user) {
      setSession(result.data.session);
      setUser(result.data.user);
    } else {
      setSession(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signUp = async (name: string, email: string, password: string) => {
    const result = await authClient.signUp.email({ name, email, password });
    if (result.error) throw new Error(result.error.message);
    await refresh();
  };

  const signIn = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) throw new Error(result.error.message);
    await refresh();
  };

  const signOut = async () => {
    await authClient.signOut();
    setSession(null);
    setUser(null);
  };

  // IMPORTANT — verify this field name yourself (see note below).
  const getAccessToken = () => session?.token ?? session?.session?.token ?? null;

  return { session, user, loading, signUp, signIn, signOut, getAccessToken };
}