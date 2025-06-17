
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/types/auth";

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
        <AvatarImage src={user?.avatar} alt={user?.full_name || ""} />
        <AvatarFallback className="text-xl">{getInitials(user?.full_name || "")}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
