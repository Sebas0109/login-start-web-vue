import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, MoreHorizontal } from '@/components/DataTable';
import { useMockData } from '@/hooks/useMockData';
import { EventGroup, GuestType, Addon } from '@/data/mockData';

type CatalogType = 'eventGroups' | 'guestTypes' | 'addons';

const Catalogs = () => {
  const { 
    eventGroups, 
    guestTypes, 
    addons, 
    updateEventGroup, 
    deleteEventGroup, 
    updateGuestType, 
    deleteGuestType, 
    updateAddon, 
    deleteAddon 
  } = useMockData();
  
  const [activeTab, setActiveTab] = useState<CatalogType>('eventGroups');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    
    if (activeTab === 'eventGroups') {
      updateEventGroup(editingItem.id, editingItem);
    } else if (activeTab === 'guestTypes') {
      updateGuestType(editingItem.id, editingItem);
    } else if (activeTab === 'addons') {
      updateAddon(editingItem.id, editingItem);
    }
    
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'eventGroups') {
      deleteEventGroup(id);
    } else if (activeTab === 'guestTypes') {
      deleteGuestType(id);
    } else if (activeTab === 'addons') {
      deleteAddon(id);
    }
  };

  const eventGroupColumns: ColumnDef<EventGroup>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('id')?.toString().slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name')}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const group = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gradient-card backdrop-blur-lg border-border/50">
              <DropdownMenuItem onClick={() => handleEdit(group)}>
                <Edit className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-card backdrop-blur-lg border-border/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event group
                      "{group.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(group.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const guestTypeColumns: ColumnDef<GuestType>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('id')?.toString().slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name')}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const guestType = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gradient-card backdrop-blur-lg border-border/50">
              <DropdownMenuItem onClick={() => handleEdit(guestType)}>
                <Edit className="mr-2 h-4 w-4" />
                Actualizar
              </DropdownMenuItem>
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de invitado
                      "{guestType.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(guestType.id)}>
                      Borrar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const addonColumns: ColumnDef<Addon>[] = useMemo(() => [
    {
      accessorKey: 'image',
      header: 'Icono',
      cell: ({ row }) => (
        <div className="text-lg">{row.getValue('image') || '📦'}</div>
      ),
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('id')?.toString().slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name')}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-xs truncate block">
          {row.getValue('description')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const addon = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gradient-card backdrop-blur-lg border-border/50">
              <DropdownMenuItem onClick={() => handleEdit(addon)}>
                <Edit className="mr-2 h-4 w-4" />
                Actualizar
              </DropdownMenuItem>
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el extra
                      "{addon.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(addon.id)}>
                      Borrar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const renderEditDialog = () => {
    if (!editingItem) return null;

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gradient-card backdrop-blur-lg border-border/50">
          <DialogHeader>
            <DialogTitle>
              Editar {activeTab === 'eventGroups' ? 'Tipo de Evento' : 
                    activeTab === 'guestTypes' ? 'Tipo de Invitado' : 'Extra'}
            </DialogTitle>
            <DialogDescription>
              Actualiza los detalles a continuación y haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input
                id="name"
                value={editingItem.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            {activeTab === 'addons' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Descripción</Label>
                  <Textarea
                    id="description"
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">Icono</Label>
                  <Input
                    id="image"
                    value={editingItem.image || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="col-span-3"
                    placeholder="Emoji o icono"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Catálogos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CatalogType)}>
              <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
                <TabsTrigger value="eventGroups">Tipo de Evento</TabsTrigger>
                <TabsTrigger value="guestTypes">Tipo de Invitado</TabsTrigger>
                <TabsTrigger value="addons">Extras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="eventGroups" className="mt-6">
                <DataTable
                  columns={eventGroupColumns}
                  data={eventGroups}
                  searchPlaceholder="Buscar tipos de evento..."
                />
              </TabsContent>
              
              <TabsContent value="guestTypes" className="mt-6">
                <DataTable
                  columns={guestTypeColumns}
                  data={guestTypes}
                  searchPlaceholder="Buscar tipos de invitado..."
                />
              </TabsContent>
              
              <TabsContent value="addons" className="mt-6">
                <DataTable
                  columns={addonColumns}
                  data={addons}
                  searchPlaceholder="Buscar extras..."
                />
              </TabsContent>
            </Tabs>
            
            {renderEditDialog()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Catalogs;