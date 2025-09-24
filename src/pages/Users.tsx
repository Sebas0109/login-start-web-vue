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

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    updateUser(updatedUser.id, updatedUser);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast({
      title: "Success",
      description: "User deleted successfully",
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
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "paternalSurname",
      header: "Paternal Surname",
      cell: ({ row }) => <div>{row.getValue("paternalSurname")}</div>,
    },
    {
      accessorKey: "maternalSurname",
      header: "Maternal Surname",
      cell: ({ row }) => <div>{row.getValue("maternalSurname")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "profile",
      header: "Profile",
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
      header: "Phone Number",
      cell: ({ row }) => <div className="font-mono">{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "stateCode",
      header: "State Code",
      cell: ({ row }) => <div className="font-mono">{row.getValue("stateCode")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
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
                Update
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user
                      "{user.name} {user.paternalSurname}" and remove their data from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
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
  ];

  if (currentUserRole !== 'ADMIN') {
    return null; // This will prevent flash before redirect
  }

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={users} 
              searchPlaceholder="Search users..."
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
      />
    </div>
  );
};

export default Users;