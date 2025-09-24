import { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { RepetitionType, PriorityType, Repetition } from '@/types';

export default function TaskCreate() {
  const { state, addTask, completeOnboarding } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    catatan: '',
    deadline: '',
    pengulangan: {
      tipe: 'tidak_ada' as RepetitionType,
      hari_dipilih: [] as string[],
      custom_dates: [] as string[],
      monthly_option: 'last_date' as 'last_date' | 'skip_month'
    } as Repetition,
    prioritas: 'mendesak_penting' as PriorityType,
    label_ids: [] as string[],
  });

  const [newCustomDate, setNewCustomDate] = useState('');

  const weekDays = [
    { value: 'senin', label: 'Senin' },
    { value: 'selasa', label: 'Selasa' },
    { value: 'rabu', label: 'Rabu' },
    { value: 'kamis', label: 'Kamis' },
    { value: 'jumat', label: 'Jumat' },
    { value: 'sabtu', label: 'Sabtu' },
    { value: 'minggu', label: 'Minggu' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama.trim()) {
      toast({
        title: "Error",
        description: "Nama tugas harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (!formData.deadline) {
      toast({
        title: "Error", 
        description: "Tanggal & jam harus diisi",
        variant: "destructive",
      });
      return;
    }

    addTask({
      nama: formData.nama,
      catatan: formData.catatan,
      deadline: formData.deadline,
      pengulangan: formData.pengulangan,
      prioritas: formData.prioritas,
      label_ids: formData.label_ids,
      status: 'tunda',
    });

    // Complete onboarding after first task creation
    if (!state.user.onboarding_completed) {
      completeOnboarding();
    }

    toast({
      title: "Berhasil",
      description: "Tugas berhasil ditambahkan",
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

  const handleWeekDayToggle = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      pengulangan: {
        ...prev.pengulangan,
        hari_dipilih: checked 
          ? [...(prev.pengulangan.hari_dipilih || []), day]
          : (prev.pengulangan.hari_dipilih || []).filter(d => d !== day)
      }
    }));
  };

  const handleRepetitionChange = (tipe: RepetitionType) => {
    setFormData(prev => ({
      ...prev,
      pengulangan: {
        tipe,
        hari_dipilih: [],
        custom_dates: [],
        monthly_option: 'last_date'
      },
      // Reset priority based on repetition type
      prioritas: tipe === 'tidak_ada' ? 'mendesak_penting' : 'Tinggi'
    }));
  };

  const addCustomDate = () => {
    if (newCustomDate && !formData.pengulangan.custom_dates?.includes(newCustomDate)) {
      setFormData(prev => ({
        ...prev,
        pengulangan: {
          ...prev.pengulangan,
          custom_dates: [...(prev.pengulangan.custom_dates || []), newCustomDate]
        }
      }));
      setNewCustomDate('');
    }
  };

  const removeCustomDate = (dateToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      pengulangan: {
        ...prev.pengulangan,
        custom_dates: (prev.pengulangan.custom_dates || []).filter(date => date !== dateToRemove)
      }
    }));
  };

  const getPriorityOptions = () => {
    if (formData.pengulangan.tipe === 'tidak_ada') {
      return [
        { value: 'mendesak_penting', label: 'Mendesak & Penting', color: 'bg-red-500' },
        { value: 'mendesak_tidak_penting', label: 'Mendesak & Tidak Penting', color: 'bg-orange-500' },
        { value: 'tidak_mendesak_penting', label: 'Tidak Mendesak & Penting', color: 'bg-blue-500' },
        { value: 'tidak_mendesak_tidak_penting', label: 'Tidak Mendesak & Tidak Penting', color: 'bg-green-500' },
      ];
    } else {
      return [
        { value: 'Tinggi', label: 'Tinggi', color: 'bg-red-500' },
        { value: 'Sedang', label: 'Sedang', color: 'bg-yellow-500' },
        { value: 'Rendah', label: 'Rendah', color: 'bg-green-500' },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Tambah Tugas</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Informasi Dasar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama Tugas *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                placeholder="Masukkan nama tugas"
                required
              />
            </div>

            <div>
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan}
                onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                placeholder="Tambahkan catatan (opsional)"
                rows={3}
              />
            </div>

            <div>
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

        {/* Pengulangan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengulangan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={formData.pengulangan.tipe}
              onValueChange={(value: RepetitionType) => handleRepetitionChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis pengulangan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tidak_ada">Tidak ada</SelectItem>
                <SelectItem value="harian">Harian</SelectItem>
                <SelectItem value="mingguan">Mingguan</SelectItem>
                <SelectItem value="bulanan">Bulanan</SelectItem>
                <SelectItem value="tahunan">Tahunan</SelectItem>
                <SelectItem value="pilih_tanggal">Pilih Tanggal</SelectItem>
              </SelectContent>
            </Select>

            {/* Harian - Pilih Hari */}
            {formData.pengulangan.tipe === 'harian' && (
              <div className="space-y-2">
                <Label>Pilih Hari</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map(day => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={formData.pengulangan.hari_dipilih?.includes(day.value) || false}
                        onCheckedChange={(checked) => handleWeekDayToggle(day.value, checked as boolean)}
                      />
                      <Label htmlFor={day.value} className="text-sm">{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bulanan - Opsi khusus */}
            {formData.pengulangan.tipe === 'bulanan' && (
              <div className="space-y-2">
                <Label>Jika tanggal tidak ada di bulan berikutnya:</Label>
                <Select
                  value={formData.pengulangan.monthly_option}
                  onValueChange={(value: 'last_date' | 'skip_month') => 
                    setFormData(prev => ({
                      ...prev,
                      pengulangan: { ...prev.pengulangan, monthly_option: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_date">Pindah ke tanggal terakhir bulan</SelectItem>
                    <SelectItem value="skip_month">Skip bulan tersebut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pilih Tanggal - Multi-date picker */}
            {formData.pengulangan.tipe === 'pilih_tanggal' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={newCustomDate}
                    onChange={(e) => setNewCustomDate(e.target.value)}
                    placeholder="Pilih tanggal & jam"
                  />
                  <Button type="button" onClick={addCustomDate} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.pengulangan.custom_dates && formData.pengulangan.custom_dates.length > 0 && (
                  <div className="space-y-2">
                    <Label>Tanggal yang dipilih:</Label>
                    {formData.pengulangan.custom_dates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm">
                          {new Date(date).toLocaleString('id-ID')}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomDate(date)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prioritas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {formData.pengulangan.tipe === 'tidak_ada' ? 'Prioritas (Eisenhower Matrix)' : 'Prioritas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={formData.prioritas} 
              onValueChange={(value: PriorityType) => 
                setFormData(prev => ({ ...prev, prioritas: value }))
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {getPriorityOptions().map(option => (
                  <TabsTrigger key={option.value} value={option.value} className="text-xs">
                    <div className={`w-2 h-2 rounded-full ${option.color} mr-1`}></div>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Label */}
        {state.labels.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Label</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {state.labels.map(label => (
                  <div key={label.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`label-${label.id}`}
                      checked={formData.label_ids.includes(label.id)}
                      onCheckedChange={(checked) => handleLabelToggle(label.id, checked as boolean)}
                    />
                    <Label htmlFor={`label-${label.id}`} className="text-sm">
                      {label.nama}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kelola Label */}
        <Card>
          <CardContent className="pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/labels')}
              className="w-full"
            >
              Kelola Label
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg">
          Simpan Tugas
        </Button>
      </form>

      <BottomNav />
    </div>
  );
}