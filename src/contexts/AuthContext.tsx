import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContextType, UserData, SessionData } from "@/types/auth";
import { fetchEmployeeProfile } from "@/services/employeeApi";
import { 
  getStoredAuthData, 
  storeSessionData, 
  storeUserData, 
  storeUserId, 
  storeEmployeeId,
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
    const { phoneNumber, accessToken, tokenType, expiresIn, expiresAt, refreshToken, employeeId } = getStoredAuthData();
    
    if (phoneNumber && accessToken) {
      // Reconstruct session object
      const sessionData: SessionData = {
        access_token: accessToken,
        token_type: tokenType || "bearer",
        expires_in: expiresIn ? parseInt(expiresIn) : 604800,
        expires_at: expiresAt ? parseInt(expiresAt) : 0,
        refresh_token: refreshToken || "",
      };
      setSession(sessionData);

      // Fetch real profile data from API
      fetchEmployeeProfile(phoneNumber, accessToken)
        .then((profileData) => {
          setUser(profileData);
          // Store the employee ID from the API response
          if (profileData.id) {
            storeEmployeeId(profileData.id);
          }
          console.log('Profile data loaded:', profileData);
        })
        .catch((error) => {
          console.error('Failed to fetch profile data, using fallback data:', error);
          // Fallback to basic user data if API fails
          const userData: UserData = {
            id: employeeId || `user-${phoneNumber}`,
            full_name: "User",
            email: `${phoneNumber}@shomvob.com`,
            contact_number: phoneNumber,
            designation: "Employee",
            department: "General",
            joining_date: new Date().toISOString().split('T')[0],
            company_name: "Emission Softwares",
            gross_salary: 50000,
            present_address: "",
            permanent_address: "",
            gender: "Male",
            avatar: "",
            isProfileComplete: false,
            availableAdvancePercentage: 60,
            user_role: "employee",
          };
          setUser(userData);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phoneNumber: string, otp: string, apiUserData?: any, sessionData?: any): Promise<boolean> => {
    try {
      setLoading(true);
      
      // After successful OTP verification, create user session
      if (phoneNumber && otp.length === 4) {
        // Handle session data
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

          // Fetch real profile data using the access token
          try {
            const profileData = await fetchEmployeeProfile(phoneNumber, sessionData.access_token);
            setUser(profileData);
            storeUserData(profileData);
            // Store the employee ID from the API response
            if (profileData.id) {
              storeEmployeeId(profileData.id);
            }
            console.log('Profile data fetched during login:', profileData);
          } catch (error) {
            console.error('Failed to fetch profile data during login:', error);
            // Fallback to basic user data structure
            const userData: UserData = {
              id: `user-${phoneNumber}`,
              full_name: "User",
              email: `${phoneNumber}@shomvob.com`,
              contact_number: phoneNumber,
              designation: "Employee",
              department: "General",
              joining_date: new Date().toISOString().split('T')[0],
              company_name: "Emission Softwares",
              gross_salary: 50000,
              present_address: "",
              permanent_address: "",
              gender: "Male",
              avatar: "",
              isProfileComplete: false,
              availableAdvancePercentage: 60,
              user_role: "employee",
            };
            setUser(userData);
            storeUserData(userData);
          }
        } else {
          // Fallback when no session data
          const userData: UserData = {
            id: `user-${phoneNumber}`,
            full_name: "User",
            email: `${phoneNumber}@shomvob.com`,
            contact_number: phoneNumber,
            designation: "Employee",
            department: "General",
            joining_date: new Date().toISOString().split('T')[0],
            company_name: "Emission Softwares",
            gross_salary: 50000,
            present_address: "",
            permanent_address: "",
            gender: "Male",
            avatar: "",
            isProfileComplete: false,
            availableAdvancePercentage: 60,
            user_role: "employee",
          };
          setUser(userData);
          storeUserData(userData);
          storeUserId(userData.id);
        }
        
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
      if (userData.contact_number) {
        updatePhoneNumber(userData.contact_number);
      }
      // Store employee ID if it's being updated
      if (userData.id) {
        storeEmployeeId(userData.id);
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
