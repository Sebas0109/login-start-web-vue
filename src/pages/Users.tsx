import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserModal } from '@/components/UserModal';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usersService } from '@/services/usersService';

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (profile !== 'ADMIN') {
      navigate('/events');
    }
  }, [profile, navigate]);

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.size, searchKeyword]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersService.getUsersPage({
        keyword: searchKeyword,
        sortBy: 'id',
        order: 'DESC',
        page: pagination.page,
        size: pagination.size,
      });
      
      setUsers(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar usuarios",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      setIsLoading(true);
      if (modalMode === 'create') {
        await usersService.createUser(userData);
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente.",
        });
      } else {
        await usersService.updateUser(userData);
        toast({
          title: "Éxito",
          description: "Usuario actualizado correctamente.",
        });
      }
      setIsModalOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const message = await usersService.deleteUser(userId);
      toast({
        title: "Éxito",
        description: message,
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar usuario",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as number;
        return <div className="font-mono text-sm">{id}</div>;
      },
    },
    {
      accessorKey: "person.name",
      header: "Nombre",
      cell: ({ row }) => <div>{row.original.person.name}</div>,
    },
    {
      accessorKey: "person.paternalSurname",
      header: "Apellido Paterno",
      cell: ({ row }) => <div>{row.original.person.paternalSurname}</div>,
    },
    {
      accessorKey: "person.maternalSurname",
      header: "Apellido Materno",
      cell: ({ row }) => <div>{row.original.person.maternalSurname}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "profile",
      header: "Perfil",
      cell: ({ row }) => {
        const profile = row.getValue("profile") as string;
        return (
          <Badge variant={profile === 'ADMIN' ? 'default' : 'secondary'}>
            {profile}
          </Badge>
        );
      },
    },
    {
      accessorKey: "person.phone",
      header: "Número de Teléfono",
      cell: ({ row }) => <div className="font-mono">{row.original.person.phone}</div>,
    },
    {
      accessorKey: "person.stateCode",
      header: "Código de Estado",
      cell: ({ row }) => <div className="font-mono">{row.original.person.stateCode}</div>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUpdateUser(user)}>
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
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario
                    "{user.person.name} {user.person.paternalSurname}" y eliminará todos sus datos del sistema.
                  </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
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
  ];

  if (profile !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <Button onClick={handleCreateUser} className="ml-auto">
                Agregar Usuario
              </Button>
            </div>
            <DataTable 
              columns={columns} 
              data={users} 
              searchPlaceholder="Buscar usuarios..."
              onGlobalFilterChange={setSearchKeyword}
              isLoading={isLoading}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onPageSizeChange={(size) => setPagination(prev => ({ ...prev, page: 0, size }))}
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
              currentPageSize={pagination.size}
            />
          </CardContent>
        </Card>
      </div>

      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        mode={modalMode}
        existingUsers={users}
      />
    </div>
  );
};

export default Users;