'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { hotelService } from '@/services/hotel.service';
import { roomService } from '@/services/room.service';
import { Hotel, Room } from '@/types/api';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Record<number, Room[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const data = await hotelService.getAll();
      setHotels(data);
      
      for (const hotel of data) {
        const hotelRooms = await roomService.getByHotel(hotel.id);
        setRooms(prev => ({ ...prev, [hotel.id]: hotelRooms }));
      }
    } catch (error) {
      showToast('Failed to load hotels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchCity.trim()) {
      loadHotels();
      return;
    }
    
    setLoading(true);
    try {
      const data = await hotelService.searchByCity(searchCity);
      setHotels(data);
      
      setRooms({});
      for (const hotel of data) {
        const hotelRooms = await roomService.getByHotel(hotel.id);
        setRooms(prev => ({ ...prev, [hotel.id]: hotelRooms }));
      }
    } catch {
      showToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotels...</p>
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Available Hotels</h1>
          
          <div className="mb-8 flex gap-3">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by city..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium transition"
            >
              Search
            </button>
            {searchCity && (
              <button
                onClick={() => {
                  setSearchCity('');
                  loadHotels();
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 border border-gray-200 text-sm font-medium transition"
              >
                Clear
              </button>
            )}
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hotels found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-base font-medium text-gray-900 mb-3">{hotel.name}</h2>
                    <p className="text-xs text-gray-500 mb-1">{hotel.city}</p>
                    <p className="text-xs text-gray-500 mb-4">{hotel.address}</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{hotel.description}</p>
                    
                    <div className="border-t border-gray-100 pt-5">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Available Rooms ({rooms[hotel.id]?.length || 0})
                      </h3>
                      {rooms[hotel.id]?.length > 0 ? (
                        <div className="space-y-3">
                          {rooms[hotel.id].slice(0, 3).map((room) => (
                            <div key={room.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                Room {room.roomNumber} • {room.capacity} guests
                              </span>
                              <div>
                                <span className="font-medium text-gray-900">
                                  ${room.pricePerNight}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">/night</span>
                              </div>
                            </div>
                          ))}
                          {rooms[hotel.id].length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{rooms[hotel.id].length - 3} more rooms
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No rooms available</p>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <Link
                        href={`/hotels/${hotel.id}`}
                        className="block w-full text-center bg-gray-900 text-white py-2.5 px-4 rounded-md hover:bg-gray-800 transition text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
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

