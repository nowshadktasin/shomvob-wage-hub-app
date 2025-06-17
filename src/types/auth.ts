
// User data interface updated to match API response
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  avatar?: string; // Made optional to match EmployeeProfileResponse
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

export interface AuthContextType {
  user: UserData | null;
  session: SessionData | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string, apiUserData?: any, sessionData?: any) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<UserData>) => void;
  getAccessToken: () => string | null;
}
