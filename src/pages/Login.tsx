
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PhoneNumberForm from "@/components/auth/PhoneNumberForm";
import OTPVerificationForm from "@/components/auth/OTPVerificationForm";
import LanguageToggle from "@/components/auth/LanguageToggle";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Your provided endpoint configuration (fixed Authorization header)
  const otpEndpoint = "https://backend-api.shomvob.co/api/v2/otp/phone?platform=wagely";
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNob212b2JUZWNoQVBJVXNlciIsImlhdCI6MTY1OTg5NTcwOH0.IOdKen62ye0N9WljM_cj3Xffmjs3dXUqoJRZ_1ezd4Q";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 11) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Sending OTP to:", phoneNumber);
    console.log("Using endpoint:", otpEndpoint);

    try {
      // Format phone number to include country code if not present
      const formattedPhone = phoneNumber.startsWith('88') ? phoneNumber : `88${phoneNumber}`;

      const response = await fetch(otpEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`, // Fixed typo: "Bearar" to "Bearer"
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone
        }),
      });

      console.log("OTP Response status:", response.status);
      const responseData = await response.json();
      console.log("OTP Response data:", responseData);

      if (response.ok) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code",
        });
      } else {
        // For development/testing purposes, allow proceeding to OTP screen even if API fails
        console.warn("API call failed, but proceeding to OTP screen for testing");
        setOtpSent(true);
        toast({
          title: "API Error (Dev Mode)",
          description: "API call failed, but you can proceed to test OTP input",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      // For development/testing purposes, allow proceeding to OTP screen even if network fails
      console.warn("Network error, but proceeding to OTP screen for testing");
      setOtpSent(true);
      toast({
        title: "Network Error (Dev Mode)",
        description: "Network error occurred, but you can proceed to test OTP input",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would verify the OTP with the server
      const success = await login(phoneNumber, otp);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to Shomvob",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhoneNumber = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background p-4">
      <LanguageToggle />
      
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome To <span className="text-green-500">Shomvob</span>
          </h1>
          <p className="text-muted-foreground text-lg">Sign In / Registration</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            {!otpSent ? (
              <PhoneNumberForm
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                isLoading={isLoading}
                onSubmit={handleSendOTP}
              />
            ) : (
              <OTPVerificationForm
                phoneNumber={phoneNumber}
                otp={otp}
                setOtp={setOtp}
                isLoading={isLoading}
                onSubmit={handleVerifyOTP}
                onChangePhoneNumber={handleChangePhoneNumber}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
