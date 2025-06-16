
import React from "react";
import LanguageToggle from "@/components/auth/LanguageToggle";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginFormContainer from "@/components/auth/LoginFormContainer";
import { useLoginFlow } from "@/hooks/useLoginFlow";

const Login: React.FC = () => {
  const { isDevelopmentMode, DEVELOPMENT_OTP } = useLoginFlow();

  return (
    <div className="min-h-screen flex flex-col bg-background p-4">
      <LanguageToggle />
      
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <LoginHeader 
          isDevelopmentMode={isDevelopmentMode}
          developmentOTP={DEVELOPMENT_OTP}
        />
        <LoginFormContainer />
      </div>
    </div>
  );
};

export default Login;
