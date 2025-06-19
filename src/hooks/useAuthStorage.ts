
import { UserData, SessionData } from "@/types/auth";
import { 
  getStoredAuthData, 
  storeSessionData, 
  storeUserData, 
  storeUserId, 
  storeEmployeeId,
  clearAuthStorage, 
  updatePhoneNumber 
} from "@/utils/localStorage";

export const useAuthStorage = () => {
  const loadStoredAuthData = () => {
    return getStoredAuthData();
  };

  const saveSessionData = (sessionData: any) => {
    storeSessionData(sessionData);
    
    // Store only the user ID from session.user object
    if (sessionData.user && sessionData.user.id) {
      storeUserId(sessionData.user.id);
    }
  };

  const saveUserData = (userData: UserData) => {
    storeUserData(userData);
    
    // Store the employee ID from the API response
    if (userData.id) {
      storeEmployeeId(userData.id);
    }
  };

  const updateUserData = (userData: Partial<UserData>) => {
    // Only update phone number if it's being changed
    if (userData.contact_number) {
      updatePhoneNumber(userData.contact_number);
    }
    
    // Store employee ID if it's being updated
    if (userData.id) {
      storeEmployeeId(userData.id);
    }
  };

  const clearStorage = () => {
    clearAuthStorage();
  };

  return {
    loadStoredAuthData,
    saveSessionData,
    saveUserData,
    updateUserData,
    clearStorage
  };
};
