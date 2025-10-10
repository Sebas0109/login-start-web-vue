import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;