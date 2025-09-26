import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Guest } from '@/data/mockData';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest | null;
  onSave?: (guestData: Partial<Guest>) => void;
  isAdding?: boolean;
  mode?: 'edit' | 'view';
}

export const GuestModal = ({ isOpen, onClose, guest, onSave, isAdding = false, mode = 'edit' }: GuestModalProps) => {
  const isViewMode = mode === 'view';
  const [formData, setFormData] = useState({
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    stateCode: '55',
    phone: '',
    escortCount: 0,
    assistance: 'Pending' as 'Confirmed' | 'Cancelled' | 'Pending' | 'Not coming',
    confirmationEmailSent: false,
    personalMessage: ''
  });

  useEffect(() => {
    if (guest && !isAdding) {
      setFormData({
        name: guest.name || '',
        paternalSurname: guest.paternalSurname || '',
        maternalSurname: guest.maternalSurname || '',
        stateCode: guest.stateCode || '55',
        phone: guest.phone || '',
        escortCount: guest.escortCount || 0,
        assistance: guest.assistance || 'Pending' as 'Confirmed' | 'Cancelled' | 'Pending' | 'Not coming',
        confirmationEmailSent: guest.confirmationEmailSent || false,
        personalMessage: guest.personalMessage || ''
      });
    } else {
      setFormData({
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        stateCode: '55',
        phone: '',
        escortCount: 0,
        assistance: 'Pending' as 'Confirmed' | 'Cancelled' | 'Pending' | 'Not coming',
        confirmationEmailSent: false,
        personalMessage: ''
      });
    }
  }, [guest, isOpen, isAdding]);

  const handleSave = () => {
    if (isViewMode || !onSave) return;
    
    if (!formData.name.trim() || !formData.paternalSurname.trim() || !formData.phone.trim()) {
      return;
    }

    const phoneRegex = /^[\d\s\-]+$/;
    if (!phoneRegex.test(formData.phone)) {
      return;
    }

    onSave(formData);
    setFormData({
      name: '',
      paternalSurname: '',
      maternalSurname: '',
      stateCode: '55',
      phone: '',
      escortCount: 0,
      assistance: 'Pending' as 'Confirmed' | 'Cancelled' | 'Pending' | 'Not coming',
      confirmationEmailSent: false,
      personalMessage: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: guest?.name || '',
      paternalSurname: guest?.paternalSurname || '',
      maternalSurname: guest?.maternalSurname || '',
      stateCode: guest?.stateCode || '55',
      phone: guest?.phone || '',
      escortCount: guest?.escortCount || 0,
      assistance: guest?.assistance || 'Pending' as 'Confirmed' | 'Cancelled' | 'Pending' | 'Not coming',
      confirmationEmailSent: guest?.confirmationEmailSent || false,
      personalMessage: guest?.personalMessage || ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? 'Detalles del Invitado' : isAdding ? 'Agregar Invitado' : 'Actualizar Invitado'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Responsive grid: stack on mobile, 2-column on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, name: e.target.value })}
                required={!isViewMode}
                disabled={isViewMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paternalSurname">
                Apellido Paterno *
              </Label>
              <Input
                id="paternalSurname"
                value={formData.paternalSurname}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, paternalSurname: e.target.value })}
                required={!isViewMode}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maternalSurname">
                Apellido Materno
              </Label>
              <Input
                id="maternalSurname"
                value={formData.maternalSurname}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, maternalSurname: e.target.value })}
                disabled={isViewMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefono *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={isViewMode ? undefined : "Ingresa el número sin LADA"}
                required={!isViewMode}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stateCode">
                Código de área (LADA) *
              </Label>
              {isViewMode ? (
                <Input value={formData.stateCode} disabled />
              ) : (
                <Select value={formData.stateCode} onValueChange={(value) => setFormData({ ...formData, stateCode: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="55">55</SelectItem>
                    <SelectItem value="33">33</SelectItem>
                    <SelectItem value="81">81</SelectItem>
                    <SelectItem value="444">444</SelectItem>
                    <SelectItem value="477">477</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistance">
                Asistencia
              </Label>
              {isViewMode ? (
                <div className="h-10 flex items-center">
                  <Badge 
                    variant={
                      formData.assistance === 'Confirmed' ? 'default' : 
                      formData.assistance === 'Cancelled' || formData.assistance === 'Not coming' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {formData.assistance}
                  </Badge>
                </div>
              ) : (
                <Select value={formData.assistance} onValueChange={(value: any) => setFormData({ ...formData, assistance: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pendiente</SelectItem>
                    <SelectItem value="Confirmed">Confirmado</SelectItem>
                    <SelectItem value="Cancelled">Cancelado</SelectItem>
                    <SelectItem value="Not coming">No asistirá</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="escortCount">
                Acompañantes
              </Label>
              <Input
                id="escortCount"
                type="number"
                min="0"
                value={formData.escortCount}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, escortCount: parseInt(e.target.value) || 0 })}
                disabled={isViewMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmationEmailSent">
                Confirmacion
              </Label>
              {isViewMode ? (
                <div className="h-10 flex items-center">
                  <span className="text-sm">{formData.confirmationEmailSent ? 'Sí' : 'No'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 h-10">
                  <Checkbox
                    id="confirmationEmailSent"
                    checked={formData.confirmationEmailSent}
                    onCheckedChange={(checked) => setFormData({ ...formData, confirmationEmailSent: !!checked })}
                  />
                  <span className="text-sm text-muted-foreground">Correo de confirmación enviado</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalMessage">
              Mensaje personal
            </Label>
            <Textarea
              id="personalMessage"
              value={formData.personalMessage}
              onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, personalMessage: e.target.value })}
              placeholder={isViewMode ? undefined : "Mensaje personal opcional para el invitado..."}
              className={isViewMode ? "min-h-[80px] resize-none" : "min-h-[80px] resize-y"}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isViewMode ? (
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Guardar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};