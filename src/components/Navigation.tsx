import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.png";

type Role = "ADMIN" | "CLIENT";

interface NavigationProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const Navigation = ({ currentRole, onRoleChange }: NavigationProps) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const mockNotifications = [
    { id: 1, text: "New event created", time: "2 min ago" },
    { id: 2, text: "Catalog updated", time: "5 min ago" },
    { id: 3, text: "Reminder: Meeting at 2pm", time: "10 min ago" },
    { id: 4, text: "User registered", time: "15 min ago" },
    { id: 5, text: "Calendar sync completed", time: "20 min ago" },
  ];

  const adminMenuItems = [
    { name: "Events", path: "/events" },
    { name: "Catalogs", path: "/catalogs" },
    { name: "Users", path: "/users" },
    { name: "Calendar", path: "/calendar" },
  ];

  const clientMenuItems = [
    { name: "Events", path: "/events" },
    { name: "Calendar", path: "/calendar" },
  ];

  const menuItems = currentRole === "ADMIN" ? adminMenuItems : clientMenuItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showNotifications]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <img 
                src={logo} 
                alt="The Invitation Company" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-xl font-bold text-white ml-2">
                The Invitation Company
              </span>
            </Link>
          </div>

          {/* Center/Left: Role-based menu */}
          <div className="hidden md:flex items-center space-x-8 ml-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? "bg-primary text-white border-b-2 border-primary"
                    : "text-white hover:text-primary hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Notifications and Role Switcher */}
          <div className="flex items-center space-x-4">
            {/* Dev Role Switcher */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-white/10 border border-white/20">
              <span className="text-xs text-white/70">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as Role)}
                className="text-xs bg-transparent border-none outline-none text-white"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CLIENT">CLIENT</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-white hover:bg-white/10"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-primary text-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-border/30">
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-border/20 hover:bg-accent/20 transition-smooth cursor-pointer"
                        >
                          <p className="text-sm text-foreground">{notification.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? "bg-primary text-white"
                    : "text-white hover:text-primary hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;