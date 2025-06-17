
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContextType, UserData, SessionData } from "@/types/auth";
import { mockUser } from "@/constants/auth";
import { 
  getStoredAuthData, 
  storeSessionData, 
  storeUserData, 
  storeUserId, 
  clearAuthStorage, 
  updatePhoneNumber 
} from "@/utils/localStorage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { phoneNumber, accessToken, tokenType, expiresIn, expiresAt, refreshToken } = getStoredAuthData();
    
    if (phoneNumber && accessToken) {
      // Reconstruct user object with phone number and mock data
      const userData: UserData = {
        ...mockUser,
        phone: phoneNumber,
        email: `${phoneNumber}@shomvob.com`,
      };
      setUser(userData);
      
      // Reconstruct session object
      const sessionData: SessionData = {
        access_token: accessToken,
        token_type: tokenType || "bearer",
        expires_in: expiresIn ? parseInt(expiresIn) : 604800,
        expires_at: expiresAt ? parseInt(expiresAt) : 0,
        refresh_token: refreshToken || "",
      };
      setSession(sessionData);
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, otp: string, apiUserData?: any, sessionData?: any): Promise<boolean> => {
    try {
      setLoading(true);
      
      // After successful OTP verification, create user session
      if (phoneNumber && otp.length === 4) {
        let userData: UserData;
        
        if (apiUserData) {
          // Use real user data from API
          userData = {
            id: apiUserData.id || `user-${phoneNumber}`,
            name: apiUserData.name || "User",
            email: apiUserData.email || `${phoneNumber}@shomvob.com`,
            phone: apiUserData.phone || phoneNumber,
            position: apiUserData.position || "Employee",
            department: apiUserData.department || "General",
            joinDate: apiUserData.created_at || new Date().toISOString().split('T')[0],
            avatar: apiUserData.avatar || "",
            isProfileComplete: apiUserData.isProfileComplete || false,
            monthlySalary: apiUserData.monthlySalary || 50000,
            availableAdvancePercentage: apiUserData.availableAdvancePercentage || 60,
            user_role: apiUserData.user_metadata?.user_role || "employee",
          };
        } else {
          // Fallback to mock data structure
          userData = {
            ...mockUser,
            id: `user-${phoneNumber}`,
            phone: phoneNumber,
            email: `${phoneNumber}@shomvob.com`,
          };
        }

        // Handle session data and extract user ID
        let sessionInfo: SessionData | null = null;
        if (sessionData) {
          sessionInfo = {
            access_token: sessionData.access_token,
            token_type: sessionData.token_type,
            expires_in: sessionData.expires_in,
            expires_at: sessionData.expires_at,
            refresh_token: sessionData.refresh_token,
          };
          setSession(sessionInfo);
          
          storeSessionData(sessionData);
          
          // Store only the user ID from session.user object
          if (sessionData.user && sessionData.user.id) {
            storeUserId(sessionData.user.id);
          }
        } else {
          // Store the user ID from userData if no session data
          storeUserId(userData.id);
        }
        
        storeUserData(userData);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSession(null);
    clearAuthStorage();
  };

  const updateUserProfile = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Only update phone number if it's being changed
      if (userData.phone) {
        updatePhoneNumber(userData.phone);
      }
    }
  };

  const getAccessToken = (): string | null => {
    return session?.access_token || localStorage.getItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      login, 
      logout, 
      updateUserProfile, 
      getAccessToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
