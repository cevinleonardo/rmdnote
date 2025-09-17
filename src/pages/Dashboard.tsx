import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TaskCard from '@/components/TaskCard';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state, getTodayStats, getNearestTasks } = useApp();
  const navigate = useNavigate();
  const todayStats = getTodayStats();
  const nearestTasks = getNearestTasks(5);

  const handleEditTask = (taskId: string) => {
    navigate(`/task/edit/${taskId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar 
            className="cursor-pointer" 
            onClick={() => navigate('/account')}
          >
            <AvatarFallback className="bg-primary text-primary-foreground">
              {state.user.nama.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Halo, {state.user.nama}</h1>
            <p className="text-sm text-muted-foreground">
              Status akun: <span className="uppercase font-medium">{state.user.status_akun}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{todayStats.done}</div>
                <div className="text-sm text-muted-foreground">Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{todayStats.pending}</div>
                <div className="text-sm text-muted-foreground">Tertunda</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearest Tasks */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tugas Terdekat</h2>
          
          {nearestTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="font-medium mb-2">Belum ada tugas</h3>
                <p className="text-sm text-muted-foreground">
                  Tambahkan tugas pertamamu
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {nearestTasks.map(task => (
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
      </div>

      <BottomNav />
    </div>
  );
}