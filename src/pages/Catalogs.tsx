import React, { useState, useMemo, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, MoreHorizontal } from '@/components/DataTable';
import { catalogsService } from '@/services/catalogsService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { CatalogType, Addon, EventGroup, GuestType } from '@/types/catalog';

type CatalogTab = 'eventGroup' | 'guestType' | 'addon';

const Catalogs = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<CatalogTab>('eventGroup');
  const [eventGroups, setEventGroups] = useState<EventGroup[]>([]);
  const [guestTypes, setGuestTypes] = useState<GuestType[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadCatalogData();
  }, [activeTab, pagination.page, pagination.size]);

  const loadCatalogData = async (tab: CatalogTab = activeTab) => {
    setIsLoading(true);
    try {
      const response = await catalogsService.getCatalogTable(tab as CatalogType, {
        page: pagination.page,
        size: pagination.size,
        sortBy: 'id',
        order: 'ASC',
      });

      if (tab === 'eventGroup') {
        setEventGroups(response.content as EventGroup[]);
      } else if (tab === 'guestType') {
        setGuestTypes(response.content as GuestType[]);
      } else if (tab === 'addon') {
        setAddons(response.content as Addon[]);
      }

      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsAdding(false);
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    const newItem = activeTab === 'eventGroup' 
      ? { title: '' }
      : activeTab === 'guestType' 
      ? { title: '' }
      : { title: '', icon: '' };
    
    setEditingItem(newItem);
    setIsAdding(true);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsLoading(true);
    try {
      if (isAdding) {
        await catalogsService.createCatalog(activeTab as CatalogType, editingItem);
        toast({
          title: "Éxito",
          description: "Elemento creado exitosamente",
        });
      } else {
        await catalogsService.updateCatalog(activeTab as CatalogType, editingItem);
        toast({
          title: "Éxito",
          description: "Elemento actualizado exitosamente",
        });
      }
      
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setIsAdding(false);
      loadCatalogData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await catalogsService.deleteCatalog(activeTab as CatalogType, id);
      toast({
        title: "Éxito",
        description: response,
      });
      loadCatalogData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al borrar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const eventGroupColumns: ColumnDef<EventGroup>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('id')}</span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('title')}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de evento
                      "{group.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(group.id)}>
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

  const guestTypeColumns: ColumnDef<GuestType>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('id')}</span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('title')}</span>
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
                      "{guestType.title}".
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
      accessorKey: 'icon',
      header: 'Icono',
      cell: ({ row }) => (
        <div className="text-lg">{row.getValue('icon') || '📦'}</div>
      ),
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('id')}</span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('title')}</span>
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
                      "{addon.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                      setIsLoading(true);
                      try {
                        const response = await catalogsService.deleteCatalog('addon', addon.id);
                        toast({
                          title: "Éxito",
                          description: response,
                        });
                        loadCatalogData('addon');
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: error instanceof Error ? error.message : "Error al borrar",
                          variant: "destructive",
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}>
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
              {isAdding ? 'Agregar' : 'Editar'} {activeTab === 'eventGroup' ? 'Tipo de Evento' : 
                    activeTab === 'guestType' ? 'Tipo de Invitado' : 'Extra'}
            </DialogTitle>
            <DialogDescription>
              {isAdding ? 'Completa los detalles a continuación y haz clic en guardar para crear.' : 'Actualiza los detalles a continuación y haz clic en guardar cuando termines.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Nombre</Label>
              <Input
                id="title"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            {activeTab === 'addon' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">Icono</Label>
                <Input
                  id="icon"
                  value={editingItem.icon || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                  className="col-span-3"
                  placeholder="Emoji o icono"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : isAdding ? 'Crear' : 'Guardar cambios'}
            </Button>
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
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CatalogTab)}>
              <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
                <TabsTrigger value="eventGroup">Tipo de Evento</TabsTrigger>
                <TabsTrigger value="guestType">Tipo de Invitado</TabsTrigger>
                <TabsTrigger value="addon">Extras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="eventGroup" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  {profile === 'ADMIN' && (
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Tipo de Evento
                    </Button>
                  )}
                </div>
                <DataTable
                  columns={eventGroupColumns}
                  data={eventGroups}
                  searchPlaceholder="Buscar tipos de evento..."
                  isLoading={isLoading}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                  onPageSizeChange={(size) => setPagination(prev => ({ ...prev, page: 0, size }))}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.page}
                  currentPageSize={pagination.size}
                />
              </TabsContent>
              
              <TabsContent value="guestType" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  {profile === 'ADMIN' && (
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Tipo de Invitado
                    </Button>
                  )}
                </div>
                <DataTable
                  columns={guestTypeColumns}
                  data={guestTypes}
                  searchPlaceholder="Buscar tipos de invitado..."
                  isLoading={isLoading}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                  onPageSizeChange={(size) => setPagination(prev => ({ ...prev, page: 0, size }))}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.page}
                  currentPageSize={pagination.size}
                />
              </TabsContent>
              
              <TabsContent value="addon" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  {profile === 'ADMIN' && (
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Extra
                    </Button>
                  )}
                </div>
                <DataTable
                  columns={addonColumns}
                  data={addons}
                  searchPlaceholder="Buscar extras..."
                  isLoading={isLoading}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                  onPageSizeChange={(size) => setPagination(prev => ({ ...prev, page: 0, size }))}
                  totalPages={pagination.totalPages}
                  currentPage={pagination.page}
                  currentPageSize={pagination.size}
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