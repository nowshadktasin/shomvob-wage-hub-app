
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({ 
  size = 'medium', 
  text,
  className 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-18 h-18'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div 
      className={cn("flex flex-col items-center justify-center space-y-3", className)}
      role="status"
      aria-label={text || "Loading..."}
    >
      <div className="relative">
        <img
          src="/lovable-uploads/3e9c38e3-6cac-464b-801e-0c3545f31ba5.png"
          alt="Loading"
          className={cn(
            sizeClasses[size],
            "animate-loader-spin will-change-transform",
            "motion-reduce:animate-none"
          )}
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
        <div 
          className={cn(
            "absolute inset-0 rounded-full animate-loader-pulse",
            "bg-primary/20 opacity-50"
          )}
        />
      </div>
      {text && (
        <p className={cn(
          "text-muted-foreground font-medium animate-fade-in",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default AnimatedLoader;
