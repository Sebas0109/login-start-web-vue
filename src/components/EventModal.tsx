import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import { X, Eye, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { Event } from '@/data/mockData';
import { useMockData } from '@/hooks/useMockData';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const { currentRole } = useOutletContext<{ currentRole: 'ADMIN' | 'CLIENT' }>();
  const navigate = useNavigate();
  const { deleteEvent } = useMockData();

  if (!event) return null;

  const handleView = () => {
    navigate(`/events/${event.id}`);
    onClose();
  };

  const handleUpdate = () => {
    navigate(`/events/${event.id}/edit`);
    onClose();
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    onClose();
  };

  const packageColors = {
    classic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    silver: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-card backdrop-blur-lg border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground pr-8">
            {event.title || event.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
            <p className="text-foreground">
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
              {event.time && ` at ${event.time}`}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Owner</label>
            <p className="text-foreground">{event.ownerName}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Package</label>
            <div className="mt-1">
              <Badge className={packageColors[event.package]}>
                {event.package}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Event Group</label>
            <div className="mt-1">
              <Badge variant="outline">{event.eventGroup}</Badge>
            </div>
          </div>

          {event.guestLimit && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Guest Limit</label>
              <p className="text-foreground">{event.guestLimit} guests</p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          
          {currentRole === 'ADMIN' && (
            <>
              <Button variant="secondary" onClick={handleUpdate}>
                <Edit className="mr-2 h-4 w-4" />
                Update
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-card backdrop-blur-lg border-border/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event
                      "{event.title || event.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};