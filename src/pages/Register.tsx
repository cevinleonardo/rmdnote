import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate registration
    setTimeout(() => {
      toast({
        title: "Pendaftaran berhasil",
        description: "Silakan cek email untuk verifikasi",
      });
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Daftar</CardTitle>
          <CardDescription>
            Buat akun TaskList+ baru
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                type="text"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Nama lengkap"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contoh@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+62 812-0000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimal 6 karakter"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password2">Konfirmasi Password</Label>
              <Input
                id="password2"
                type="password"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Ulangi password"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>
            
            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Sudah punya akun? Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}