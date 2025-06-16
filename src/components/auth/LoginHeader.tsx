
import React from "react";

interface LoginHeaderProps {
  isDevelopmentMode: boolean;
  developmentOTP: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ isDevelopmentMode, developmentOTP }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Welcome To <span className="text-green-500">Shomvob</span>
      </h1>
      <p className="text-muted-foreground text-lg">Sign In / Registration</p>
      {isDevelopmentMode && (
        <p className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded">
          Development Mode: Use OTP {developmentOTP} to login
        </p>
      )}
    </div>
  );
};

export default LoginHeader;
