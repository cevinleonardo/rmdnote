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
  onboarding_completed: boolean;
}

export type RepetitionType = 'tidak_ada' | 'harian' | 'mingguan' | 'bulanan' | 'tahunan' | 'pilih_tanggal';

export type PriorityType = 
  | 'Tinggi' | 'Sedang' | 'Rendah' // For repetition tasks
  | 'mendesak_penting' | 'mendesak_tidak_penting' | 'tidak_mendesak_penting' | 'tidak_mendesak_tidak_penting'; // Eisenhower Matrix

export interface Repetition {
  tipe: RepetitionType;
  hari_dipilih?: string[]; // For 'harian': ['senin', 'selasa', etc]
  custom_dates?: string[]; // For 'pilih_tanggal'
  monthly_option?: 'last_date' | 'skip_month'; // For 'bulanan' when date doesn't exist
}

export interface Task {
  id: string;
  nama: string;
  catatan?: string;
  deadline: string;
  pengulangan: Repetition;
  prioritas: PriorityType;
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

export interface PhotoProfileOption {
  type: 'edit' | 'delete';
  label: string;
  icon: string;
  variant?: 'default' | 'destructive';
}