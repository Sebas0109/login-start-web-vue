import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import { X, Eye, Edit, Trash2 } from 'lucide-react';
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
import { Event } from '@/data/mockData';
import { useMockData } from '@/hooks/useMockData';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentRole } = useOutletContext<{ currentRole: 'ADMIN' | 'CLIENT' }>();
  const { deleteEvent } = useMockData();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  if (!event) return null;

  const handleView = () => {
    onClose();
    navigate(`/events/${event.id}`);
  };

  const handleUpdate = () => {
    onClose();
    navigate(`/events/${event.id}/edit`);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    setShowDeleteDialog(false);
    onClose();
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
              Event Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {event.time}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-1">Owner</p>
              <p className="text-sm text-muted-foreground">{event.ownerName}</p>
            </div>

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
                View
              </Button>
              
              {currentRole === 'ADMIN' && (
                <>
                  <Button
                    onClick={handleUpdate}
                    className="flex-1"
                    variant="default"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                  
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    className="flex-1"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event "{event.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventModal;