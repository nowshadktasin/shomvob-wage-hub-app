
import { UserData, SessionData } from "@/types/auth";
import { fetchEmployeeProfile } from "@/services/employeeApi";

export const createFallbackUserData = (phoneNumber: string, employeeId?: string): UserData => {
  return {
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
};

export const createSessionData = (sessionData: any): SessionData => {
  return {
    access_token: sessionData.access_token,
    token_type: sessionData.token_type || "bearer",
    expires_in: sessionData.expires_in,
    expires_at: sessionData.expires_at,
    refresh_token: sessionData.refresh_token,
  };
};

export const loadUserProfile = async (phoneNumber: string, accessToken: string): Promise<UserData> => {
  try {
    const profileData = await fetchEmployeeProfile(phoneNumber, accessToken);
    console.log('Profile data loaded:', profileData);
    return profileData;
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    throw error;
  }
};

export const reconstructSessionFromStorage = (
  accessToken: string, 
  tokenType?: string | null, 
  expiresIn?: string | null, 
  expiresAt?: string | null, 
  refreshToken?: string | null
): SessionData => {
  return {
    access_token: accessToken,
    token_type: tokenType || "bearer",
    expires_in: expiresIn ? parseInt(expiresIn) : 604800,
    expires_at: expiresAt ? parseInt(expiresAt) : 0,
    refresh_token: refreshToken || "",
  };
};
