
import React from "react";

const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="text-3xl font-bold text-primary mb-2">
        <div>Welcome To</div>
        <img src="/lovable-uploads/1bd4350e-e3d3-4713-823b-e16419562f96.png" alt="Shomvob EWA" className="h-30 mx-auto mt-2" />
      </div>
      <p className="text-muted-foreground text-lg">Sign In / Registration</p>
    </div>
  );
};

export default LoginHeader;
