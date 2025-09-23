import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMockData } from '@/hooks/useMockData';
import { mockEventGroups, mockGuestTypes, mockAddons, mockUsers } from '@/data/mockData';

const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.date(),
  time: z.string().min(1, 'Time is required'),
  package: z.enum(['classic', 'premium', 'silver']),
  eventGroup: z.string().min(1, 'Event group is required'),
  guestType: z.string().min(1, 'Guest type is required'),
  ownerUserId: z.string().min(1, 'Owner is required'),
  escortLimit: z.number().min(0, 'Escort limit must be 0 or greater'),
  guestLimit: z.number().min(0, 'Guest limit must be 0 or greater'),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, updateEvent } = useMockData();
  
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');

  const event = events.find(e => e.id === id);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      date: new Date(),
      time: '',
      package: 'classic',
      eventGroup: '',
      guestType: '',
      ownerUserId: '',
      escortLimit: 0,
      guestLimit: 0,
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title || event.name,
        date: new Date(event.date),
        time: event.time || '',
        package: event.package,
        eventGroup: event.eventGroup,
        guestType: event.guestType || '',
        ownerUserId: event.ownerUserId || '',
        escortLimit: event.escortLimit || 0,
        guestLimit: event.guestLimit || 0,
      });
      setEmails(event.ownerEmails || []);
      setSelectedAddons(event.addons || []);
    }
  }, [event, form]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    
    if (!trimmedEmail) {
      setEmailError('Email cannot be empty');
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (emails.includes(trimmedEmail)) {
      setEmailError('Email already added');
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setEmailInput('');
    setEmailError('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const onSubmit = (data: EventFormData) => {
    if (!event) return;

    const selectedOwner = mockUsers.find(user => user.id === data.ownerUserId);
    
    updateEvent(event.id, {
      title: data.title,
      name: data.title,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      package: data.package,
      eventGroup: data.eventGroup,
      guestType: data.guestType,
      ownerUserId: data.ownerUserId,
      ownerName: selectedOwner?.name || '',
      ownerEmails: emails,
      addons: selectedAddons,
      escortLimit: data.escortLimit,
      guestLimit: data.guestLimit,
    });

    toast({
      title: 'Event updated',
      description: 'The event has been successfully updated.',
    });

    navigate('/events');
  };

  const handleCancel = () => {
    navigate('/events');
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-secondary p-6 flex items-center justify-center">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Event not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Edit Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* UUID (Read-only) */}
                <div className="md:col-span-2">
                  <Label htmlFor="uuid">Event ID</Label>
                  <Input
                    id="uuid"
                    value={event.id}
                    disabled
                    className="font-mono text-xs bg-muted"
                  />
                </div>

                {/* Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Enter event title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <Label>Date *</Label>
                  <Controller
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.date.message}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    {...form.register('time')}
                  />
                  {form.formState.errors.time && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.time.message}</p>
                  )}
                </div>

                {/* Package */}
                <div>
                  <Label>Package *</Label>
                  <Controller
                    name="package"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.package && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.package.message}</p>
                  )}
                </div>

                {/* Event Group */}
                <div>
                  <Label>Event Group *</Label>
                  <Controller
                    name="eventGroup"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event group" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEventGroups.map(group => (
                            <SelectItem key={group.id} value={group.name.toLowerCase()}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.eventGroup && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.eventGroup.message}</p>
                  )}
                </div>

                {/* Guest Type */}
                <div>
                  <Label>Guest Type *</Label>
                  <Controller
                    name="guestType"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guest type" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGuestTypes.map(type => (
                            <SelectItem key={type.id} value={type.name.toLowerCase()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.guestType && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.guestType.message}</p>
                  )}
                </div>

                {/* Owner */}
                <div>
                  <Label>Owner *</Label>
                  <Controller
                    name="ownerUserId"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.ownerUserId && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.ownerUserId.message}</p>
                  )}
                </div>

                {/* Escort Limit */}
                <div>
                  <Label htmlFor="escortLimit">Escort Limit</Label>
                  <Input
                    id="escortLimit"
                    type="number"
                    min="0"
                    {...form.register('escortLimit', { valueAsNumber: true })}
                  />
                  {form.formState.errors.escortLimit && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.escortLimit.message}</p>
                  )}
                </div>

                {/* Guest Limit */}
                <div>
                  <Label htmlFor="guestLimit">Guest Limit</Label>
                  <Input
                    id="guestLimit"
                    type="number"
                    min="0"
                    {...form.register('guestLimit', { valueAsNumber: true })}
                  />
                  {form.formState.errors.guestLimit && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.guestLimit.message}</p>
                  )}
                </div>

                {/* Owner Emails */}
                <div className="md:col-span-2">
                  <Label htmlFor="emailInput">Owner Emails</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="emailInput"
                        type="email"
                        placeholder="Enter email address"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setEmailError('');
                        }}
                        onKeyPress={handleKeyPress}
                        className={emailError ? 'border-destructive' : ''}
                      />
                      <Button type="button" onClick={handleAddEmail}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {emailError && (
                      <p className="text-sm text-destructive">{emailError}</p>
                    )}
                    {emails.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {emails.map((email, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Addons */}
                <div className="md:col-span-2">
                  <Label>Add-ons</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {mockAddons.map(addon => (
                      <div
                        key={addon.id}
                        className={cn(
                          "p-3 border rounded-md cursor-pointer transition-colors",
                          selectedAddons.includes(addon.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="text-sm font-medium">{addon.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{addon.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventEdit;