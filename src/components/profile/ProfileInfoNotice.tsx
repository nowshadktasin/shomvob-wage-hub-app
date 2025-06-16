
import React from "react";

const ProfileInfoNotice: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm text-blue-700 text-center">
        Profile information is managed by your employer and cannot be edited directly.
      </p>
    </div>
  );
};

export default ProfileInfoNotice;
