
import React, { createContext, useState, useContext, useEffect } from "react";

// Mock user data
export interface UserData {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  avatar: string;
  isProfileComplete: boolean;
  monthlySalary: number;
  availableAdvancePercentage: number;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<boolean>;
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
  position: "Software Engineer",
  department: "Engineering",
  joinDate: "2022-01-15",
  avatar: "",
  isProfileComplete: false,
  monthlySalary: 50000, // Monthly salary in BDT
  availableAdvancePercentage: 60, // 60% of salary available for advance
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading the user from storage on initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("shomvob_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, otp: string): Promise<boolean> => {
    // In a real app, this would verify credentials with a server
    try {
      setLoading(true);
      // Mock validation - accept any phone number with correct OTP
      if (phoneNumber && otp.length === 4) {
        // Create a user based on phone number
        const phoneBasedUser = {
          ...mockUser,
          id: `user-${phoneNumber}`,
          email: `${phoneNumber}@shomvob.com`,
        };
        
        setUser(phoneBasedUser);
        localStorage.setItem("shomvob_user", JSON.stringify(phoneBasedUser));
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
