import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Task, Label } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  labels: Label[];
  onEdit?: (taskId: string) => void;
}

export default function TaskCard({ task, labels, onEdit }: TaskCardProps) {
  const { updateTaskStatus, deleteTask } = useApp();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [swipePosition, setSwipePosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const taskLabels = labels.filter(label => task.label_ids.includes(label.id));
  
  const priorityVariant = {
    'Tinggi': 'destructive',
    'Sedang': 'secondary',
    'Rendah': 'outline',
  } as const;

  const handleStatusToggle = (checked: boolean) => {
    updateTaskStatus(task.id, checked ? 'selesai' : 'tunda');
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteDialog(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;
    setSwipePosition(Math.max(-120, Math.min(120, x)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(swipePosition) > 60) {
      if (swipePosition < 0 && onEdit) {
        onEdit(task.id);
      } else if (swipePosition > 0) {
        setShowDeleteDialog(true);
      }
    }
    setSwipePosition(0);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
        {/* Swipe Actions Background */}
        <div className="absolute inset-y-0 left-0 flex items-center justify-center w-16 bg-primary rounded-l-lg">
          <Edit className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-16 bg-destructive rounded-r-lg">
          <Trash2 className="h-5 w-5 text-destructive-foreground" />
        </div>

        {/* Task Card */}
        <Card
          className={cn(
            "p-4 transition-transform duration-200 bg-card",
            isDragging && "cursor-grabbing"
          )}
          style={{
            transform: `translateX(${swipePosition}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.status === 'selesai'}
              onCheckedChange={handleStatusToggle}
              className="mt-1"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className={cn(
                  "font-medium",
                  task.status === 'selesai' && "line-through text-muted-foreground"
                )}>
                  {task.nama}
                </h3>
                <Badge variant={priorityVariant[task.prioritas] as any}>
                  {task.prioritas}
                </Badge>
              </div>

              {task.catatan && (
                <p className="text-sm text-muted-foreground">{task.catatan}</p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(task.deadline), 'dd MMM yyyy, HH:mm', { locale: localeId })}
                </p>
                
                {taskLabels.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {taskLabels.map(label => (
                      <Badge key={label.id} variant="outline" className="text-xs">
                        {label.nama}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus tugas "{task.nama}"? Tindakan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}