import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'Reminder Harian',
    description: 'Kelola to‑do harian dengan mudah agar tidak ada yang terlewat.',
    illustration: '📅',
  },
  {
    title: 'Reminder Jangka Panjang',
    description: 'Ingatkan perpanjangan SIM, kontrak, hosting, dan tagihan tahunan.',
    illustration: '🔔',
  },
  {
    title: 'Integrasi WhatsApp',
    badge: 'Premium',
    description: 'Dapatkan pengingat langsung via WhatsApp.',
    illustration: '💬',
  },
  {
    title: 'Kolaborasi Tim',
    badge: 'Coming Soon',
    description: 'Rencanakan tugas bersama tim dengan lebih rapi.',
    illustration: '👥',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStart = () => {
    navigate('/register');
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-6">{slide.illustration}</div>
          
          <div className="mb-2">
            <h1 className="text-2xl font-bold mb-2">{slide.title}</h1>
            {slide.badge && (
              <Badge 
                variant={slide.badge === 'Premium' ? 'default' : 'secondary'}
                className="mb-4"
              >
                {slide.badge}
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground mb-8">{slide.description}</p>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Lewati
              </Button>
              
              {currentSlide === slides.length - 1 ? (
                <Button onClick={handleStart}>
                  Mulai Sekarang
                </Button>
              ) : (
                <Button onClick={nextSlide}>
                  Lanjut
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}