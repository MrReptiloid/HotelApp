'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { bookingService } from '../../services/booking.service';
import { Booking } from '../../types/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadBookings();
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancel(id);
      showToast('Booking cancelled successfully', 'success');
      loadBookings();
    } catch (error) {
      showToast('Failed to cancel booking', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-gray-50 text-gray-500 border-gray-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6 text-sm">You don&apos;t have any bookings yet</p>
              <button
                onClick={() => router.push('/hotels')}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-md hover:bg-gray-800 text-sm font-medium transition"
              >
                Browse Hotels
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-base font-medium text-gray-900 mb-3">
                        {booking.hotelName}
                      </h2>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="text-xs text-gray-500">Room: {booking.roomNumber}</p>
                        <p className="text-xs text-gray-500">
                          Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                        <p className="font-medium text-base text-gray-900 mt-3 pt-3 border-t border-gray-100">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-medium border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      {booking.status.toLowerCase() === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="mt-4 block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-xs font-medium transition border border-gray-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Booked on: {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

