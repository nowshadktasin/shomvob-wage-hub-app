
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PhoneNumberForm from "@/components/auth/PhoneNumberForm";
import OTPVerificationForm from "@/components/auth/OTPVerificationForm";
import { useLoginFlow } from "@/hooks/useLoginFlow";

const LoginFormContainer: React.FC = () => {
  const {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isLoading,
    otpSent,
    handleSendOTP,
    handleVerifyOTP,
    handleChangePhoneNumber,
  } = useLoginFlow();

  return (
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
  );
};

export default LoginFormContainer;
