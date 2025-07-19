import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Wallet, History, HelpCircle } from "lucide-react";

interface BottomNavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  icon: Icon,
  label,
  href,
  active
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1",
        active 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "w-6 h-6 mb-1",
        active && "text-primary"
      )} />
      <span className={cn(
        "text-xs font-medium truncate",
        active && "text-primary"
      )}>
        {label}
      </span>
    </Link>
  );
};

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      icon: Wallet,
      label: t("ewa.title", "EWA"),
      href: "/ewa"
    },
    {
      icon: History,
      label: t("history.title", "History"),
      href: "/history"
    },
    {
      icon: HelpCircle,
      label: t("help.title", "Help"),
      href: "/help"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
        {navItems.map((item) => (
          <BottomNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;