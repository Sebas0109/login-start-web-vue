import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockStateCodes, Guest } from '@/data/mockData';
import { useToast } from "@/hooks/use-toast";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onSave: (guestData: Partial<Guest>) => void;
}

export const GuestModal = ({ isOpen, onClose, guest, onSave }: GuestModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    paternalSurname: guest?.paternalSurname || '',
    maternalSurname: guest?.maternalSurname || '',
    stateCode: guest?.stateCode || '',
    phone: guest?.phone || '',
    assistance: guest?.assistance || 'Pending',
    escortCount: guest?.escortCount || 0,
    confirmationEmailSent: guest?.confirmationEmailSent || false
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.paternalSurname.trim() || !formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Name, paternal surname, and phone are required.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{7,10}$/.test(formData.phone)) {
      toast({
        title: "Validation Error", 
        description: "Phone must be 7-10 digits without state code.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Success",
      description: "Guest updated successfully"
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: guest?.name || '',
      paternalSurname: guest?.paternalSurname || '',
      maternalSurname: guest?.maternalSurname || '',
      stateCode: guest?.stateCode || '',
      phone: guest?.phone || '',
      assistance: guest?.assistance || 'Pending',
      escortCount: guest?.escortCount || 0,
      confirmationEmailSent: guest?.confirmationEmailSent || false
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] bg-gradient-card backdrop-blur-lg border-border/50"
        aria-describedby="guest-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {guest ? 'Update Guest' : 'Add Guest'}
          </DialogTitle>
        </DialogHeader>
        
        <div id="guest-modal-description" className="sr-only">
          Form to {guest ? 'update' : 'add'} guest information including name, contact details, and assistance status
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background/50 border-border"
              />
            </div>
            <div>
              <Label htmlFor="paternalSurname">Paternal Surname *</Label>
              <Input
                id="paternalSurname"
                value={formData.paternalSurname}
                onChange={(e) => setFormData(prev => ({ ...prev, paternalSurname: e.target.value }))}
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maternalSurname">Maternal Surname</Label>
            <Input
              id="maternalSurname"
              value={formData.maternalSurname}
              onChange={(e) => setFormData(prev => ({ ...prev, maternalSurname: e.target.value }))}
              className="bg-background/50 border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stateCode">State Code</Label>
              <Select 
                value={formData.stateCode} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, stateCode: value }))}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Select state code" />
                </SelectTrigger>
                <SelectContent>
                  {mockStateCodes.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                placeholder="7-10 digits"
                className="bg-background/50 border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">Enter number without state/area code</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assistance">Assistance</Label>
              <Select 
                value={formData.assistance} 
                onValueChange={(value: 'Pending' | 'Confirmed' | 'Cancelled') => 
                  setFormData(prev => ({ ...prev, assistance: value }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="escortCount">Number of Escorts</Label>
              <Input
                id="escortCount"
                type="number"
                min="0"
                value={formData.escortCount}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  escortCount: Math.max(0, parseInt(e.target.value) || 0) 
                }))}
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmationEmailSent"
              checked={formData.confirmationEmailSent}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, confirmationEmailSent: !!checked }))
              }
            />
            <Label htmlFor="confirmationEmailSent">Confirmation mail sent</Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};