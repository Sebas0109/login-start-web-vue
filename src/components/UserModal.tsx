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
}

export const UserModal = ({ user, isOpen, onClose, onSave }: UserModalProps) => {
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
    if (user) {
      setFormData(user);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setIsPasswordSectionOpen(false);
      setErrors({});
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.paternalSurname.trim()) newErrors.paternalSurname = 'Paternal surname is required';
    if (!formData.maternalSurname.trim()) newErrors.maternalSurname = 'Maternal surname is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{7,10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 7-10 digits';
    }

    if (!formData.stateCode) newErrors.stateCode = 'State code is required';

    // Password validation only if section is open and passwords are entered
    if (isPasswordSectionOpen && (passwordData.newPassword || passwordData.confirmPassword)) {
      if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedUser = { ...formData };
    
    // Update password if it was changed
    if (isPasswordSectionOpen && passwordData.newPassword) {
      updatedUser.password = passwordData.newPassword;
    }

    onSave(updatedUser);
    toast({
      title: "Success",
      description: "User updated successfully",
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

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ID - Read only */}
          <div className="space-y-2">
            <Label>ID</Label>
            <Input 
              value={formData.id} 
              readOnly 
              className="bg-muted font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Enter name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Paternal Surname */}
            <div className="space-y-2">
              <Label>Paternal Surname *</Label>
              <Input
                value={formData.paternalSurname}
                onChange={(e) => handleInputChange('paternalSurname', e.target.value)}
                className={errors.paternalSurname ? 'border-destructive' : ''}
                placeholder="Enter paternal surname"
              />
              {errors.paternalSurname && <p className="text-sm text-destructive">{errors.paternalSurname}</p>}
            </div>

            {/* Maternal Surname */}
            <div className="space-y-2">
              <Label>Maternal Surname *</Label>
              <Input
                value={formData.maternalSurname}
                onChange={(e) => handleInputChange('maternalSurname', e.target.value)}
                className={errors.maternalSurname ? 'border-destructive' : ''}
                placeholder="Enter maternal surname"
              />
              {errors.maternalSurname && <p className="text-sm text-destructive">{errors.maternalSurname}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Profile */}
            <div className="space-y-2">
              <Label>Profile *</Label>
              <Select value={formData.profile} onValueChange={(value: 'CLIENT' | 'ADMIN') => handleInputChange('profile', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">CLIENT</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* State Code */}
            <div className="space-y-2">
              <Label>State Code *</Label>
              <Select value={formData.stateCode} onValueChange={(value) => handleInputChange('stateCode', value)}>
                <SelectTrigger className={errors.stateCode ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select state code" />
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
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                className={errors.phoneNumber ? 'border-destructive' : ''}
                placeholder="Enter phone number"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">Enter number without state/area code (7-10 digits)</p>
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
            </div>
          </div>

          {/* Change Password Section */}
          <Collapsible open={isPasswordSectionOpen} onOpenChange={setIsPasswordSectionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                {isPasswordSectionOpen ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                Change Password
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={errors.newPassword ? 'border-destructive' : ''}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};