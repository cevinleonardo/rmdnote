import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const { state, updateTaskStatus, shouldShowCalendarTask } = useApp();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get tasks for a specific date (only show certain repetition types and not completed)
  const getTasksForDate = (date: Date) => {
    return state.tasks.filter(task => {
      // Only show specific repetition types in calendar
      const allowedTypes = ['tidak_ada', 'bulanan', 'tahunan', 'pilih_tanggal'];
      if (!allowedTypes.includes(task.pengulangan.tipe)) return false;
      
      // Don't show completed tasks
      if (task.status === 'selesai') return false;
      
      return shouldShowCalendarTask(task) && isSameDay(new Date(task.deadline), date);
    });
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty slots for proper grid alignment
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const priorityVariant = {
    'Tinggi': 'destructive',
    'Sedang': 'secondary',
    'Rendah': 'outline',
    // Eisenhower Matrix priorities
    'Mendesak & Penting': 'destructive',
    'Mendesak & Tidak Penting': 'secondary',
    'Tidak Mendesak & Penting': 'default',
    'Tidak Mendesak & Tidak Penting': 'outline',
  } as const;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h1 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
          </h1>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Calendar Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kalender Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty slots */}
              {emptyDays.map((_, index) => (
                <div key={index} className="aspect-square" />
              ))}
              
              {/* Calendar days */}
              {calendarDays.map(day => {
                const dayTasks = getTasksForDate(day);
                const hasActiveTasks = dayTasks.some(task => task.status === 'tunda');
                const isToday = isSameDay(day, new Date());
                
                return (
                  <Sheet key={day.toISOString()}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "aspect-square p-1 h-auto flex flex-col items-center justify-center relative",
                          isToday && "bg-primary/10 text-primary font-semibold",
                          !isSameMonth(day, currentMonth) && "text-muted-foreground/50"
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        <span className="text-sm">{format(day, 'd')}</span>
                        {dayTasks.length > 0 && (
                          <div className={cn(
                            "w-1 h-1 rounded-full absolute bottom-1",
                            hasActiveTasks ? "bg-warning" : "bg-success"
                          )} />
                        )}
                      </Button>
                    </SheetTrigger>
                    
                    <SheetContent side="bottom" className="max-h-[80vh]">
                      <SheetHeader>
                        <SheetTitle>
                          Tugas pada {format(day, 'dd MMM yyyy', { locale: localeId })}
                        </SheetTitle>
                        <SheetDescription>
                          {dayTasks.length === 0 
                            ? 'Tidak ada tugas pada tanggal ini'
                            : `${dayTasks.length} tugas ditemukan`
                          }
                        </SheetDescription>
                      </SheetHeader>
                      
                      {dayTasks.length > 0 && (
                        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                          {dayTasks.map(task => (
                            <div
                              key={task.id}
                              className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
                              onClick={() => navigate(`/task/edit/${task.id}`)}
                            >
                              <Checkbox
                                checked={task.status === 'selesai'}
                                onCheckedChange={(checked) => {
                                  updateTaskStatus(task.id, checked ? 'selesai' : 'tunda');
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              
                              <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={cn(
                                    "font-medium text-sm",
                                    task.status === 'selesai' && "line-through text-muted-foreground"
                                  )}>
                                    {task.nama}
                                  </h4>
                                  <Badge variant={priorityVariant[task.prioritas] as any} className="text-xs">
                                    {task.prioritas}
                                  </Badge>
                                </div>
                                
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(task.deadline), 'HH:mm')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}