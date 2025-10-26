import { useState, useEffect } from 'react';
import { User, CreateUserData, UpdateUserData } from '@/types/user';
import { mockStateCodes } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserData | UpdateUserData) => void;
  mode?: 'create' | 'edit';
  existingUsers?: User[];
}

export const UserModal = ({ user, isOpen, onClose, onSave, mode = 'edit', existingUsers = [] }: UserModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    email: '',
    profile: 'CLIENT',
    phone: '',
    stateCode: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (mode === 'create') {
      setFormData({
        id: 0,
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        email: '',
        profile: 'CLIENT',
        phone: '',
        stateCode: '',
      });
      setPasswordData({ password: '', confirmPassword: '' });
      setIsPasswordSectionOpen(false);
      setErrors({});
    } else if (user) {
      setFormData({
        id: user.id,
        name: user.person.name,
        paternalSurname: user.person.paternalSurname,
        maternalSurname: user.person.maternalSurname,
        email: user.email,
        profile: user.profile,
        phone: user.person.phone,
        stateCode: user.person.stateCode,
      });
      setPasswordData({ password: '', confirmPassword: '' });
      setIsPasswordSectionOpen(false);
      setErrors({});
    }
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.paternalSurname.trim()) newErrors.paternalSurname = 'El apellido paterno es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
    if (!formData.profile) newErrors.profile = 'El perfil es requerido';
    if (!formData.stateCode) newErrors.stateCode = 'El código de área (LADA) es requerido';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    // Check for duplicate emails (excluding current user in edit mode)
    if (formData.email.trim()) {
      const isDuplicate = existingUsers.some(existingUser => 
        existingUser.email === formData.email && 
        (mode === 'create' || existingUser.id !== formData.id)
      );
      if (isDuplicate) {
        newErrors.email = 'Este correo electrónico ya está en uso';
      }
    }

    if (formData.phone.trim() && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'El número telefónico debe contener solo dígitos';
    }

    // Password validation for create mode
    if (mode === 'create') {
      if (!passwordData.password || passwordData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      if (passwordData.password !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (mode === 'create') {
      const createData: CreateUserData = {
        email: formData.email,
        password: passwordData.password,
        name: formData.name,
        paternalSurname: formData.paternalSurname,
        maternalSurname: formData.maternalSurname,
        stateCode: formData.stateCode,
        phone: formData.phone,
      };
      onSave(createData);
    } else {
      const updateData: UpdateUserData = {
        id: formData.id,
        email: formData.email,
        name: formData.name,
        paternalSurname: formData.paternalSurname,
        maternalSurname: formData.maternalSurname,
        stateCode: formData.stateCode,
        phone: formData.phone,
      };
      onSave(updateData);
    }
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: 'password' | 'confirmPassword', value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (mode === 'edit' && !user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Agregar Usuario' : 'Actualizar Usuario'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ID - Read only for edit mode */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label>ID</Label>
              <Input 
                value={formData.id} 
                readOnly 
                className="bg-muted font-mono text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Ingresa el nombre"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Paternal Surname */}
            <div className="space-y-2">
              <Label>Apellido paterno *</Label>
              <Input
                value={formData.paternalSurname}
                onChange={(e) => handleInputChange('paternalSurname', e.target.value)}
                className={errors.paternalSurname ? 'border-destructive' : ''}
                placeholder="Ingresa el apellido paterno"
              />
              {errors.paternalSurname && <p className="text-sm text-destructive">{errors.paternalSurname}</p>}
            </div>

            {/* Maternal Surname */}
            <div className="space-y-2">
              <Label>Apellido materno</Label>
              <Input
                value={formData.maternalSurname}
                onChange={(e) => handleInputChange('maternalSurname', e.target.value)}
                className={errors.maternalSurname ? 'border-destructive' : ''}
                placeholder="Ingresa el apellido materno"
              />
              {errors.maternalSurname && <p className="text-sm text-destructive">{errors.maternalSurname}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Correo electrónico *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="Ingresa el correo electrónico"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Profile */}
            <div className="space-y-2">
              <Label>Perfil *</Label>
              <Select value={formData.profile} onValueChange={(value: 'CLIENT' | 'ADMIN') => handleInputChange('profile', value)}>
                <SelectTrigger className={errors.profile ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona el perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">CLIENTE</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
              {errors.profile && <p className="text-sm text-destructive">{errors.profile}</p>}
            </div>

            {/* State Code */}
            <div className="space-y-2">
              <Label>Código de área (LADA) *</Label>
              <Select value={formData.stateCode} onValueChange={(value) => handleInputChange('stateCode', value)}>
                <SelectTrigger className={errors.stateCode ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona el código de área" />
                </SelectTrigger>
                <SelectContent>
                  {mockStateCodes.map((stateCode) => (
                    <SelectItem key={stateCode.id} value={stateCode.id}>
                      {stateCode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stateCode && <p className="text-sm text-destructive">{errors.stateCode}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label>Número telefónico</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                className={errors.phone ? 'border-destructive' : ''}
                placeholder="Ingresa el número telefónico"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">Ingresa el número sin LADA</p>
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>

          {/* Password Section */}
          {mode === 'create' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contraseña</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label>Nueva contraseña *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.password}
                      onChange={(e) => handlePasswordChange('password', e.target.value)}
                      className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      placeholder="Ingresa la contraseña"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label>Confirmar contraseña *</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      placeholder="Confirma la contraseña"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          ) : (
            <Collapsible open={isPasswordSectionOpen} onOpenChange={setIsPasswordSectionOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  {isPasswordSectionOpen ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  Cambiar contraseña
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label>Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.password}
                        onChange={(e) => handlePasswordChange('password', e.target.value)}
                        className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                        placeholder="Ingresa la nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label>Confirmar contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                        placeholder="Confirma la nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Guardar
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};