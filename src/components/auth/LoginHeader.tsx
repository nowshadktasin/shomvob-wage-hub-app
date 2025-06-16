
import React from "react";

const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Welcome To <span className="text-green-500">Shomvob</span>
      </h1>
      <p className="text-muted-foreground text-lg">Sign In / Registration</p>
    </div>
  );
};

export default LoginHeader;
