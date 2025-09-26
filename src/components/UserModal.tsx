import { useState, useEffect } from 'react';
import { User } from '@/data/mockData';
import { mockStateCodes } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  mode?: 'create' | 'edit';
  existingUsers?: User[];
}

export const UserModal = ({ user, isOpen, onClose, onSave, mode = 'edit', existingUsers = [] }: UserModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    email: '',
    profile: 'CLIENT',
    phoneNumber: '',
    stateCode: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (mode === 'create') {
      setFormData({
        id: '',
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        email: '',
        profile: 'CLIENT',
        phoneNumber: '',
        stateCode: '',
        password: ''
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setIsPasswordSectionOpen(false);
      setErrors({});
    } else if (user) {
      setFormData(user);
      setPasswordData({ newPassword: '', confirmPassword: '' });
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

    if (formData.phoneNumber.trim() && !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'El número telefónico debe contener solo dígitos';
    }

    // Password validation for create mode or when changing password
    if (mode === 'create' || (isPasswordSectionOpen && (passwordData.newPassword || passwordData.confirmPassword))) {
      if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
        newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedUser = { ...formData };
    
    // Generate ID for new users
    if (mode === 'create') {
      updatedUser.id = crypto.randomUUID();
      updatedUser.password = passwordData.newPassword;
    } else if (isPasswordSectionOpen && passwordData.newPassword) {
      updatedUser.password = passwordData.newPassword;
    }

    onSave(updatedUser);
    toast({
      title: "Éxito",
      description: mode === 'create' ? "Usuario agregado correctamente" : "Usuario actualizado correctamente",
    });
    onClose();
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: 'newPassword' | 'confirmPassword', value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                className={errors.phoneNumber ? 'border-destructive' : ''}
                placeholder="Ingresa el número telefónico"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">Ingresa el número sin LADA</p>
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
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
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={errors.newPassword ? 'border-destructive' : ''}
                    placeholder="Ingresa la contraseña"
                  />
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label>Confirmar contraseña *</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                    placeholder="Confirma la contraseña"
                  />
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
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={errors.newPassword ? 'border-destructive' : ''}
                      placeholder="Ingresa la nueva contraseña"
                    />
                    {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label>Confirmar contraseña</Label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                      placeholder="Confirma la nueva contraseña"
                    />
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