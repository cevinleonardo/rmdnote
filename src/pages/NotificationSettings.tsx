import { useState } from 'react';
import { ArrowLeft, Bell, MessageSquare, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function NotificationSettings() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState(state.user.notif_prefs);
  const [reminderDefault, setReminderDefault] = useState(state.user.reminder_default_minutes);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        updates: {
          notif_prefs: settings,
          reminder_default_minutes: reminderDefault
        }
      }
    });
    
    toast({
      title: "Pengaturan Disimpan",
      description: "Pengaturan reminder dan notifikasi berhasil diperbarui",
    });
    
    navigate('/account');
  };

  const handleWhatsAppToggle = (checked: boolean) => {
    if (checked && state.user.status_akun === 'free') {
      toast({
        title: "Upgrade ke Premium",
        description: "WhatsApp reminder hanya tersedia untuk akun Premium",
        variant: "destructive"
      });
      navigate('/premium');
      return;
    }
    
    setSettings(prev => ({ ...prev, whatsapp: checked }));
  };

  const getReminderLabel = (minutes: number) => {
    switch (minutes) {
      case 0: return 'Tidak ada';
      case 30: return '30 menit sebelum';
      case 60: return '1 jam sebelum';
      case 120: return '2 jam sebelum';
      case 1440: return '1 hari sebelum';
      default: return `${minutes} menit sebelum`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/account')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Pengaturan Reminder & Notifikasi</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jenis Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Push Notification</div>
                  <div className="text-sm text-muted-foreground">
                    Notifikasi langsung di aplikasi
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.push}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, push: checked }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">WhatsApp</span>
                    {state.user.status_akun === 'free' && (
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reminder melalui WhatsApp
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.whatsapp}
                onCheckedChange={handleWhatsAppToggle}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    Reminder melalui email
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.email}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, email: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Reminder Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Waktu Reminder Default</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium mb-2">Waktu Default</div>
                <Select
                  value={reminderDefault.toString()}
                  onValueChange={(value) => setReminderDefault(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih waktu reminder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Tidak ada</SelectItem>
                    <SelectItem value="15">15 menit sebelum</SelectItem>
                    <SelectItem value="30">30 menit sebelum</SelectItem>
                    <SelectItem value="60">1 jam sebelum</SelectItem>
                    <SelectItem value="120">2 jam sebelum</SelectItem>
                    <SelectItem value="1440">1 hari sebelum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Push:</span> {settings.push ? 'Aktif' : 'Nonaktif'}
            </div>
            <div className="text-sm">
              <span className="font-medium">WhatsApp:</span> {settings.whatsapp ? 'Aktif' : 'Nonaktif'}
            </div>
            <div className="text-sm">
              <span className="font-medium">Email:</span> {settings.email ? 'Aktif' : 'Nonaktif'}
            </div>
            <div className="text-sm">
              <span className="font-medium">Reminder Default:</span> {getReminderLabel(reminderDefault)}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full h-12">
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}