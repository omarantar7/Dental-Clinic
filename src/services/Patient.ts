import api from "./api";
import type { Patient, PatientFormData } from "@/types/Patient";

interface PatientsResponse {
  success: boolean;
  data: Patient[];
}

export interface PatientResponse {
  success: boolean;
  data: Patient;
  message?: string;
}

interface StatisticsResponse {
  success: boolean;
  data: {
    totalPatients: number;
    totalRevenue: number;
    totalPending: number;
    totalSessions: number;
  };
}

interface LabsResponse {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    contact_person_name: string;
    phone_number: string;
    email: string;
  }>;
}

class PatientService {
  /**
   * Get all patients
   */
  async getPatients(): Promise<Patient[]> {
    const response = await api.get<PatientsResponse>("/patients");
    return response.data.data;
  }

  /**
   * Get a single patient by ID
   */
  async getPatient(id: string): Promise<Patient> {
    const response = await api.get<PatientResponse>(`/patients/${id}`);
    return response.data.data;
  }

  /**
   * Create a new patient
   */
  async createPatient(data: {
    name: string;
    phone: string;
    email?: string;
    birthDate?: string;
    gender?: "male" | "female";
    address?: string;
    medicalHistory?: string;
    allergies?: string;
  }): Promise<Patient> {
    const payload = {
      full_name: data.name,
      phone_number: data.phone,
      email: data.email || null,
      birth_date: data.birthDate || null,
      gender: data.gender || "male",
      address: data.address || null,
      medical_history: data.medicalHistory || null,
      allergies: data.allergies || null,
    };

    console.log("Payload being sent:", payload);

    const response = await api.post<PatientResponse>("/patients", payload);
    return response.data.data;
  }

  /**
   * Update a patient
   */
  async updatePatient(
    id: string,
    data: { name: string; phone: string; email?: string }
  ): Promise<Patient> {
    const response = await api.put<PatientResponse>(`/patients/${id}`, {
      full_name: data.name,
      phone_number: data.phone,
      email: data.email,
    });
    return response.data.data;
  }

  /**
   * Delete a patient
   */
  async deletePatient(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  }

  /**
   * Get dashboard statistics
   */
  async getStatistics() {
    const response = await api.get<StatisticsResponse>("/patients/statistics");
    return response.data.data;
  }

  /**
   * Get available labs
   */
  async getLabs() {
    const response = await api.get<LabsResponse>("/labs");
    return response.data.data;
  }
}

export default new PatientService();
