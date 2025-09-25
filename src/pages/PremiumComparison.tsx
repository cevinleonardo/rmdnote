import { Check, Crown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function PremiumComparison() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgrade = () => {
    const newStatus = state.user.status_akun === 'premium' ? 'free' : 'premium';
    
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: { 
        updates: { status_akun: newStatus } 
      } 
    });
    
    toast({
      title: newStatus === 'premium' ? "Upgrade Berhasil!" : "Downgrade Berhasil!",
      description: newStatus === 'premium' 
        ? "Selamat datang di Premium! Nikmati semua fitur tanpa batas." 
        : "Akun berhasil diubah ke Free",
    });
    
    navigate('/account');
  };

  const freeFeatures = [
    'Tambah tugas unlimited',
    'Pengulangan harian, mingguan, bulanan',
    'Reminder dasar',
    'Export ke calendar',
    'Sinkronisasi antar device'
  ];

  const premiumFeatures = [
    ...freeFeatures,
    'WhatsApp reminder',
    'Custom reminder time',
    'Prioritas Eisenhower Matrix',
    'Advanced analytics',
    'Backup & restore',
    'Theme customization',
    'Priority support'
  ];

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
          <h1 className="text-xl font-bold">Status Akun</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Status */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {state.user.status_akun === 'premium' && <Crown className="h-6 w-6 text-yellow-500" />}
              <h2 className="text-2xl font-bold">
                {state.user.status_akun === 'premium' ? 'Premium' : 'Free'}
              </h2>
            </div>
            <p className="text-muted-foreground">
              {state.user.status_akun === 'premium' 
                ? 'Anda sedang menggunakan akun Premium'
                : 'Upgrade ke Premium untuk mendapatkan fitur lebih'
              }
            </p>
          </CardContent>
        </Card>

        {/* Comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Free Plan */}
          <Card className={state.user.status_akun === 'free' ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free</span>
                {state.user.status_akun === 'free' && (
                  <Badge variant="default">Current</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={state.user.status_akun === 'premium' ? 'ring-2 ring-yellow-500' : 'ring-2 ring-primary'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Premium</span>
                </div>
                {state.user.status_akun === 'premium' && (
                  <Badge variant="default" className="bg-yellow-500">Current</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className={`text-sm ${index >= freeFeatures.length ? 'font-medium text-yellow-600 dark:text-yellow-400' : ''}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleUpgrade} 
          className="w-full h-12 text-base"
          variant={state.user.status_akun === 'premium' ? 'outline' : 'default'}
        >
          {state.user.status_akun === 'premium' ? (
            'Downgrade ke Free'
          ) : (
            <>
              <Crown className="h-5 w-5 mr-2" />
              Upgrade Sekarang
            </>
          )}
        </Button>
      </div>
    </div>
  );
}