import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, MoreHorizontal } from '@/components/DataTable';
import { EventDto } from '@/types/event';
import * as eventsService from '@/services/eventsService';
import { useToast } from '@/hooks/use-toast';

const Events = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 25,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsService.getEventsPage({
        keyword: searchKeyword,
        dateInit: '2025-01-01',
        dateEnd: '2026-12-31',
        sortBy,
        order,
        page: pagination.page,
        size: pagination.size,
      });
      setEvents(response.content);
      setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los eventos',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [pagination.page, pagination.size, searchKeyword, sortBy, order]);

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await eventsService.deleteEvent(eventId);
      toast({
        title: "Éxito",
        description: response || "Evento Borrado Exitosamente"
      });
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el evento',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<EventDto>[] = useMemo(() => {
    const baseColumns: ColumnDef<EventDto>[] = [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => {
          const id = row.getValue('id') as string;
          const truncatedId = `${id.slice(0, 8)}...`;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-mono text-xs cursor-help">{truncatedId}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-mono">{id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Fecha',
        size: 120,
        minSize: 120,
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">{row.getValue('date')}</span>
        ),
      },
      {
        accessorKey: 'time',
        header: 'Hora',
        cell: ({ row }) => {
          const time = row.getValue('time') as string;
          return (
            <span className="font-medium">{time || '—'}</span>
          );
        },
      },
      {
        accessorKey: 'title',
        header: 'Titulo',
        size: 200,
        minSize: 200,
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue('title')}</span>
        ),
      },
      {
        accessorKey: 'notificationEmails',
        header: 'Correos',
        cell: ({ row }) => {
          const emails = row.getValue('notificationEmails') as string[];
          if (emails.length === 0) {
            return <span className="text-muted-foreground text-sm">—</span>;
          }
          return (
            <div className="max-w-[250px] overflow-x-auto">
              <div className="flex gap-1 min-w-max pb-1">
                {emails.map((email, index) => (
                  <Badge key={index} variant="outline" className="text-xs whitespace-nowrap">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: '_packageDto.title',
        header: 'Paquete',
        cell: ({ row }) => {
          const pkg = row.original._packageDto;
          return (
            <Badge variant="default">
              {pkg.title}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'eventGroupDto.title',
        header: 'Tipo de Evento',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.eventGroupDto.title}</Badge>
        ),
      },
    ];

    // Add Owner Name column only for ADMIN
    if (profile === 'ADMIN') {
      baseColumns.push({
        accessorKey: 'userDto.person.name',
        header: 'Cliente',
        cell: ({ row }) => {
          const user = row.original.userDto;
          return (
            <span className="font-medium">
              {user.person.name} {user.person.paternalSurname}
            </span>
          );
        },
      });
    }

    // Add Actions column
    baseColumns.push({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gradient-card backdrop-blur-lg border-border/50">
               <DropdownMenuItem onClick={() => handleViewEvent(event.id)}>
                 <Eye className="mr-2 h-4 w-4" />
                 Ver
                </DropdownMenuItem>
               {profile === 'ADMIN' && (
                 <DropdownMenuItem onClick={() => navigate(`/events/${event.id}/edit`)}>
                   <Edit className="mr-2 h-4 w-4" />
                   Actualizar
                 </DropdownMenuItem>
               )}
              {profile === 'ADMIN' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Borrar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gradient-card backdrop-blur-lg border-border/50">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el evento
                        "{event.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                        Borrar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });

    return baseColumns;
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={events}
              searchPlaceholder="Buscar..."
              onGlobalFilterChange={setSearchKeyword}
              isLoading={loading}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onPageSizeChange={(size) => setPagination(prev => ({ ...prev, page: 0, size }))}
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
              currentPageSize={pagination.size}
              actionButton={
                profile === 'ADMIN' ? (
                  <Button 
                    onClick={() => navigate('/events/new/edit')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Evento
                  </Button>
                ) : undefined
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;
