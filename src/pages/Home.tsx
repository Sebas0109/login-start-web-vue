import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Settings, Bell, Home as HomeIcon, BarChart3, Users, FileText } from "lucide-react";
import homeBg from "@/assets/home-bg.jpg";

const HomePage = () => {
  const [user] = useState({ name: "John Doe", email: "john@example.com" });

  const handleLogout = () => {
    console.log("Logout clicked");
    // For now just log - you'll need Supabase for real authentication
  };

  const dashboardCards = [
    {
      title: "Overview",
      icon: HomeIcon,
      description: "Dashboard overview and analytics",
      count: "24",
      color: "text-primary"
    },
    {
      title: "Analytics", 
      icon: BarChart3,
      description: "View detailed analytics and reports",
      count: "1.2k",
      color: "text-accent-foreground"
    },
    {
      title: "Users",
      icon: Users, 
      description: "Manage user accounts and permissions",
      count: "156",
      color: "text-muted-foreground"
    },
    {
      title: "Documents",
      icon: FileText,
      description: "Access and manage documents",
      count: "89",
      color: "text-foreground"
    }
  ];

  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${homeBg})` }}
      />
      
      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant hover:shadow-glow transition-smooth cursor-pointer group"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color} group-hover:scale-110 transition-bounce`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{card.count}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-smooth">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">Activity {item}</p>
                    <p className="text-xs text-muted-foreground">Recent action description</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-primary hover:shadow-glow transition-bounce text-primary-foreground">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="w-full transition-smooth hover:bg-accent/30">
                <FileText className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="w-full transition-smooth hover:bg-accent/30">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;