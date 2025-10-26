import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteEvent } from '@/services/calendarService';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  ownerName?: string;
  package?: string;
  eventGroup?: string;
}

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onRefresh }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!event) return null;

  const handleView = () => {
    onClose();
    navigate(`/events/${event.id}`);
  };

  const handleUpdate = () => {
    onClose();
    navigate(`/events/${event.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteEvent(event.id);
      toast({
        title: 'Éxito',
        description: response || 'Evento Borrado Exitosamente'
      });
      setShowDeleteDialog(false);
      onClose();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'No se pudo borrar el evento',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getPackageBadgeColor = (packageType: string) => {
    switch (packageType) {
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'classic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-card backdrop-blur-lg border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Detalles del Evento
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(event.date), 'EEEE, d MMMM yyyy', { locale: es })} a las {event.time}
              </p>
            </div>

            {profile === 'ADMIN' && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Cliente</p>
                <p className="text-sm text-muted-foreground">{event.ownerName}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge className={getPackageBadgeColor(event.package)}>
                {event.package}
              </Badge>
              <Badge variant="outline">{event.eventGroup}</Badge>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleView}
                className="flex-1"
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              
              {profile === 'ADMIN' && (
                <>
                  <Button
                    onClick={handleUpdate}
                    className="flex-1"
                    variant="default"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                  
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    className="flex-1"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Borrar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el evento "{event.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? 'Borrando...' : 'Borrar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventModal;