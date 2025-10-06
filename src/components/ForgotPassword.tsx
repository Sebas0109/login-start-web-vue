import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import loginBg from "@/assets/login-bg.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const message = await authService.forgotPassword(email);
      setSuccess(true);
      toast({
        title: "Solicitud enviada",
        description: message,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al solicitar restablecimiento";
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
      
      {/* Forgot Password Card */}
      <Card className="w-full max-w-lg mx-4 relative z-10 bg-gradient-card backdrop-blur-lg border-primary/20 shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Restablecer contraseña
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa tu correo electrónico para recibir las instrucciones
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                Se ha enviado un correo a la dirección proporcionada
              </div>
            )}
            
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
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Restablecer mi contraseña</span>
                </div>
              )}
            </Button>
            
            <Link 
              to="/login" 
              className="w-full flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-smooth font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio de sesión</span>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;