
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
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label={text || "Loading..."}
    >
      <p className={cn(
        "text-muted-foreground font-medium",
        textSizeClasses[size]
      )}>
        {text || "Loading..."}
      </p>
    </div>
  );
};

export default AnimatedLoader;
