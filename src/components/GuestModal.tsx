import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Guest, CreateGuestPayload } from '@/types/eventDetail';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest | null;
  onSave?: (guestData: CreateGuestPayload) => void;
  isAdding?: boolean;
  mode?: 'edit' | 'view';
}

export const GuestModal = ({ isOpen, onClose, guest, onSave, isAdding = false, mode = 'edit' }: GuestModalProps) => {
  const isViewMode = mode === 'view';
  const [formData, setFormData] = useState({
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    phoneNumber: '',
    assistance: 0, // 0: Sin confirmar, 1: Confirmado, 2: No asistirá
    escorts: 0,
    personalMessage: '',
    notes: ''
  });

  useEffect(() => {
    if (guest && !isAdding) {
      setFormData({
        name: guest.name || '',
        paternalSurname: guest.paternalSurname || '',
        maternalSurname: guest.maternalSurname || '',
        phoneNumber: guest.phoneNumber || '',
        assistance: guest.assistance ?? 0,
        escorts: guest.escorts || 0,
        personalMessage: guest.personalMessage || '',
        notes: guest.notes || ''
      });
    } else {
      setFormData({
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        phoneNumber: '',
        assistance: 0,
        escorts: 0,
        personalMessage: '',
        notes: ''
      });
    }
  }, [guest, isOpen, isAdding]);

  const handleSave = () => {
    if (isViewMode || !onSave) return;
    
    if (!formData.name.trim() || !formData.paternalSurname.trim()) {
      return;
    }

    // Validate phone number only if it's provided
    if (formData.phoneNumber.trim()) {
      const phoneRegex = /^\+?[\d\s\-]+$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        return;
      }
    }

    if (formData.escorts < 0) {
      return;
    }

    onSave(formData);
    setFormData({
      name: '',
      paternalSurname: '',
      maternalSurname: '',
      phoneNumber: '',
      assistance: 0,
      escorts: 0,
      personalMessage: '',
      notes: ''
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: guest?.name || '',
      paternalSurname: guest?.paternalSurname || '',
      maternalSurname: guest?.maternalSurname || '',
      phoneNumber: guest?.phoneNumber || '',
      assistance: guest?.assistance ?? 0,
      escorts: guest?.escorts || 0,
      personalMessage: guest?.personalMessage || '',
      notes: guest?.notes || ''
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
              <Label htmlFor="phoneNumber">
                Teléfono
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder={isViewMode ? undefined : "+521234567890"}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assistance">
                Asistencia
              </Label>
              {isViewMode ? (
                <div className="h-10 flex items-center">
                  <Badge 
                    variant={
                      formData.assistance === 1 ? 'default' : 
                      formData.assistance === 2 ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {formData.assistance === 1 ? 'Confirmado' : formData.assistance === 2 ? 'No asistirá' : 'Sin confirmar'}
                  </Badge>
                </div>
              ) : (
                <Select value={formData.assistance.toString()} onValueChange={(value) => setFormData({ ...formData, assistance: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin confirmar</SelectItem>
                    <SelectItem value="1">Confirmado</SelectItem>
                    <SelectItem value="2">No asistirá</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="escorts">
                Acompañantes
              </Label>
              <Input
                id="escorts"
                type="number"
                min="0"
                value={formData.escorts}
                onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, escorts: parseInt(e.target.value) || 0 })}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalMessage">
              Mensaje Personal
            </Label>
            <Textarea
              id="personalMessage"
              value={formData.personalMessage}
              onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, personalMessage: e.target.value })}
              placeholder={isViewMode ? undefined : "Mensaje personal opcional..."}
              className={isViewMode ? "min-h-[80px] resize-none" : "min-h-[80px] resize-y"}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notas
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={isViewMode ? undefined : (e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={isViewMode ? undefined : "Notas sobre el invitado..."}
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