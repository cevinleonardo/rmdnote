export interface User {
  id: string;
  nama: string;
  email: string;
  phone: string;
  status_akun: 'free' | 'premium';
  foto_url?: string | null;
  theme: 'light' | 'dark';
  notif_prefs: {
    push: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  reminder_default_minutes: number;
}

export interface Task {
  id: string;
  nama: string;
  catatan?: string;
  deadline: string;
  pengulangan?: {
    tipe: 'harian' | 'mingguan' | 'bulanan' | 'tahunan' | 'custom';
    custom_dates?: string[];
  };
  prioritas: 'Tinggi' | 'Sedang' | 'Rendah';
  label_ids: string[];
  status: 'selesai' | 'tunda';
  created_at: string;
}

export interface Label {
  id: string;
  nama: string;
}

export interface AppState {
  user: User;
  tasks: Task[];
  labels: Label[];
}