import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import loginBg from "@/assets/login-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/events";
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const authData = await authService.login(email, password);
      setAuth(authData);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta",
      });

      // Redirect to intended route or default to /events
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/events";
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-secondary relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-20" />
      
      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-gradient-card backdrop-blur-lg border-primary/20 shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Bienvenido de vuelta
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Inicia sesión en tu cuenta para continuar
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="transition-smooth focus:shadow-glow focus:border-primary/50 bg-secondary/50 border-border/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10 transition-smooth focus:shadow-glow focus:border-primary/50 bg-secondary/50 border-border/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-end text-sm">
              <Link 
                to="/forgot-password" 
                className="text-primary hover:text-primary/80 transition-smooth font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>
          
          <CardFooter className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow transition-bounce disabled:opacity-50 text-primary-foreground font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </div>
              )}
            </Button>
            
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;