import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as eventsService from '@/services/eventsService';
import { catalogsService } from '@/services/catalogsService';
import { usersService } from '@/services/usersService';
import type { EventDto, CreateEventPayload, UpdateEventPayload } from '@/types/event';
import type { CatalogElement, Addon } from '@/types/catalog';
import type { SelectClient } from '@/types/user';

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    slugs: [''],
    userId: 0,
    eventGroupId: 0,
    packageId: 0,
    addonIds: [] as number[],
    guestTypeId: 0,
    notificationEmails: [] as string[],
    limitGuests: 0,
    escortsLimit: 0,
  });

  // Catalog data
  const [packages, setPackages] = useState<CatalogElement[]>([]);
  const [eventGroups, setEventGroups] = useState<CatalogElement[]>([]);
  const [guestTypes, setGuestTypes] = useState<CatalogElement[]>([]);
  const [addons, setAddons] = useState<CatalogElement[]>([]);
  const [clients, setClients] = useState<SelectClient[]>([]);

  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [existingSlugs, setExistingSlugs] = useState<{ id: number; slug: string }[]>([]);

  // Load catalog data on mount
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [pkgs, evtGroups, gstTypes, adds, cls] = await Promise.all([
          catalogsService.getCatalogSelect('package'),
          catalogsService.getCatalogSelect('eventGroup'),
          catalogsService.getCatalogSelect('guestType'),
          catalogsService.getCatalogSelect('addon'),
          usersService.getSelectClients(),
        ]);
        setPackages(pkgs);
        setEventGroups(evtGroups);
        setGuestTypes(gstTypes);
        setAddons(adds);
        setClients(cls);
      } catch (error) {
        console.error('Error loading catalogs:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los catálogos',
          variant: 'destructive',
        });
      }
    };
    loadCatalogs();
  }, [toast]);

  // Load event data if editing
  useEffect(() => {
    const loadEvent = async () => {
      if (id && id !== 'new') {
        setLoading(true);
        try {
          const event = await eventsService.getEventById(id);
          setFormData({
            title: event.title,
            date: event.date,
            time: event.time,
            slugs: event.slugs.map(s => s.slug),
            userId: event.userDto.id,
            eventGroupId: event.eventGroupDto.id,
            packageId: event._packageDto.id,
            addonIds: event.addons.map(a => a.id),
            guestTypeId: event.guestTypeDto?.id || 0,
            notificationEmails: event.notificationEmails,
            limitGuests: event.limitGuests,
            escortsLimit: event.escortsLimit,
          });
          setExistingSlugs(event.slugs);
          setSelectedDate(new Date(event.date));
        } catch (error) {
          console.error('Error loading event:', error);
          toast({
            title: 'Error',
            description: 'No se pudo cargar el evento',
            variant: 'destructive',
          });
          navigate('/events');
        } finally {
          setLoading(false);
        }
      }
    };
    loadEvent();
  }, [id, navigate, toast]);

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

    if (formData.notificationEmails.includes(trimmedEmail)) {
      setEmailError('Correo ya agregado');
      return;
    }

    setFormData(prev => ({
      ...prev,
      notificationEmails: [...prev.notificationEmails, trimmedEmail]
    }));
    setEmailInput('');
    setEmailError('');
  };

  const removeEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      notificationEmails: prev.notificationEmails.filter(email => email !== emailToRemove)
    }));
  };

  const toggleAddon = (addonId: number) => {
    setFormData(prev => ({
      ...prev,
      addonIds: prev.addonIds.includes(addonId)
        ? prev.addonIds.filter(id => id !== addonId)
        : [...prev.addonIds, addonId]
    }));
  };

  const addSlug = () => {
    setFormData(prev => ({
      ...prev,
      slugs: [...prev.slugs, '']
    }));
  };

  const removeSlug = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slugs: prev.slugs.filter((_, i) => i !== index)
    }));
  };

  const updateSlug = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      slugs: prev.slugs.map((slug, i) => i === index ? value : slug)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'El título del evento es requerido';
    if (formData.slugs.some(s => !s.trim())) newErrors.slugs = 'Todos los slugs son requeridos';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (!formData.time) newErrors.time = 'La hora es requerida';
    if (!formData.packageId) newErrors.packageId = 'El paquete es requerido';
    if (!formData.eventGroupId) newErrors.eventGroupId = 'El tipo de evento es requerido';
    if (!formData.userId) newErrors.userId = 'El propietario es requerido';
    if (formData.escortsLimit < 0) newErrors.escortsLimit = 'El límite de acompañantes debe ser 0 o mayor';
    if (formData.limitGuests < 0) newErrors.limitGuests = 'El límite de invitados debe ser 0 o mayor';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (id === 'new') {
        const payload: CreateEventPayload = {
          title: formData.title,
          date: formData.date,
          time: formData.time,
          slugs: formData.slugs.map(slug => ({ slug })),
          userId: formData.userId,
          eventGroupId: formData.eventGroupId,
          packageId: formData.packageId,
          addonIds: formData.addonIds,
          guestTypeId: formData.guestTypeId,
          notificationEmails: formData.notificationEmails,
          limitGuests: formData.limitGuests,
          escortsLimit: formData.escortsLimit,
        };
        await eventsService.createEvent(payload);
        toast({
          title: 'Éxito',
          description: 'Evento creado correctamente.',
        });
      } else {
        const payload: UpdateEventPayload = {
          id: id!,
          title: formData.title,
          date: formData.date,
          time: formData.time,
          slugs: formData.slugs.map((slug, index) => {
            const existing = existingSlugs[index];
            return existing ? { id: existing.id, slug } : { id: 0, slug };
          }),
          userId: formData.userId,
          eventGroupId: formData.eventGroupId,
          packageId: formData.packageId,
          addonIds: formData.addonIds,
          guestTypeId: formData.guestTypeId,
          notificationEmails: formData.notificationEmails,
          limitGuests: formData.limitGuests,
          escortsLimit: formData.escortsLimit,
        };
        await eventsService.updateEvent(payload);
        toast({
          title: 'Éxito',
          description: 'Evento actualizado correctamente.',
        });
      }
      navigate('/events');
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el evento',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  if (loading && id !== 'new') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p>Cargando evento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{id === 'new' ? 'Crear Evento' : 'Editar Evento'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Slugs */}
          <div className="space-y-2">
            <Label>Slugs *</Label>
            {formData.slugs.map((slug, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={slug}
                  onChange={(e) => updateSlug(index, e.target.value)}
                  placeholder="e.g., mary_sweet_sixteen_party"
                  className={errors.slugs ? 'border-destructive' : ''}
                />
                {formData.slugs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSlug(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSlug}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Slug
            </Button>
            {errors.slugs && <p className="text-sm text-destructive">{errors.slugs}</p>}
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
              <Label htmlFor="escortsLimit">Límite de acompañantes</Label>
              <Input
                id="escortsLimit"
                type="number"
                min="0"
                value={formData.escortsLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, escortsLimit: parseInt(e.target.value) || 0 }))}
                className={errors.escortsLimit ? 'border-destructive' : ''}
              />
              {errors.escortsLimit && <p className="text-sm text-destructive">{errors.escortsLimit}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitGuests">Límite de invitados</Label>
              <Input
                id="limitGuests"
                type="number"
                min="0"
                value={formData.limitGuests}
                onChange={(e) => setFormData(prev => ({ ...prev, limitGuests: parseInt(e.target.value) || 0 }))}
                className={errors.limitGuests ? 'border-destructive' : ''}
              />
              {errors.limitGuests && <p className="text-sm text-destructive">{errors.limitGuests}</p>}
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
            
            {formData.notificationEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.notificationEmails.map((email, index) => (
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
              value={formData.packageId?.toString() || ''} 
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, packageId: parseInt(value) }))
              }
            >
              <SelectTrigger className={errors.packageId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar paquete" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    {pkg.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.packageId && <p className="text-sm text-destructive">{errors.packageId}</p>}
          </div>

          {/* Event Group */}
          <div className="space-y-2">
            <Label>Tipo de evento *</Label>
            <Select 
              value={formData.eventGroupId?.toString() || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, eventGroupId: parseInt(value) }))}
            >
              <SelectTrigger className={errors.eventGroupId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                {eventGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventGroupId && <p className="text-sm text-destructive">{errors.eventGroupId}</p>}
          </div>

          {/* Guest Type */}
          <div className="space-y-2">
            <Label>Tipo de invitado</Label>
            <Select 
              value={formData.guestTypeId?.toString() || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, guestTypeId: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de invitado" />
              </SelectTrigger>
              <SelectContent>
                {guestTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label>Propietario *</Label>
            <Select 
              value={formData.userId?.toString() || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, userId: parseInt(value) }))}
            >
              <SelectTrigger className={errors.userId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar propietario" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && <p className="text-sm text-destructive">{errors.userId}</p>}
          </div>

          {/* Addons */}
          <div className="space-y-2">
            <Label>Extras</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {addons.map((addon) => {
                const addonTyped = addon as Addon;
                return (
                  <div
                    key={addon.id}
                    className={cn(
                      "flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors",
                      formData.addonIds.includes(addon.id)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    )}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <span className="text-lg">{addonTyped.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{addon.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {formData.addonIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.addonIds.map((addonId) => {
                  const addon = addons.find(a => a.id === addonId);
                  if (!addon) return null;
                  const addonTyped = addon as Addon;
                  return (
                    <Badge key={addonId} variant="secondary" className="flex items-center gap-1">
                      <span>{addonTyped.icon}</span>
                      {addon.title}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddon(addonId);
                        }}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1" disabled={loading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventEdit;