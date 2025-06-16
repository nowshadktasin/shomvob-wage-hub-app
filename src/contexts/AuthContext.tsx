
import React, { createContext, useState, useContext, useEffect } from "react";

// User data interface updated to match API response
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  avatar: string;
  isProfileComplete: boolean;
  monthlySalary: number;
  availableAdvancePercentage: number;
  user_role?: string;
}

// Session data interface
export interface SessionData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
}

interface AuthContextType {
  user: UserData | null;
  session: SessionData | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string, apiUserData?: any, sessionData?: any) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<UserData>) => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const mockUser: UserData = {
  id: "user-1234",
  name: "John Doe",
  email: "john.doe@shomvob.com",
  phone: "",
  position: "Software Engineer",
  department: "Engineering",
  joinDate: "2022-01-15",
  avatar: "",
  isProfileComplete: false,
  monthlySalary: 50000,
  availableAdvancePercentage: 60,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read individual keys from localStorage
    const phoneNumber = localStorage.getItem("phoneNumber");
    const accessToken = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type");
    const expiresIn = localStorage.getItem("expires_in");
    const expiresAt = localStorage.getItem("expires_at");
    const refreshToken = localStorage.getItem("refresh_token");
    
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
          
          // Store session data as individual key-value pairs
          localStorage.setItem("access_token", sessionData.access_token);
          localStorage.setItem("token_type", sessionData.token_type);
          localStorage.setItem("expires_in", sessionData.expires_in.toString());
          localStorage.setItem("expires_at", sessionData.expires_at.toString());
          localStorage.setItem("refresh_token", sessionData.refresh_token);
          
          // Store only the user ID from session.user object
          if (sessionData.user && sessionData.user.id) {
            localStorage.setItem("userId", sessionData.user.id);
          }
        } else {
          // Store the user ID from userData if no session data
          localStorage.setItem("userId", userData.id);
        }
        
        // Store only the phone number as separate key-value pair
        localStorage.setItem("phoneNumber", userData.phone);
        
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
    // Remove all individual keys
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("userId");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_token");
  };

  const updateUserProfile = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Only update phone number if it's being changed
      if (userData.phone) {
        localStorage.setItem("phoneNumber", userData.phone);
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
