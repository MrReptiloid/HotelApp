import api from '../lib/api';
import { Booking, CreateBookingRequest } from '../types/api';

export class BookingService {
  async getMyBookings(): Promise<Booking[]> {
    const response = await api.getMyBookings();
    return response.data;
  }

  async getById(id: number): Promise<Booking> {
    const response = await api.getBooking(id);
    return response.data;
  }

  async create(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.createBooking(data);
    return response.data;
  }

  async cancel(id: number): Promise<void> {
    await api.cancelBooking(id);
  }
}

export const bookingService = new BookingService();

