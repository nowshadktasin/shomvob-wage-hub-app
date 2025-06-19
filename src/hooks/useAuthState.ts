
import { useState } from "react";
import { UserData, SessionData } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData: UserData | null) => {
    setUser(userData);
  };

  const updateSession = (sessionData: SessionData | null) => {
    setSession(sessionData);
  };

  const updateUserProfile = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const getAccessToken = (): string | null => {
    return session?.access_token || localStorage.getItem("access_token");
  };

  const resetAuth = () => {
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    loading,
    updateUser,
    updateSession,
    updateUserProfile,
    setLoadingState,
    getAccessToken,
    resetAuth
  };
};
