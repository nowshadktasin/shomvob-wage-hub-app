
import React, { createContext, useContext, useEffect } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthStorage } from "@/hooks/useAuthStorage";
import { 
  createFallbackUserData, 
  createSessionData, 
  loadUserProfile, 
  reconstructSessionFromStorage 
} from "@/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    loading,
    updateUser,
    updateSession,
    updateUserProfile,
    setLoadingState,
    getAccessToken,
    resetAuth
  } = useAuthState();

  const {
    loadStoredAuthData,
    saveSessionData,
    saveUserData,
    updateUserData,
    clearStorage
  } = useAuthStorage();

  useEffect(() => {
    const { phoneNumber, accessToken, tokenType, expiresIn, expiresAt, refreshToken, employeeId } = loadStoredAuthData();
    
    if (phoneNumber && accessToken) {
      // Reconstruct session object
      const sessionData = reconstructSessionFromStorage(accessToken, tokenType, expiresIn, expiresAt, refreshToken);
      updateSession(sessionData);

      // Fetch real profile data from API
      loadUserProfile(phoneNumber, accessToken)
        .then((profileData) => {
          updateUser(profileData);
          saveUserData(profileData);
          console.log('Profile data loaded:', profileData);
        })
        .catch((error) => {
          console.error('Failed to fetch profile data, using fallback data:', error);
          // Fallback to basic user data if API fails
          const userData = createFallbackUserData(phoneNumber, employeeId);
          updateUser(userData);
        })
        .finally(() => {
          setLoadingState(false);
        });
    } else {
      setLoadingState(false);
    }
  }, []);

  const login = async (phoneNumber: string, otp: string, apiUserData?: any, sessionData?: any): Promise<boolean> => {
    try {
      setLoadingState(true);
      
      // After successful OTP verification, create user session
      if (phoneNumber && otp.length === 4) {
        // Handle session data
        if (sessionData) {
          const sessionInfo = createSessionData(sessionData);
          updateSession(sessionInfo);
          saveSessionData(sessionData);

          // Fetch real profile data using the access token
          try {
            const profileData = await loadUserProfile(phoneNumber, sessionData.access_token);
            updateUser(profileData);
            saveUserData(profileData);
            console.log('Profile data fetched during login:', profileData);
          } catch (error) {
            console.error('Failed to fetch profile data during login:', error);
            // Fallback to basic user data structure
            const userData = createFallbackUserData(phoneNumber);
            updateUser(userData);
            saveUserData(userData);
          }
        } else {
          // Fallback when no session data
          const userData = createFallbackUserData(phoneNumber);
          updateUser(userData);
          saveUserData(userData);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const logout = () => {
    resetAuth();
    clearStorage();
  };

  const handleUpdateUserProfile = (userData: Partial<UserData>) => {
    updateUserProfile(userData);
    updateUserData(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      login, 
      logout, 
      updateUserProfile: handleUpdateUserProfile, 
      getAccessToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
