import { ArrowLeft, Mail, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

export default function HelpFAQ() {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Bagaimana cara menambah tugas berulang?",
      answer: "Saat membuat tugas, pilih opsi 'Pengulangan' lalu pilih jenis pengulangan yang diinginkan (Harian, Mingguan, Bulanan, Tahunan, atau Pilih Tanggal)."
    },
    {
      question: "Apa itu Eisenhower Matrix?",
      answer: "Eisenhower Matrix adalah sistem prioritas 4 kuadran: Mendesak & Penting, Mendesak & Tidak Penting, Tidak Mendesak & Penting, dan Tidak Mendesak & Tidak Penting. Sistem ini muncul saat memilih pengulangan 'Tidak ada'."
    },
    {
      question: "Mengapa tugas harian tidak muncul di kalender?",
      answer: "Tugas dengan pengulangan Harian dan Mingguan tidak ditampilkan di kalender untuk menghindari kekacauan. Gunakan halaman Daftar Tugas untuk melihat tugas harian."
    },
    {
      question: "Bagaimana cara mengubah reminder default?",
      answer: "Buka Akun → Pengaturan Reminder & Notifikasi → pilih waktu default yang diinginkan → Simpan Pengaturan."
    },
    {
      question: "Apa perbedaan akun Free dan Premium?",
      answer: "Akun Premium mendapat fitur WhatsApp reminder, custom reminder time, analytics, backup & restore, dan priority support."
    },
    {
      question: "Bagaimana cara swipe untuk edit/hapus tugas?",
      answer: "Di kartu tugas, swipe ke kiri untuk edit dan swipe ke kanan untuk hapus. Pastikan swipe cukup jauh untuk memicu aksi."
    },
    {
      question: "Data saya aman tidak?",
      answer: "Ya, semua data disimpan lokal di device Anda menggunakan localStorage. Data tidak dikirim ke server eksternal."
    },
    {
      question: "Kenapa onboarding muncul lagi?",
      answer: "Onboarding hanya muncul sekali. Jika muncul lagi, berarti data localStorage terhapus atau browser dalam mode incognito."
    }
  ];

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@tasklistapp.com?subject=Bantuan TaskList App';
  };

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/6281234567890?text=Halo, saya butuh bantuan dengan TaskList App', '_blank');
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
          <h1 className="text-xl font-bold">Bantuan & FAQ</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hubungi Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={handleEmailSupport}
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-muted-foreground">support@tasklistapp.com</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={handleWhatsAppSupport}
            >
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">WhatsApp Support</div>
                <div className="text-sm text-muted-foreground">+62 812-3456-7890</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Tutorial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tutorial Singkat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">1. Menambah Tugas</div>
              <div className="text-sm text-muted-foreground">
                Tap tombol + di bottom navigation atau di halaman Daftar Tugas
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">2. Swipe Actions</div>
              <div className="text-sm text-muted-foreground">
                Swipe kartu tugas ke kiri untuk edit, ke kanan untuk hapus
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">3. Filter Tanggal</div>
              <div className="text-sm text-muted-foreground">
                Gunakan strip tanggal horizontal di halaman Daftar Tugas
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">4. Pengulangan</div>
              <div className="text-sm text-muted-foreground">
                Pilih jenis pengulangan saat membuat tugas untuk auto-repeat
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}