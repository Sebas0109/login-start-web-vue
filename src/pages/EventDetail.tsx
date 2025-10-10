import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { GuestModal } from "@/components/GuestModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, UserCheck, UserX, UserMinus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { EventStats, Guest, CreateGuestPayload, UpdateGuestPayload } from '@/types/eventDetail';
import {
  getEventStats,
  getEventGuestsPage,
  createGuest as createGuestApi,
  updateGuest as updateGuestApi,
  deleteGuest as deleteGuestApi,
  getGuest,
} from '@/services/eventDetailService';
import { Skeleton } from '@/components/ui/skeleton';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<EventStats | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('edit');

  // Load stats
  useEffect(() => {
    if (!id) return;

    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const data = await getEventStats(id);
        setStats(data);
      } catch (error: any) {
        console.error('Error loading event stats:', error);
        setStatsError(error.message || 'Error al cargar las estadísticas del evento');
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las estadísticas del evento',
          variant: 'destructive',
        });
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [id, toast]);

  // Load guests table
  const loadGuests = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getEventGuestsPage(id, {
        keyword: keyword || undefined,
        sortBy,
        order,
        page: currentPage,
        size: pageSize,
      });
      setGuests(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error('Error loading guests:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los invitados',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [id, currentPage, pageSize, sortBy, order, keyword]);

  const handleViewGuest = async (guestId: string) => {
    if (!id) return;
    try {
      const guest = await getGuest(id, guestId);
      setSelectedGuest(guest);
      setModalMode('view');
      setIsAddingGuest(false);
      setIsGuestModalOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el invitado',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateGuest = async (guestId: string) => {
    if (!id) return;
    try {
      const guest = await getGuest(id, guestId);
      setSelectedGuest(guest);
      setModalMode('edit');
      setIsAddingGuest(false);
      setIsGuestModalOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el invitado',
        variant: 'destructive',
      });
    }
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

  const confirmDeleteGuest = async () => {
    if (!guestToDelete || !id) return;

    try {
      const message = await deleteGuestApi(id, guestToDelete.id);
      toast({
        title: 'Éxito',
        description: message || 'Invitado Borrado Exitosamente',
      });
      setGuestToDelete(null);
      loadGuests();
      // Refresh stats after deletion
      const newStats = await getEventStats(id);
      setStats(newStats);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el invitado',
        variant: 'destructive',
      });
    }
  };

  const handleSaveGuest = async (guestData: CreateGuestPayload | UpdateGuestPayload) => {
    if (!id) return;

    try {
      if (isAddingGuest) {
        await createGuestApi(id, guestData as CreateGuestPayload);
        toast({
          title: 'Éxito',
          description: 'Invitado creado correctamente.',
        });
      } else if (selectedGuest) {
        await updateGuestApi(id, selectedGuest.id, guestData as UpdateGuestPayload);
        toast({
          title: 'Éxito',
          description: 'Invitado actualizado correctamente.',
        });
      }
      setIsGuestModalOpen(false);
      setSelectedGuest(null);
      setIsAddingGuest(false);
      loadGuests();
      // Refresh stats after add/update
      const newStats = await getEventStats(id);
      setStats(newStats);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar el invitado',
        variant: 'destructive',
      });
    }
  };

  const getAssistanceLabel = (assistance: number): { label: string; variant: 'default' | 'destructive' | 'secondary' } => {
    switch (assistance) {
      case 1:
        return { label: 'Confirmado', variant: 'default' };
      case 2:
        return { label: 'No asistirá', variant: 'destructive' };
      case 0:
      default:
        return { label: 'Sin confirmar', variant: 'secondary' };
    }
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
        const assistance = row.getValue('assistance') as number;
        const { label, variant } = getAssistanceLabel(assistance);
        return <Badge variant={variant}>{label}</Badge>;
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
      accessorKey: 'phoneNumber',
      header: 'Teléfono',
    },
    {
      accessorKey: 'escorts',
      header: 'Acompañantes',
    },
    {
      accessorKey: 'notes',
      header: 'Notas',
      cell: ({ row }) => {
        const notes = row.getValue('notes') as string;
        return (
          <div className="max-w-[200px] truncate" title={notes}>
            {notes || '-'}
          </div>
        );
      },
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
              <DropdownMenuItem onClick={() => handleUpdateGuest(guest.id)}>
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

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">ID de Evento No Válido</h1>
              <Button onClick={() => navigate('/events')}>
                Volver a Eventos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Invitados",
      value: stats?.totalGuests ?? 0,
      icon: Users,
      loading: statsLoading,
    },
    {
      title: "Total Confirmados",
      value: stats?.totalAssisting ?? 0,
      icon: UserCheck,
      loading: statsLoading,
    },
    {
      title: "Total No Asistirán",
      value: stats?.totalNotAssisting ?? 0,
      icon: UserX,
      loading: statsLoading,
    },
    {
      title: "Total Sin Confirmar",
      value: stats?.totalUnconfirmed ?? 0,
      icon: UserMinus,
      loading: statsLoading,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          {statsLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <h1 className="text-3xl font-bold text-foreground mb-2">{stats?.title || 'Evento'}</h1>
          )}
        </div>

        {/* Error banner for stats */}
        {statsError && (
          <Card className="bg-destructive/10 border-destructive/50">
            <CardContent className="p-4">
              <p className="text-destructive text-sm">{statsError}</p>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="bg-gradient-card backdrop-blur-lg border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    {kpi.loading ? (
                      <>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                        <div className="text-sm text-muted-foreground">{kpi.title}</div>
                      </>
                    )}
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
            {statsLoading ? (
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-44" />
              </div>
            ) : stats ? (
              <div className="flex flex-wrap gap-4 text-sm">
                <span><strong>Fecha:</strong> {format(new Date(stats.date), 'yyyy-MM-dd')}</span>
                <span><strong>Hora:</strong> {stats.time}</span>
                <span><strong>Paquete:</strong> {stats._package.title}</span>
                <span><strong>Tipo de Evento:</strong> {stats.eventGroup.title}</span>
              </div>
            ) : null}
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
              data={guests}
              searchPlaceholder="Buscar..."
              onGlobalFilterChange={setKeyword}
              isLoading={loading}
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
