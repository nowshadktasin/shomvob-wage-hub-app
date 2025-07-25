
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AnimatedLoader from "@/components/common/AnimatedLoader";

interface OTPVerificationFormProps {
  phoneNumber: string;
  otp: string;
  setOtp: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChangePhoneNumber: () => void;
  onResendOTP: () => void;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  phoneNumber,
  otp,
  setOtp,
  isLoading,
  onSubmit,
  onChangePhoneNumber,
  onResendOTP,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          We've sent a 4-digit code to +88{phoneNumber}
        </p>
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <AnimatedLoader size="small" />
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify OTP"
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onResendOTP}
          disabled={isLoading}
        >
          Resend OTP
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onChangePhoneNumber}
        >
          Change Phone Number
        </Button>
      </div>
    </form>
  );
};

export default OTPVerificationForm;
