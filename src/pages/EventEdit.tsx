import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMockData } from '@/hooks/useMockData';
import { Event } from '@/data/mockData';

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, eventGroups, guestTypes, addons, users, updateEvent } = useMockData();

  const [formData, setFormData] = useState<Event>({
    id: '',
    date: '',
    time: '',
    name: '',
    slug: '',
    ownerEmails: [],
    package: 'classic',
    eventGroup: '',
    guestType: '',
    addons: [],
    ownerName: '',
    ownerUserId: '',
    escortLimit: 0,
    guestLimit: 0,
    guests: []
  });

  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const event = events.find(e => e.id === id);
      if (event) {
        setFormData(event);
        setSelectedDate(new Date(event.date));
      } else {
        navigate('/events');
      }
    }
  }, [id, events, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    const trimmedEmail = emailInput.trim();
    
    if (!trimmedEmail) {
      setEmailError('El correo es requerido');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError('Formato de correo inválido');
      return;
    }

    if (formData.ownerEmails.includes(trimmedEmail)) {
      setEmailError('Correo ya agregado');
      return;
    }

    setFormData(prev => ({
      ...prev,
      ownerEmails: [...prev.ownerEmails, trimmedEmail]
    }));
    setEmailInput('');
    setEmailError('');
  };

  const removeEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      ownerEmails: prev.ownerEmails.filter(email => email !== emailToRemove)
    }));
  };

  const toggleAddon = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(id => id !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El título del evento es requerido';
    if (!formData.slug.trim()) newErrors.slug = 'El slug es requerido';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (!formData.package) newErrors.package = 'El paquete es requerido';
    if (!formData.eventGroup) newErrors.eventGroup = 'El tipo de evento es requerido';
    if (!formData.ownerUserId) newErrors.ownerUserId = 'El propietario es requerido';
    if (formData.escortLimit < 0) newErrors.escortLimit = 'El límite de acompañantes debe ser 0 o mayor';
    if (formData.guestLimit < 0) newErrors.guestLimit = 'El límite de invitados debe ser 0 o mayor';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    updateEvent(formData.id, formData);
    toast({
      title: 'Éxito',
      description: 'Evento actualizado exitosamente',
    });
    navigate('/events');
  };

  const handleCancel = () => {
    navigate('/events');
  };

  const handleOwnerChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setFormData(prev => ({
        ...prev,
        ownerUserId: userId,
        ownerName: user.name
      }));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* UUID - Read-only */}
          <div className="space-y-2">
            <Label htmlFor="uuid">UUID</Label>
            <Input
              id="uuid"
              value={formData.id}
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g., mary_sweet_sixteen_party"
              className={errors.slug ? 'border-destructive' : ''}
            />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      errors.date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="escortLimit">Límite de acompañantes</Label>
              <Input
                id="escortLimit"
                type="number"
                min="0"
                value={formData.escortLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, escortLimit: parseInt(e.target.value) || 0 }))}
                onBlur={() => {
                  if (formData.escortLimit < 0) {
                    setErrors(prev => ({ ...prev, escortLimit: 'Debe ser 0 o mayor' }));
                  } else {
                    setErrors(prev => ({ ...prev, escortLimit: '' }));
                  }
                }}
                className={errors.escortLimit ? 'border-destructive' : ''}
              />
              {errors.escortLimit && <p className="text-sm text-destructive">{errors.escortLimit}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestLimit">Límite de invitados</Label>
              <Input
                id="guestLimit"
                type="number"
                min="0"
                value={formData.guestLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, guestLimit: parseInt(e.target.value) || 0 }))}
                onBlur={() => {
                  if (formData.guestLimit < 0) {
                    setErrors(prev => ({ ...prev, guestLimit: 'Debe ser 0 o mayor' }));
                  } else {
                    setErrors(prev => ({ ...prev, guestLimit: '' }));
                  }
                }}
                className={errors.guestLimit ? 'border-destructive' : ''}
              />
              {errors.guestLimit && <p className="text-sm text-destructive">{errors.guestLimit}</p>}
            </div>
          </div>

          {/* Emails */}
          <div className="space-y-2">
            <Label htmlFor="emailInput">Correos</Label>
            <div className="flex gap-2">
              <Input
                id="emailInput"
                type="email"
                placeholder="Ingresa dirección de correo"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addEmail();
                  }
                }}
                className={emailError ? 'border-destructive' : ''}
              />
              <Button onClick={addEmail} size="sm">
                <Plus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            
            {formData.ownerEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.ownerEmails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeEmail(email)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Package */}
          <div className="space-y-2">
            <Label>Paquete *</Label>
            <Select 
              value={formData.package} 
              onValueChange={(value: 'classic' | 'premium' | 'silver') => 
                setFormData(prev => ({ ...prev, package: value }))
              }
            >
              <SelectTrigger className={errors.package ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar paquete" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Clásico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="silver">Plata</SelectItem>
              </SelectContent>
            </Select>
            {errors.package && <p className="text-sm text-destructive">{errors.package}</p>}
          </div>

          {/* Event Group */}
          <div className="space-y-2">
            <Label>Tipo de evento *</Label>
            <Select 
              value={formData.eventGroup} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, eventGroup: value }))}
            >
              <SelectTrigger className={errors.eventGroup ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                {eventGroups.map((group) => (
                  <SelectItem key={group.id} value={group.name.toLowerCase()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventGroup && <p className="text-sm text-destructive">{errors.eventGroup}</p>}
          </div>

          {/* Guest Type */}
          <div className="space-y-2">
            <Label>Tipo de invitado</Label>
            <Select 
              value={formData.guestType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, guestType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de invitado" />
              </SelectTrigger>
              <SelectContent>
                {guestTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name.toLowerCase().replace(' ', '_')}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label>Propietario *</Label>
            <Select 
              value={formData.ownerUserId} 
              onValueChange={handleOwnerChange}
            >
              <SelectTrigger className={errors.ownerUserId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar propietario" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerUserId && <p className="text-sm text-destructive">{errors.ownerUserId}</p>}
          </div>

          {/* Addons */}
          <div className="space-y-2">
            <Label>Extras</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={cn(
                    "flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors",
                    formData.addons.includes(addon.id)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <span className="text-lg">{addon.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{addon.name}</p>
                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.addons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.addons.map((addonId) => {
                  const addon = addons.find(a => a.id === addonId);
                  return addon ? (
                    <Badge key={addonId} variant="secondary" className="flex items-center gap-1">
                      <span>{addon.image}</span>
                      {addon.name}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddon(addonId);
                        }}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventEdit;