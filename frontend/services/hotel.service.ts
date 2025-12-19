import api from '../lib/api';
import { Hotel, CreateHotelRequest, UpdateHotelRequest } from '@/types/api';

export class HotelService {
  async getAll(): Promise<Hotel[]> {
    const response = await api.getHotels();
    return response.data;
  }

  async getById(id: number): Promise<Hotel> {
    const response = await api.getHotel(id);
    return response.data;
  }

  async searchByCity(city: string): Promise<Hotel[]> {
    const response = await api.searchHotelsByCity(city);
    return response.data;
  }

  async create(data: CreateHotelRequest): Promise<Hotel> {
    const response = await api.createHotel(data);
    return response.data;
  }

  async update(id: number, data: UpdateHotelRequest): Promise<Hotel> {
    const response = await api.updateHotel(id, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.deleteHotel(id);
  }
}

export const hotelService = new HotelService();

