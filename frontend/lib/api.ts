import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from './env';

const API_URL = env.apiUrl;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string }>) => {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
              break;
            case 403:
              console.error('Access forbidden:', data?.message || data);
              break;
            case 404:
              console.error('Resource not found:', data?.message || data);
              break;
            case 500:
              console.error('Server error:', data?.message || data || error.message);
              break;
            default:
              console.error('API Error:', status, data?.message || data);
          }
        } else if (error.request) {
          console.error('No response from server. Please check your connection.');
        } else {
          console.error('Request error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    return this.client.post('/Account/login', { email, password });
  }

  async register(email: string, password: string, displayName?: string) {
    return this.client.post('/Account/register', { email, password, displayName });
  }

  async logout() {
    return this.client.post('/Account/logout');
  }

  async refreshSession() {
    return this.client.post('/Account/refresh');
  }

  async getHotels() {
    return this.client.get('/api/hotels');
  }

  async getHotel(id: number) {
    return this.client.get(`/api/hotels/${id}`);
  }

  async searchHotelsByCity(city: string) {
    return this.client.get(`/api/hotels/search?city=${encodeURIComponent(city)}`);
  }

  async createHotel(data: { name: string; city: string; address: string; description: string }) {
    return this.client.post('/api/hotels', data);
  }

  async updateHotel(id: number, data: { name: string; city: string; address: string; description: string }) {
    return this.client.put(`/api/hotels/${id}`, data);
  }

  async deleteHotel(id: number) {
    return this.client.delete(`/api/hotels/${id}`);
  }

  async getRoom(id: number) {
    return this.client.get(`/api/rooms/${id}`);
  }

  async getRoomsByHotel(hotelId: number) {
    return this.client.get(`/api/rooms/hotel/${hotelId}`);
  }

  async searchRooms(params: {
    city?: string;
    checkInDate?: string;
    checkOutDate?: string;
    minCapacity?: number;
    maxPrice?: number
  }) {
    const query = new URLSearchParams();
    if (params.city) query.append('city', params.city);
    if (params.checkInDate) query.append('checkInDate', params.checkInDate);
    if (params.checkOutDate) query.append('checkOutDate', params.checkOutDate);
    if (params.minCapacity) query.append('minCapacity', params.minCapacity.toString());
    if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    
    return this.client.get(`/api/rooms/search?${query.toString()}`);
  }

  async createRoom(data: {
    hotelId: number;
    roomNumber: string;
    pricePerNight: number;
    capacity: number;
    description: string;
    isAvailable: boolean
  }) {
    return this.client.post('/api/rooms', data);
  }

  async updateRoom(id: number, data: {
    hotelId: number;
    roomNumber: string;
    pricePerNight: number;
    capacity: number;
    description: string;
    isAvailable: boolean
  }) {
    return this.client.put(`/api/rooms/${id}`, data);
  }

  async deleteRoom(id: number) {
    return this.client.delete(`/api/rooms/${id}`);
  }

  async getMyBookings() {
    return this.client.get('/api/bookings/my');
  }

  async getBooking(id: number) {
    return this.client.get(`/api/bookings/${id}`);
  }

  async createBooking(data: { roomId: number; checkInDate: string; checkOutDate: string }) {
    return this.client.post('/api/bookings', data);
  }

  async cancelBooking(id: number) {
    return this.client.post(`/api/bookings/${id}/cancel`);
  }

  async getAllBookings() {
    return this.client.get('/api/admin/bookings');
  }

  async getStatistics() {
    return this.client.get('/api/admin/stats');
  }
}

export const api = new ApiClient();
export default api;

