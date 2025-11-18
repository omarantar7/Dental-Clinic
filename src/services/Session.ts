import api from "./api";
import type { Session } from "@/types/Patient";

interface SessionResponse {
  success: boolean;
  data: Session;
  message?: string;
}

interface SessionData {
  date: string;
  description: string;
  price: number;
  notes?: string;
  payment_amount?: number;
  visited_lab?: boolean;
  lab_id?: number;
  lab_work_type?: string;
  lab_cost?: number;
  lab_description?: string;
}

class SessionService {
  /**
   * Create a new session
   */
  async createSession(patientId: string, data: SessionData): Promise<Session> {
    const response = await api.post<SessionResponse>(
      `/patients/${patientId}/sessions`,
      data
    );
    return response.data.data;
  }

  /**
   * Update a session
   */
  async updateSession(
    patientId: string,
    sessionId: string,
    data: SessionData
  ): Promise<Session> {
    const response = await api.put<SessionResponse>(
      `/patients/${patientId}/sessions/${sessionId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete a session
   */
  async deleteSession(patientId: string, sessionId: string): Promise<void> {
    await api.delete(`/patients/${patientId}/sessions/${sessionId}`);
  }

  /**
   * Add payment to session
   */
  async addPayment(
    patientId: string,
    sessionId: string,
    data: { amount: number; payment_date: string; notes?: string }
  ): Promise<void> {
    await api.post(
      `/patients/${patientId}/sessions/${sessionId}/payments`,
      data
    );
  }
}

export default new SessionService();
