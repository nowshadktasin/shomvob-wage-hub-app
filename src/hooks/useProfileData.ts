
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEmployeeProfile } from '@/services/employeeApi';
import { useToast } from '@/hooks/use-toast';

export const useProfileData = () => {
  const { user, session, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshProfile = async () => {
    if (!user?.phone || !session?.access_token) {
      toast({
        title: "Error",
        description: "Unable to refresh profile - missing authentication data",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      const profileData = await fetchEmployeeProfile(user.phone, session.access_token);
      updateUserProfile(profileData);
      toast({
        description: "Profile data refreshed successfully",
      });
      console.log('Profile refreshed:', profileData);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      toast({
        title: "Error",
        description: "Failed to refresh profile data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    refreshProfile,
    isRefreshing,
  };
};
