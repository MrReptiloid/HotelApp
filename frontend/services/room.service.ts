import api from '../lib/api';
import { Room, CreateRoomRequest, UpdateRoomRequest, SearchRoomsRequest } from '@/types/api';

export class RoomService {
  async getById(id: number): Promise<Room> {
    const response = await api.getRoom(id);
    return response.data;
  }

  async getByHotel(hotelId: number): Promise<Room[]> {
    const response = await api.getRoomsByHotel(hotelId);
    return response.data;
  }

  async search(params: SearchRoomsRequest): Promise<Room[]> {
    const response = await api.searchRooms(params);
    return response.data;
  }

  async create(data: CreateRoomRequest): Promise<Room> {
    const response = await api.createRoom(data);
    return response.data;
  }

  async update(id: number, data: UpdateRoomRequest): Promise<Room> {
    const response = await api.updateRoom(id, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.deleteRoom(id);
  }
}

export const roomService = new RoomService();

