import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function TasksList() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleEditTask = (taskId: string) => {
    navigate(`/task/edit/${taskId}`);
  };

  // Filter tasks based on search and tab
  const filteredTasks = state.tasks.filter(task => {
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

  const allCount = state.tasks.length;
  const completedCount = state.tasks.filter(t => t.status === 'selesai').length;
  const pendingCount = state.tasks.filter(t => t.status === 'tunda').length;

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