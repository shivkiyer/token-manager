'use client';

import { useState, createContext } from 'react';

import { createSession, getSession, deleteSession } from '@/actions/auth/session';

interface AuthContextType {
  token: null | string;
  setToken: (token: string) => void;
  getToken: () => string | null;
  deleteToken: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: (token: string) => {},
  getToken: (): string | null => null,
  deleteToken: () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const getAuthToken = () => {
    return jwtToken;
  }

  const setAuthToken = async (token: string) => {
    await createSession(token);
    setJwtToken(token);
  };

  const deleteAuthToken = async () => {
    await deleteSession();
    setJwtToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: jwtToken,
        setToken: setAuthToken,
        getToken: getAuthToken,
        deleteToken: deleteAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
