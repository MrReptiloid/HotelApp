export interface User {
  id: number;
  email: string;
  displayName?: string;
  role: string;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  roomCount: number;
  createdAt: string;
}

export interface Room {
  id: number;
  hotelId: number;
  hotelName: string;
  roomNumber: string;
  pricePerNight: number;
  capacity: number;
  description: string;
  isAvailable: boolean;
}

export interface Booking {
  id: number;
  roomId: number;
  roomNumber: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface Statistics {
  totalUsers: number;
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  bookingsByMonth: BookingsByMonth[];
}

export interface BookingsByMonth {
  year: number;
  month: number;
  count: number;
  revenue: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface CreateHotelRequest {
  name: string;
  city: string;
  address: string;
  description: string;
}

export interface UpdateHotelRequest {
  name: string;
  city: string;
  address: string;
  description: string;
}

export interface CreateRoomRequest {
  hotelId: number;
  roomNumber: string;
  pricePerNight: number;
  capacity: number;
  description: string;
  isAvailable: boolean;
}

export interface UpdateRoomRequest {
  hotelId: number;
  roomNumber: string;
  pricePerNight: number;
  capacity: number;
  description: string;
  isAvailable: boolean;
}

export interface SearchRoomsRequest {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  minCapacity?: number;
  maxPrice?: number;
}

export interface CreateBookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

