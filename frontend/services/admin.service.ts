import api from '../lib/api';
import { Booking, Statistics } from '../types/api';

export class AdminService {
  async getAllBookings(): Promise<Booking[]> {
    const response = await api.getAllBookings();
    return response.data;
  }

  async getStatistics(): Promise<Statistics> {
    const response = await api.getStatistics();
    return response.data;
  }
}

export const adminService = new AdminService();

