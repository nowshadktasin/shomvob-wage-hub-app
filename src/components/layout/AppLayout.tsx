import React, { useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, User, Wallet, Settings, Menu, LogOut } from "lucide-react";
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}
const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  href,
  active
}) => {
  return <Link to={href} className={cn("flex items-center gap-3 px-4 py-3 rounded-md transition-colors", active ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-primary/5 hover:text-primary")}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>;
};
const AppLayout: React.FC = () => {
  const {
    t,
    i18n
  } = useTranslation();
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = location.pathname;
  const isBangla = i18n.language === 'bn';
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const toggleLanguage = () => {
    const newLang = i18n.language === 'bn' ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };
  const getInitials = (name: string) => {
    return name?.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2) || "US";
  };
  const navItems = [{
    icon: Home,
    label: t("dashboard.title"),
    href: "/dashboard"
  }, {
    icon: Wallet,
    label: t("earnings.title"),
    href: "/earnings"
  }, {
    icon: User,
    label: t("profile.title"),
    href: "/profile"
  }, {
    icon: Settings,
    label: t("settings.title"),
    href: "/settings"
  }];
  return <div className={cn("min-h-screen flex flex-col bg-background", isBangla && "font-siliguri")}>
      {/* Mobile header */}
      <header className="sticky top-0 z-30 bg-background border-b h-16 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="h-16 flex items-center justify-center border-b px-6">
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <img src="/lovable-uploads/1bd4350e-e3d3-4713-823b-e16419562f96.png" alt="Shomvob EWA" className="h-12 cursor-pointer" />
                  </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navItems.map(item => <NavItem key={item.href} icon={item.icon} label={item.label} href={item.href} active={pathname === item.href} />)}
                </nav>

                <div className="border-t p-4">
                  <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>{t("auth.logout")}</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/dashboard">
            <img src="/lovable-uploads/1bd4350e-e3d3-4713-823b-e16419562f96.png" alt="Shomvob EWA" className="h-10 cursor-pointer" />
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-1 px-2 py-1 text-xs border">
            {i18n.language === 'bn' ? '🇧🇩 বাং' : '🇺🇸 EN'}
          </Button>
          {user && <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.full_name} />
              <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
            </Avatar>}
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-64 bg-sidebar border-r flex-col h-screen sticky top-0">
          <div className="h-16 flex items-center justify-between border-b px-6">
            <Link to="/dashboard">
              <img src="/lovable-uploads/1bd4350e-e3d3-4713-823b-e16419562f96.png" alt="Shomvob EWA" className="h-12 cursor-pointer" />
            </Link>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-1 px-2 py-1 text-xs border">
              {i18n.language === 'bn' ? '🇧🇩 বাং' : '🇺🇸 EN'}
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => <NavItem key={item.href} icon={item.icon} label={item.label} href={item.href} active={pathname === item.href} />)}
          </nav>

          {user && <div className="border-t p-4 flex items-center">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={user.avatar} alt={user.full_name} />
                <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>}
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>;
};
export default AppLayout;