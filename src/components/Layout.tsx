import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

type Role = "ADMIN" | "CLIENT";

const Layout = () => {
  const [currentRole, setCurrentRole] = useState<Role>("ADMIN");

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navigation currentRole={currentRole} onRoleChange={setCurrentRole} />
      <Outlet context={{ currentRole }} />
    </div>
  );
};

export default Layout;