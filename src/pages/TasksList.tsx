import { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { format, addDays, subDays, startOfDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function TasksList() {
  const { state, getTasksForDate } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleEditTask = (taskId: string) => {
    navigate(`/task/edit/${taskId}`);
  };

  // Generate horizontal date strip (7 days: 3 before, selected, 3 after)
  const dateStrip = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));

  // Get tasks for selected date
  const tasksForDate = getTasksForDate(selectedDate);

  // Filter tasks based on search and tab
  const filteredTasks = tasksForDate.filter(task => {
    const matchesSearch = task.nama.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'completed':
        return matchesSearch && task.status === 'selesai';
      case 'pending':
        return matchesSearch && task.status === 'tunda';
      default:
        return matchesSearch;
    }
  });

  const allCount = tasksForDate.length;
  const completedCount = tasksForDate.filter(t => t.status === 'selesai').length;
  const pendingCount = tasksForDate.filter(t => t.status === 'tunda').length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <h1 className="text-xl font-bold mb-4">Daftar Tugas</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari nama tugas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-sm font-medium">
            {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
          </h2>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Horizontal Date Strip */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dateStrip.map(date => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            const dayTasks = getTasksForDate(date);
            
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex-shrink-0 flex flex-col items-center min-w-[60px] h-auto py-2",
                  isToday && !isSelected && "ring-1 ring-primary"
                )}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs">{format(date, 'EEE', { locale: localeId })}</span>
                <span className="text-sm font-medium">{format(date, 'd')}</span>
                {dayTasks.length > 0 && (
                  <div className="w-1 h-1 bg-warning rounded-full mt-1" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Selected Date Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: localeId })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {allCount} tugas untuk hari ini
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              Semua ({allCount})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Tertunda ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Selesai ({completedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-medium mb-2">
                {searchQuery 
                  ? 'Tidak ada tugas yang cocok' 
                  : 'Belum ada tugas'
                }
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Coba kata kunci yang lain' 
                  : 'Tambahkan tugas pertamamu'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/task/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tugas
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                labels={state.labels}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}