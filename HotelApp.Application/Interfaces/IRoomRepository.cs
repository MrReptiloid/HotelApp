using CSharpFunctionalExtensions;
using HotelApp.Domain.Entities;
using HotelApp.Application.DTOs;

namespace HotelApp.Application.Interfaces;

public interface IRoomRepository
{
    Task<Result<Room>> CreateAsync(int hotelId, string roomNumber, decimal pricePerNight, int capacity, string description);
    Task<Result<Room>> GetByIdAsync(int id);
    Task<Result<List<Room>>> GetByHotelIdAsync(int hotelId);
    Task<Result<List<Room>>> SearchAvailableRoomsAsync(SearchRoomsRequest request);
    Task<Result<Room>> UpdateAsync(int id, string roomNumber, decimal pricePerNight, int capacity, string description, bool isAvailable);
    Task<Result> DeleteAsync(int id);
    Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut);
}

