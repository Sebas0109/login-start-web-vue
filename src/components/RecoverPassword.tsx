import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import loginBg from "@/assets/login-bg.jpg";

const RecoverPassword = () => {
  const { recover_token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) {
      return "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword ? "Las contraseñas no coinciden" : "";

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    if (!recover_token) {
      setErrors({ general: "Token de recuperación inválido" });
      return;
    }

    setIsLoading(true);

    try {
      const message = await authService.recoverPassword(recover_token, password);
      setSuccess(true);
      toast({
        title: "Contraseña restablecida",
        description: message,
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al restablecer contraseña";
      setErrors({ general: errorMessage });
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
      
      {/* Recover Password Card */}
      <Card className="w-full max-w-lg mx-4 relative z-10 bg-gradient-card backdrop-blur-lg border-primary/20 shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Nueva contraseña
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa tu nueva contraseña para completar la recuperación
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                Contraseña restablecida exitosamente. Redirigiendo a inicio de sesión...
              </div>
            )}
            
            {errors.general && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-smooth focus:shadow-glow focus:border-primary/50 bg-secondary/50 border-border/50 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-smooth focus:shadow-glow focus:border-primary/50 bg-secondary/50 border-border/50 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-3">
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow transition-bounce disabled:opacity-50 text-primary-foreground font-semibold"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Restableciendo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Restablecer contraseña</span>
                </div>
              )}
            </Button>
            
            {success && (
              <Link 
                to="/login" 
                className="text-center text-primary hover:text-primary/80 transition-smooth font-medium text-sm"
              >
                Ir a inicio de sesión
              </Link>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RecoverPassword;