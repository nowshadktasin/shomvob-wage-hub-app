
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useLoginFlow = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Development mode - set to true for testing without API
  const isDevelopmentMode = true;
  const DEVELOPMENT_OTP = "1234"; // Test OTP for development

  // API endpoints and auth token
  const otpEndpoint = "https://backend-api.shomvob.co/api/v2/otp/phone?platform=wagely";
  const otpValidateEndpoint = "https://backend-api.shomvob.co/api/v2/otp/validate";
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

    if (isDevelopmentMode) {
      // Development mode - simulate OTP sending
      console.log("Development Mode: Simulating OTP send to:", phoneNumber);
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
        toast({
          title: "Development Mode",
          description: `Test OTP sent! Use ${DEVELOPMENT_OTP} to login`,
        });
      }, 1000);
      return;
    }

    console.log("Sending OTP to:", phoneNumber);
    console.log("Using endpoint:", otpEndpoint);

    try {
      // Format phone number to include country code if not present
      const formattedPhone = phoneNumber.startsWith('88') ? phoneNumber : `88${phoneNumber}`;

      const response = await fetch(otpEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
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
    
    if (!otp || otp.length !== 4) {
      toast({
        title: "Error",
        description: "Please enter the 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    if (isDevelopmentMode) {
      // Development mode - check against test OTP
      console.log("Development Mode: Verifying OTP:", otp);
      setTimeout(async () => {
        if (otp === DEVELOPMENT_OTP) {
          const success = await login(phoneNumber, otp);
          if (success) {
            toast({
              title: "Login Successful (Dev Mode)",
              description: "Welcome to Shomvob",
            });
            navigate("/dashboard");
          } else {
            toast({
              title: "Login Error",
              description: "Authentication failed",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Invalid OTP",
            description: `Please use ${DEVELOPMENT_OTP} for testing`,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 1000);
      return;
    }

    console.log("Verifying OTP:", otp);
    console.log("Using endpoint:", otpValidateEndpoint);

    try {
      // Format phone number to include country code if not present
      const formattedPhone = phoneNumber.startsWith('88') ? phoneNumber : `88${phoneNumber}`;

      const response = await fetch(otpValidateEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
          otp: parseInt(otp)
        }),
      });

      console.log("OTP Validation Response status:", response.status);
      const responseData = await response.json();
      console.log("OTP Validation Response data:", responseData);

      if (response.ok && responseData.code === 200 && responseData.data?.status === "SUCCESS") {
        // OTP verification successful
        const success = await login(phoneNumber, otp);
        if (success) {
          toast({
            title: "Login Successful",
            description: "Welcome to Shomvob",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Login Error",
            description: "Authentication failed after OTP verification",
            variant: "destructive",
          });
        }
      } else {
        // OTP verification failed
        toast({
          title: "Invalid OTP",
          description: responseData.msg || "Please check your OTP and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Verification Error",
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

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isLoading,
    otpSent,
    isDevelopmentMode,
    DEVELOPMENT_OTP,
    handleSendOTP,
    handleVerifyOTP,
    handleChangePhoneNumber,
  };
};
