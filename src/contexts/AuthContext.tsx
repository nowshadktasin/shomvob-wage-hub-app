
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

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string, apiUserData?: any) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<UserData>) => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("shomvob_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, otp: string, apiUserData?: any): Promise<boolean> => {
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
        
        setUser(userData);
        localStorage.setItem("shomvob_user", JSON.stringify(userData));
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
    localStorage.removeItem("shomvob_user");
  };

  const updateUserProfile = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("shomvob_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
