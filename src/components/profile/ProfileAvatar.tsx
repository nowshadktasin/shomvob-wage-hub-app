
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/contexts/AuthContext";

interface ProfileAvatarProps {
  user: UserData | null;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Avatar className="h-24 w-24 mb-2">
        <AvatarImage src={user?.avatar} alt={user?.name || ""} />
        <AvatarFallback className="text-xl">{getInitials(user?.name || "")}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
