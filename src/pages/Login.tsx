
import React from "react";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginFormContainer from "@/components/auth/LoginFormContainer";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background p-4">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <LoginHeader />
        <LoginFormContainer />
      </div>
    </div>
  );
};

export default Login;
