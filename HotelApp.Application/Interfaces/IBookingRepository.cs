using CSharpFunctionalExtensions;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Interfaces;

public interface IBookingRepository
{
    Task<Result<Booking>> CreateAsync(int userId, int roomId, DateTime checkInDate, DateTime checkOutDate, decimal totalPrice);
    Task<Result<Booking>> GetByIdAsync(int id);
    Task<Result<List<Booking>>> GetByUserIdAsync(int userId);
    Task<Result<List<Booking>>> GetAllAsync();
    Task<Result<Booking>> CancelAsync(int bookingId, int userId);
}

