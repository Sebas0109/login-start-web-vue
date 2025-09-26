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
import { useMockData } from '@/hooks/useMockData';
import { User } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, updateUser, deleteUser } = useMockData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user role is ADMIN (mock check - in real app this would come from auth)
  const currentUserRole = 'ADMIN'; // This should come from your auth context/state
  
  useEffect(() => {
    if (currentUserRole !== 'ADMIN') {
      navigate('/events');
    }
  }, [currentUserRole, navigate]);

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit');

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

  const handleSaveUser = (updatedUser: User) => {
    if (modalMode === 'create') {
      // Add to users array (this would be handled by the hook in a real app)
      updateUser(updatedUser.id, updatedUser);
    } else {
      updateUser(updatedUser.id, updatedUser);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast({
      title: "Éxito",
      description: "Usuario eliminado correctamente",
    });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        const truncatedId = id.length > 8 ? `${id.substring(0, 8)}...` : id;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono text-sm cursor-help">{truncatedId}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-sm">{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "paternalSurname",
      header: "Apellido Paterno",
      cell: ({ row }) => <div>{row.getValue("paternalSurname")}</div>,
    },
    {
      accessorKey: "maternalSurname",
      header: "Apellido Materno",
      cell: ({ row }) => <div>{row.getValue("maternalSurname")}</div>,
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
      accessorKey: "phoneNumber",
      header: "Número de Teléfono",
      cell: ({ row }) => <div className="font-mono">{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "stateCode",
      header: "Código de Estado",
      cell: ({ row }) => <div className="font-mono">{row.getValue("stateCode")}</div>,
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
                      "{user.name} {user.paternalSurname}" y eliminará todos sus datos del sistema.
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

  if (currentUserRole !== 'ADMIN') {
    return null; // This will prevent flash before redirect
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