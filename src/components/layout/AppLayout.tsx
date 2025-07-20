import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import ProfileMenu from "@/components/navigation/ProfileMenu";

const AppLayout: React.FC = () => {
  const { i18n } = useTranslation();
  const isBangla = i18n.language === 'bn';

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-background", 
        isBangla && "font-siliguri"
      )}
      lang={isBangla ? 'bn' : 'en'}
      dir="ltr" // Keep LTR for now, can be changed to RTL if needed
    >
      {/* Header with logo and profile */}
      <header className="sticky top-0 z-30 bg-background border-b h-16 flex items-center justify-between px-4">
        <Link to="/app/ewa">
          <img 
            src="/lovable-uploads/1bd4350e-e3d3-4713-823b-e16419562f96.png" 
            alt="Shomvob EWA" 
            className="h-10 cursor-pointer" 
          />
        </Link>
        
        <ProfileMenu />
      </header>

      {/* Main content with bottom padding for navigation */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;