export interface Session {
  id: string;
  patient_id?: string;
  date: string;
  description: string;
  price: number;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  finalPrice: number;
  deliveredPrice: number;
  remainingBalance: number;
  sessions: Session[];
  gender: "male" | "female" | string;
  address?: string;
  medicalHistory?: string;
  birthDate?: Date;
  allergies?: string;
}

export interface PatientFormData {
  name: string;
  phone: string;
  email: string;
  gender: "male" | "female" | string;
  birthDate?: Date;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
}

export interface SessionFormData {
  date: string | any;
  description: string;
  price: number;
  notes?: string;
}
