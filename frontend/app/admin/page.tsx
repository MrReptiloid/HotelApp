'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { adminService } from '@/services/admin.service';
import { hotelService } from '@/services/hotel.service';
import { roomService } from '@/services/room.service';
import { Statistics, Hotel, Booking, Room } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'hotels' | 'bookings'>('stats');
  const [stats, setStats] = useState<Statistics | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedHotelForRoom, setSelectedHotelForRoom] = useState<Hotel | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewingHotelRooms, setViewingHotelRooms] = useState<number | null>(null);
  const [hotelRooms, setHotelRooms] = useState<Room[]>([]);
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    loadData();
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const data = await adminService.getStatistics();
        setStats(data);
      } else if (activeTab === 'hotels') {
        const data = await hotelService.getAll();
        setHotels(data);
      } else if (activeTab === 'bookings') {
        const data = await adminService.getAllBookings();
        setBookings(data);
      }
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      await hotelService.delete(id);
      showToast('Hotel deleted successfully', 'success');
      loadData();
    } catch (error) {
      showToast('Failed to delete hotel', 'error');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomService.delete(id);
      showToast('Room deleted successfully', 'success');
      if (viewingHotelRooms) {
        loadHotelRooms(viewingHotelRooms);
      }
      loadData();
    } catch (error) {
      showToast('Failed to delete room', 'error');
    }
  };

  const loadHotelRooms = async (hotelId: number) => {
    try {
      const rooms = await roomService.getByHotel(hotelId);
      setHotelRooms(rooms);
      setViewingHotelRooms(hotelId);
    } catch (error) {
      showToast('Failed to load rooms', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Panel</h1>

          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'stats'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'hotels'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hotels Management
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'bookings'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Bookings
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'stats' && stats && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Users</h3>
                      <p className="text-2xl font-medium text-gray-900 mt-3">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Hotels</h3>
                      <p className="text-2xl font-medium text-gray-900 mt-3">{stats.totalHotels}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Rooms</h3>
                      <p className="text-2xl font-medium text-gray-900 mt-3">{stats.totalRooms}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Bookings</h3>
                      <p className="text-2xl font-medium text-gray-900 mt-3">{stats.totalBookings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Bookings</h3>
                      <p className="text-2xl font-medium text-gray-900 mt-3">{stats.activeBookings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</h3>
                      <p className="text-2xl font-medium text-gray-900 mt-3">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-base font-medium text-gray-900 mb-6">Bookings by Month</h3>
                    <div className="space-y-4">
                      {stats.bookingsByMonth.map((stat, index) => (
                        <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <span className="text-sm text-gray-600">
                            {new Date(stat.year, stat.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">{stat.count} bookings</span>
                            <span className="ml-4 text-sm text-gray-600">${stat.revenue.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hotels' && (
                <div>
                  <button
                    onClick={() => {
                      setEditingHotel(null);
                      setShowHotelModal(true);
                    }}
                    className="mb-6 bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-gray-800 text-sm font-medium transition"
                  >
                    Add Hotel
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {hotels.map((hotel) => (
                      <div key={hotel.id} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                        <h3 className="text-base font-medium text-gray-900 mb-3">{hotel.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{hotel.city}</p>
                        <p className="text-xs text-gray-500 mb-3">{hotel.address}</p>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{hotel.description}</p>
                        <p className="text-xs text-gray-500 mb-5 pb-5 border-b border-gray-100">
                          {hotel.roomCount || 0} rooms available
                        </p>
                        <div className="space-y-2 mt-auto">
                          <div className="flex gap-2">
                            <button
                              onClick={() => loadHotelRooms(hotel.id)}
                              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-xs font-medium transition border border-gray-200"
                            >
                              View Rooms
                            </button>
                            <button
                              onClick={() => {
                                setSelectedHotelForRoom(hotel);
                                setEditingRoom(null);
                                setShowRoomModal(true);
                              }}
                              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-800 text-xs font-medium transition"
                            >
                              Add Room
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingHotel(hotel);
                                setShowHotelModal(true);
                              }}
                              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-xs font-medium transition border border-gray-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteHotel(hotel.id)}
                              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-xs font-medium transition border border-gray-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{booking.hotelName}</h3>
                          <p className="text-sm text-gray-500 mt-1">Room {booking.roomNumber}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded text-xs font-medium border ${
                            booking.status === 'Confirmed' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                            booking.status === 'Cancelled' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {booking.status}
                          </span>
                          <p className="mt-3 font-medium text-base text-gray-900">${booking.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showHotelModal && <HotelModal />}
      {showRoomModal && <RoomModal />}
      {viewingHotelRooms && <RoomsViewModal />}
    </div>
  );

  function HotelModal() {
    const [formData, setFormData] = useState({
      name: editingHotel?.name || '',
      city: editingHotel?.city || '',
      address: editingHotel?.address || '',
      description: editingHotel?.description || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        if (editingHotel) {
          await hotelService.update(editingHotel.id, formData);
          showToast('Hotel updated successfully', 'success');
        } else {
          await hotelService.create(formData);
          showToast('Hotel created successfully', 'success');
        }
        setShowHotelModal(false);
        loadData();
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showToast(axiosError.response?.data?.message || 'Operation failed', 'error');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-xl">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Hotel Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="Grand Hotel"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="Kyiv"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="Khreshchatyk St, 1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="Luxury hotel in the heart of the city..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowHotelModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 text-sm font-medium"
              >
                {submitting ? 'Saving...' : editingHotel ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function RoomModal() {
    const [formData, setFormData] = useState({
      hotelId: selectedHotelForRoom?.id || editingRoom?.hotelId || 0,
      roomNumber: editingRoom?.roomNumber || '',
      pricePerNight: editingRoom?.pricePerNight || '',
      capacity: editingRoom?.capacity || '',
      description: editingRoom?.description || '',
      isAvailable: editingRoom?.isAvailable !== undefined ? editingRoom.isAvailable : true,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const roomData = {
          ...formData,
          hotelId: formData.hotelId,
          pricePerNight: parseFloat(String(formData.pricePerNight)),
          capacity: parseInt(String(formData.capacity)),
        };

        if (editingRoom) {
          await roomService.update(editingRoom.id, roomData);
          showToast('Room updated successfully', 'success');
        } else {
          await roomService.create(roomData);
          showToast('Room created successfully', 'success');
        }
        setShowRoomModal(false);
        loadData();
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        showToast(axiosError.response?.data?.message || 'Operation failed', 'error');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 max-h-[90vh] overflow-y-auto shadow-xl">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingRoom ? 'Edit Room' : `Add Room to ${selectedHotelForRoom?.name}`}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Price Per Night ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="100.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Capacity (guests)
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
                placeholder="Standard room with double bed..."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                Room is available for booking
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRoomModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 text-sm font-medium"
              >
                {submitting ? 'Saving...' : editingRoom ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function RoomsViewModal() {
    const hotel = hotels.find(h => h.id === viewingHotelRooms);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-medium text-gray-900">
              Rooms in {hotel?.name}
            </h3>
            <button
              onClick={() => {
                setViewingHotelRooms(null);
                setHotelRooms([]);
              }}
              className="text-gray-400 hover:text-gray-600 text-xl font-light"
            >
              X
            </button>
          </div>

          {hotelRooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6 text-sm">No rooms in this hotel yet</p>
              <button
                onClick={() => {
                  setSelectedHotelForRoom(hotel);
                  setEditingRoom(null);
                  setShowRoomModal(true);
                }}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-md hover:bg-gray-800 text-sm font-medium transition"
              >
                Add First Room
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setSelectedHotelForRoom(hotel);
                  setEditingRoom(null);
                  setShowRoomModal(true);
                }}
                className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-md hover:bg-gray-800 text-sm font-medium transition"
              >
                Add New Room
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotelRooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-lg p-5 border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-base font-medium text-gray-900">
                        Room {room.roomNumber}
                      </h4>
                      {room.isAvailable ? (
                        <span className="text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 px-2 py-1 border border-gray-200 rounded bg-gray-50">
                          Not Available
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{room.description}</p>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <span className="text-gray-500 text-xs">
                        Capacity: {room.capacity} guests
                      </span>
                      <div>
                        <span className="text-base font-medium text-gray-900">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/ night</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setEditingRoom(room);
                          setSelectedHotelForRoom(hotel);
                          setShowRoomModal(true);
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-xs font-medium transition border border-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-xs font-medium transition border border-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

