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

    try {
      // Format phone number - ensure it starts with 88 and has proper length
      let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
      
      // If it starts with 0, replace with 880
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '88' + formattedPhone;
      }
      // If it doesn't start with 88, add 88
      else if (!formattedPhone.startsWith('88')) {
        formattedPhone = '88' + formattedPhone;
      }

      console.log("Sending OTP to:", formattedPhone);
      console.log("Using endpoint:", otpEndpoint);

      const response = await fetch(otpEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearar ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone
        }),
      });

      console.log("OTP Response status:", response.status);
      const responseData = await response.json();
      console.log("OTP Response data:", responseData);

      if (response.ok && responseData.code === 200) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code",
        });
      } else {
        toast({
          title: "Error",
          description: responseData.msg || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Network Error",
        description: "Please check your connection and try again",
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

    try {
      // Format phone number same as in send OTP
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '88' + formattedPhone;
      } else if (!formattedPhone.startsWith('88')) {
        formattedPhone = '88' + formattedPhone;
      }

      console.log("Verifying OTP:", otp);
      console.log("Using endpoint:", otpValidateEndpoint);

      const response = await fetch(otpValidateEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearar ${authToken}`,
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

      // Check for status 200 in response body (not code)
      if (response.ok && responseData.status === 200) {
        // OTP verification successful - use the actual user data from API
        const userData = responseData.user || responseData.session?.user;
        const sessionData = responseData.session;
        
        console.log("User data:", userData);
        console.log("Session data:", sessionData);
        
        const success = await login(formattedPhone, otp, userData, sessionData);
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

  const handleResendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number - ensure it starts with 88 and has proper length
      let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
      
      // If it starts with 0, replace with 880
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '88' + formattedPhone;
      }
      // If it doesn't start with 88, add 88
      else if (!formattedPhone.startsWith('88')) {
        formattedPhone = '88' + formattedPhone;
      }

      console.log("Resending OTP to:", formattedPhone);
      console.log("Using endpoint:", otpEndpoint);

      const response = await fetch(otpEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearar ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone
        }),
      });

      console.log("Resend OTP Response status:", response.status);
      const responseData = await response.json();
      console.log("Resend OTP Response data:", responseData);

      if (response.ok && responseData.code === 200) {
        toast({
          title: "OTP Resent",
          description: "Please check your phone for the new verification code",
        });
      } else {
        toast({
          title: "Error",
          description: responseData.msg || "Failed to resend OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        title: "Network Error",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isLoading,
    otpSent,
    handleSendOTP,
    handleVerifyOTP,
    handleChangePhoneNumber,
    handleResendOTP,
  };
};
