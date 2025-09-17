import { useState } from 'react';
import { 
  User, 
  Moon, 
  Sun, 
  Crown, 
  Bell, 
  HelpCircle, 
  Key, 
  Trash2, 
  LogOut,
  Camera 
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Account() {
  const { state, toggleTheme, dispatch } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletePassword, setDeletePassword] = useState('');

  const handleUpgradeToPremium = () => {
    dispatch({ 
      type: 'SET_STATE', 
      payload: { 
        state: { 
          user: { ...state.user, status_akun: 'premium' } 
        } 
      } 
    });
    toast({
      title: "Berhasil upgrade!",
      description: "Akun Anda telah diupgrade ke Premium",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, you'd verify the password here
    if (deletePassword.length < 6) {
      toast({
        title: "Error",
        description: "Password harus minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Akun dihapus",
      description: "Akun Anda telah dihapus",
    });
    
    // Navigate to login and reset state
    navigate('/login');
  };

  const handleLogout = () => {
    toast({
      title: "Logout berhasil",
      description: "Sampai jumpa lagi!",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <h1 className="text-xl font-bold">Akun</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {state.user.nama.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{state.user.nama}</h2>
                <p className="text-sm text-muted-foreground">{state.user.email}</p>
                <p className="text-sm text-muted-foreground">{state.user.phone}</p>
                <Badge 
                  variant={state.user.status_akun === 'premium' ? 'default' : 'secondary'}
                  className="mt-2"
                >
                  {state.user.status_akun === 'premium' ? '👑 Premium' : 'Free'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferensi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {state.user.theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <span>Mode Gelap</span>
              </div>
              <Switch
                checked={state.user.theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Status Akun</div>
                  <div className="text-sm text-muted-foreground">
                    {state.user.status_akun === 'premium' ? 'Premium aktif' : 'Upgrade untuk fitur lebih'}
                  </div>
                </div>
              </div>
              {state.user.status_akun === 'free' && (
                <Button variant="outline" size="sm" onClick={handleUpgradeToPremium}>
                  Upgrade
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span>Pengaturan Reminder & Notifikasi</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <span>Bantuan & FAQ</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <Key className="h-5 w-5 text-muted-foreground" />
              <span>Ubah Password</span>
            </Button>
            
            <Separator className="my-2" />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive">
                  <Trash2 className="h-5 w-5" />
                  <span>Hapus Akun</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>Masukkan password untuk menghapus akun. Tindakan ini tidak dapat dibatalkan.</p>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Hapus Akun
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <span>Logout</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}