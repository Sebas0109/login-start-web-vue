import React, { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
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
import { useMockData } from '@/hooks/useMockData';
import { Event } from '@/data/mockData';

const Events = () => {
  const { currentRole } = useOutletContext<{ currentRole: 'ADMIN' | 'CLIENT' }>();
  const navigate = useNavigate();
  const { events, deleteEvent } = useMockData();

  const packageColors = {
    classic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    silver: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const columns: ColumnDef<Event>[] = useMemo(() => {
    const baseColumns: ColumnDef<Event>[] = [
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
        header: 'Date',
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue('date')}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Event Name',
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue('name')}</span>
        ),
      },
      {
        accessorKey: 'ownerEmails',
        header: 'Owner Emails',
        cell: ({ row }) => {
          const emails = row.getValue('ownerEmails') as string[];
          if (emails.length === 1) {
            return (
              <div className="max-w-[200px] overflow-x-auto">
                <Badge variant="outline">{emails[0]}</Badge>
              </div>
            );
          }
          if (emails.length <= 2) {
            return (
              <div className="max-w-[200px] overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {emails.map((email, index) => (
                    <Badge key={index} variant="outline" className="text-xs whitespace-nowrap">
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div className="max-w-[200px] overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                <Badge variant="outline" className="text-xs whitespace-nowrap">{emails[0]}</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs cursor-help whitespace-nowrap">
                        +{emails.length - 1} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        {emails.slice(1).map((email, index) => (
                          <p key={index} className="text-xs">{email}</p>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'package',
        header: 'Package',
        cell: ({ row }) => {
          const packageType = row.getValue('package') as string;
          return (
            <Badge className={packageColors[packageType as keyof typeof packageColors]}>
              {packageType}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'eventGroup',
        header: 'Event Group',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('eventGroup')}</Badge>
        ),
      },
    ];

    // Add Owner Name column only for ADMIN
    if (currentRole === 'ADMIN') {
      baseColumns.push({
        accessorKey: 'ownerName',
        header: 'Owner Name',
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue('ownerName')}</span>
        ),
      });
    }

    // Add Actions column
    baseColumns.push({
      id: 'actions',
      header: 'Actions',
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
                 View Event
               </DropdownMenuItem>
               {currentRole === 'ADMIN' && (
                 <DropdownMenuItem onClick={() => navigate(`/events/${event.id}/edit`)}>
                   <Edit className="mr-2 h-4 w-4" />
                   Update Event
                 </DropdownMenuItem>
               )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Event
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-card backdrop-blur-lg border-border/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event
                      "{event.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });

    return baseColumns;
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={events}
              searchPlaceholder="Search events..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;