import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function TaskEdit() {
  const { id } = useParams();
  const { state, updateTask } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nama: '',
    catatan: '',
    deadline: '',
    pengulangan: { tipe: 'harian' as 'harian' | 'mingguan' | 'bulanan' | 'tahunan' | 'custom' },
    prioritas: 'Sedang' as 'Tinggi' | 'Sedang' | 'Rendah',
    label_ids: [] as string[],
  });

  const task = state.tasks.find(t => t.id === id);

  useEffect(() => {
    if (task) {
      setFormData({
        nama: task.nama,
        catatan: task.catatan || '',
        deadline: task.deadline.slice(0, 16), // Format for datetime-local
        pengulangan: task.pengulangan || { tipe: 'harian' },
        prioritas: task.prioritas,
        label_ids: task.label_ids,
      });
    }
  }, [task]);

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Tugas tidak ditemukan</h2>
          <Button onClick={() => navigate('/tasks')}>
            Kembali ke Daftar Tugas
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama.trim() || !formData.deadline) {
      toast({
        title: "Error",
        description: "Nama tugas dan deadline harus diisi",
        variant: "destructive",
      });
      return;
    }

    updateTask(task.id, {
      ...formData,
      deadline: new Date(formData.deadline).toISOString(),
    });

    toast({
      title: "Berhasil",
      description: "Perubahan telah disimpan",
    });
    
    navigate('/tasks');
  };

  const handleLabelToggle = (labelId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      label_ids: checked
        ? [...prev.label_ids, labelId]
        : prev.label_ids.filter(id => id !== labelId)
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Edit Tugas</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Tugas *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                placeholder="Masukkan nama tugas"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (Opsional)</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                placeholder="Tambahkan catatan atau detail"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Tanggal & Jam *</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Priority & Labels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Prioritas</Label>
              <Tabs 
                value={formData.prioritas} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, prioritas: value as any }))}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="Tinggi" className="text-xs">Tinggi</TabsTrigger>
                  <TabsTrigger value="Sedang" className="text-xs">Sedang</TabsTrigger>
                  <TabsTrigger value="Rendah" className="text-xs">Rendah</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Pengulangan</Label>
              <Select 
                value={formData.pengulangan.tipe} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  pengulangan: { tipe: value as any } 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harian">Harian</SelectItem>
                  <SelectItem value="mingguan">Mingguan</SelectItem>
                  <SelectItem value="bulanan">Bulanan</SelectItem>
                  <SelectItem value="tahunan">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Labels */}
            {state.labels.length > 0 && (
              <div className="space-y-2">
                <Label>Label</Label>
                <div className="space-y-2">
                  {state.labels.map(label => (
                    <div key={label.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={label.id}
                        checked={formData.label_ids.includes(label.id)}
                        onCheckedChange={(checked) => handleLabelToggle(label.id, checked as boolean)}
                      />
                      <Label htmlFor={label.id} className="text-sm font-normal">
                        {label.nama}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Simpan Perubahan
        </Button>
      </form>

      <BottomNav />
    </div>
  );
}