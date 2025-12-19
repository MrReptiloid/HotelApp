'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { hotelService } from '@/services/hotel.service';
import { roomService } from '@/services/room.service';
import { bookingService } from '@/services/booking.service';
import { Hotel, Room } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const hotelId = parseInt(unwrappedParams.id);
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadHotelDetails();
  }, [hotelId]);

  const loadHotelDetails = async () => {
    try {
      const hotelData = await hotelService.getById(hotelId);
      const roomsData = await roomService.getByHotel(hotelId);
      setHotel(hotelData);
      setRooms(roomsData);
    } catch (error) {
      showToast('Failed to load hotel details', 'error');
      router.push('/hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room: Room) => {
    if (!isAuthenticated) {
      showToast('Please login to book a room', 'warning');
      router.push('/login');
      return;
    }
    setBookingRoom(room);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRoom) return;

    if (new Date(checkIn) >= new Date(checkOut)) {
      showToast('Check-out date must be after check-in date', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.create({
        roomId: bookingRoom.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });
      showToast('Booking created successfully!', 'success');
      setBookingRoom(null);
      router.push('/bookings');
    } catch (error: unknown) {
      console.error('Booking error:', error);
      const axiosError = error as {
        response?: { data?: { message?: string; title?: string } | string };
        message?: string
      };
      const errorData = axiosError.response?.data;
      const errorMessage = (typeof errorData === 'object' && errorData?.message)
        || (typeof errorData === 'object' && errorData?.title)
        || (typeof errorData === 'string' ? errorData : '')
        || axiosError.message
        || 'Booking failed. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">{hotel.name}</h1>
                <p className="text-sm text-gray-500 mb-1">
                  {hotel.address}, {hotel.city}
                </p>
                <p className="text-gray-600 mt-6 leading-relaxed">{hotel.description}</p>
              </div>
              <div className="text-right ml-8">
                <div className="bg-gray-50 px-6 py-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Available</p>
                  <p className="text-xl font-medium text-gray-900">{rooms.length}</p>
                  <p className="text-xs text-gray-500">rooms</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">Available Rooms</h2>
          {rooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">No rooms available at this hotel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-base font-medium text-gray-900">
                        Room {room.roomNumber}
                      </h3>
                      {room.isAvailable ? (
                        <span className="text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 px-2 py-1 border border-gray-200 rounded bg-gray-50">
                          Booked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">{room.description}</p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Capacity: {room.capacity} guests</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-lg font-medium text-gray-900">
                            ${room.pricePerNight}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/ night</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleBookRoom(room)}
                        disabled={!room.isAvailable}
                        className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition ${
                          room.isAvailable
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        {room.isAvailable ? 'Book Room' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {bookingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Book Room {bookingRoom.roomNumber}
            </h3>
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                />
              </div>
              <div className="bg-gray-50 p-5 rounded-md border border-gray-100">
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-gray-500">Price per night</span>
                  <span className="text-gray-900">${bookingRoom.pricePerNight}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-gray-500">Nights</span>
                  <span className="text-gray-900">
                    {checkIn && checkOut
                      ? Math.max(
                          0,
                          Math.ceil(
                            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : 0}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total</span>
                  <span className="text-lg font-medium text-gray-900">
                    $
                    {checkIn && checkOut
                      ? (
                          bookingRoom.pricePerNight *
                          Math.max(
                            0,
                            Math.ceil(
                              (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        ).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingRoom(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 text-sm font-medium"
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

