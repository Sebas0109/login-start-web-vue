import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { GuestModal } from "@/components/GuestModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, UserCheck, UserX, UserMinus } from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { Guest } from '@/data/mockData';
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, updateEvent, updateGuest, deleteGuest } = useMockData();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('edit');

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">Evento No Encontrado</h1>
              <p className="text-muted-foreground">El evento que buscas no existe.</p>
              <Button onClick={() => navigate('/events')} className="mt-4">
                Volver a Eventos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const kpis = useMemo(() => {
    const totalInvited = event.guests.length;
    const totalConfirmed = event.guests.filter(g => g.assistance === 'Confirmed').length;
    const totalCancelled = event.guests.filter(g => g.assistance === 'Cancelled' || g.assistance === 'Not coming').length;
    const totalNoResponse = totalInvited - totalConfirmed - totalCancelled;

    return {
      totalInvited,
      totalConfirmed,
      totalCancelled,
      totalNoResponse
    };
  }, [event.guests]);

  const filteredGuests = useMemo(() => {
    if (!searchValue) return event.guests;
    
    const searchLower = searchValue.toLowerCase();
    return event.guests.filter(guest => 
      guest.name.toLowerCase().includes(searchLower) ||
      guest.paternalSurname.toLowerCase().includes(searchLower) ||
      guest.maternalSurname.toLowerCase().includes(searchLower) ||
      `${guest.stateCode} ${guest.phone}`.includes(searchLower)
    );
  }, [event.guests, searchValue]);

  const handleViewGuest = (guestId: string) => {
    const guest = event.guests.find(g => g.id === guestId);
    if (guest) {
      setSelectedGuest(guest);
      setModalMode('view');
      setIsAddingGuest(false);
      setIsGuestModalOpen(true);
    }
  };

  const handleUpdateGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setModalMode('edit');
    setIsAddingGuest(false);
    setIsGuestModalOpen(true);
  };

  const handleAddGuest = () => {
    setSelectedGuest(null);
    setModalMode('edit');
    setIsAddingGuest(true);
    setIsGuestModalOpen(true);
  };

  const handleDeleteGuest = (guest: Guest) => {
    setGuestToDelete(guest);
  };

  const confirmDeleteGuest = () => {
    if (guestToDelete && id) {
      deleteGuest(id, guestToDelete.id);
      toast({
        title: "Éxito",
        description: "Invitado eliminado exitosamente"
      });
      setGuestToDelete(null);
    }
  };

  const handleSaveGuest = (guestData: Partial<Guest>) => {
    if (isAddingGuest && id) {
      // Add new guest
      const newGuest: Guest = {
        id: crypto.randomUUID(),
        name: guestData.name || '',
        paternalSurname: guestData.paternalSurname || '',
        maternalSurname: guestData.maternalSurname || '',
        stateCode: guestData.stateCode || '55',
        phone: guestData.phone || '',
        escortCount: guestData.escortCount || 0,
        assistance: guestData.assistance || 'Pending',
        confirmationEmailSent: false,
        personalMessage: guestData.personalMessage || ''
      };
      
      // Add guest to the event
      const updatedEvent = {
        ...event,
        guests: [...event.guests, newGuest]
      };
      updateEvent(event.id, { guests: updatedEvent.guests });
      
      toast({
        title: "Invitado agregado",
        description: "El invitado ha sido agregado exitosamente.",
      });
    } else if (selectedGuest && id) {
      updateGuest(id, selectedGuest.id, guestData);
      toast({
        title: "Invitado actualizado",
        description: "La información del invitado ha sido actualizada exitosamente.",
      });
    }
    setIsGuestModalOpen(false);
    setSelectedGuest(null);
    setIsAddingGuest(false);
  };

  const columns: ColumnDef<Guest>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div 
          className="font-mono text-xs truncate max-w-[100px] cursor-help" 
          title={row.getValue('id')}
        >
          {row.getValue('id')}
        </div>
      ),
    },
    {
      accessorKey: 'assistance',
      header: 'Asistencia',
      cell: ({ row }) => {
        const assistance = row.getValue('assistance') as string;
        const spanishAssistance = {
          'Confirmed': 'Confirmado',
          'Cancelled': 'Cancelado', 
          'Pending': 'Pendiente',
          'Not coming': 'No asistirá'
        }[assistance] || assistance;
        return (
          <Badge 
            variant={
              assistance === 'Confirmed' ? 'default' : 
              assistance === 'Cancelled' || assistance === 'Not coming' ? 'destructive' : 
              'secondary'
            }
          >
            {spanishAssistance}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'paternalSurname',
      header: 'Apellido Paterno',
    },
    {
      accessorKey: 'maternalSurname',
      header: 'Apellido Materno',
    },
    {
      accessorKey: 'phone',
      header: 'Telefono',
      cell: ({ row }) => {
        const guest = row.original;
        return `${guest.stateCode} ${guest.phone}`;
      },
    },
    {
      accessorKey: 'escortCount',
      header: 'Escorts',
    },
    {
      accessorKey: 'confirmationEmailSent',
      header: 'Confirmacion',
      cell: ({ row }) => (
        <span>{row.getValue('confirmationEmailSent') ? 'Sí' : 'No'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const guest = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewGuest(guest.id)}>
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateGuest(guest)}>
                Actualizar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDeleteGuest(guest)}
              >
                Borrar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const kpiCards = [
    {
      title: "Total Invitados",
      value: kpis.totalInvited,
      icon: Users
    },
    {
      title: "Total Confirmados",
      value: kpis.totalConfirmed,
      icon: UserCheck
    },
    {
      title: "Total Cancelados",
      value: kpis.totalCancelled,
      icon: UserX
    },
    {
      title: "Total Sin Respuesta",
      value: kpis.totalNoResponse,
      icon: UserMinus
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{event.name}</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="bg-gradient-card backdrop-blur-lg border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                    <div className="text-sm text-muted-foreground">{kpi.title}</div>
                  </div>
                  <kpi.icon className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Event Meta */}
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span><strong>Slug:</strong> {event.slug}</span>
              <span><strong>Fecha:</strong> {format(new Date(event.date), 'yyyy-MM-dd')}</span>
              <span><strong>Paquete:</strong> {event.package}</span>
              <span><strong>Tipo de Evento:</strong> {event.eventGroup}</span>
            </div>
          </CardContent>
        </Card>

        {/* Guests Table */}
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Invitados</CardTitle>
              <Button onClick={handleAddGuest}>
                Agregar Invitado
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={filteredGuests}
              searchPlaceholder="Buscar..."
            />
          </CardContent>
        </Card>

        {/* Guest Modal */}
        <GuestModal
          isOpen={isGuestModalOpen}
          onClose={() => {
            setIsGuestModalOpen(false);
            setSelectedGuest(null);
            setIsAddingGuest(false);
            setModalMode('edit');
          }}
          guest={selectedGuest}
          onSave={modalMode === 'view' ? undefined : handleSaveGuest}
          isAdding={isAddingGuest}
          mode={modalMode}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!guestToDelete} onOpenChange={() => setGuestToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar Invitado</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que quieres eliminar a {guestToDelete?.name} {guestToDelete?.paternalSurname}? 
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteGuest} className="bg-destructive hover:bg-destructive/90">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EventDetail;