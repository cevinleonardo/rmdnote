import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ProfilePhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProfilePhotoModal({ 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete 
}: ProfilePhotoModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Foto Profil</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-2 mt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12"
            onClick={() => {
              onEdit();
              onOpenChange(false);
            }}
          >
            <Edit className="h-5 w-5 text-muted-foreground" />
            <span>Edit Foto</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive"
            onClick={() => {
              onDelete();
              onOpenChange(false);
            }}
          >
            <Trash2 className="h-5 w-5" />
            <span>Hapus Foto</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}