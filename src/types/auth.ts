
// User data interface updated to match API response
export interface UserData {
  id: string;
  full_name: string;
  email: string;
  contact_number: string;
  designation: string;
  department: string;
  joining_date: string;
  company_name: string;
  gross_salary: number;
  present_address: string;
  permanent_address: string;
  gender: string;
  avatar?: string; // Made optional to match EmployeeProfileResponse
  isProfileComplete: boolean;
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

export interface AuthContextType {
  user: UserData | null;
  session: SessionData | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string, apiUserData?: any, sessionData?: any) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<UserData>) => void;
  getAccessToken: () => string | null;
}
