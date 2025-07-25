
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedLoader from "@/components/common/AnimatedLoader";

interface PhoneNumberFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base">
          Enter your mobile number <span className="text-red-500">*</span>
        </Label>
        <div className="flex">
          <div className="flex items-center bg-gray-100 px-3 border border-r-0 rounded-l-md">
            <span className="text-sm font-medium">+88</span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="rounded-l-none"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <AnimatedLoader size="small" />
            <span>Sending...</span>
          </div>
        ) : (
          "Send OTP"
        )}
      </Button>
    </form>
  );
};

export default PhoneNumberForm;
