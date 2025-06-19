
import { UserData, SessionData } from "@/types/auth";

export const storageKeys = {
  phoneNumber: "phoneNumber",
  userId: "userId",
  employeeId: "employeeId", // Add new key for employee ID from API
  accessToken: "access_token",
  tokenType: "token_type",
  expiresIn: "expires_in",
  expiresAt: "expires_at",
  refreshToken: "refresh_token",
} as const;

export const getStoredAuthData = () => {
  const phoneNumber = localStorage.getItem(storageKeys.phoneNumber);
  const accessToken = localStorage.getItem(storageKeys.accessToken);
  const tokenType = localStorage.getItem(storageKeys.tokenType);
  const expiresIn = localStorage.getItem(storageKeys.expiresIn);
  const expiresAt = localStorage.getItem(storageKeys.expiresAt);
  const refreshToken = localStorage.getItem(storageKeys.refreshToken);
  const employeeId = localStorage.getItem(storageKeys.employeeId);

  return {
    phoneNumber,
    accessToken,
    tokenType,
    expiresIn,
    expiresAt,
    refreshToken,
    employeeId,
  };
};

export const storeSessionData = (sessionData: any) => {
  localStorage.setItem(storageKeys.accessToken, sessionData.access_token);
  localStorage.setItem(storageKeys.tokenType, sessionData.token_type);
  localStorage.setItem(storageKeys.expiresIn, sessionData.expires_in.toString());
  localStorage.setItem(storageKeys.expiresAt, sessionData.expires_at.toString());
  localStorage.setItem(storageKeys.refreshToken, sessionData.refresh_token);
};

export const storeUserData = (userData: UserData) => {
  localStorage.setItem(storageKeys.phoneNumber, userData.contact_number);
  localStorage.setItem(storageKeys.userId, userData.id);
  // Store employee ID separately if it's different from the generic user ID
  localStorage.setItem(storageKeys.employeeId, userData.id);
};

export const storeUserId = (userId: string) => {
  localStorage.setItem(storageKeys.userId, userId);
};

export const storeEmployeeId = (employeeId: string) => {
  localStorage.setItem(storageKeys.employeeId, employeeId);
};

export const clearAuthStorage = () => {
  Object.values(storageKeys).forEach(key => {
    localStorage.removeItem(key);
  });
};

export const updatePhoneNumber = (phoneNumber: string) => {
  localStorage.setItem(storageKeys.phoneNumber, phoneNumber);
};
