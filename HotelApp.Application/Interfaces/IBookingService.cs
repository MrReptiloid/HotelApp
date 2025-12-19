using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;

namespace HotelApp.Application.Interfaces;

public interface IBookingService
{
    Task<Result<BookingResponse>> GetBookingByIdAsync(int id, int userId, string userRole);
    Task<Result<List<BookingResponse>>> GetUserBookingsAsync(int userId);
    Task<Result<List<BookingResponse>>> GetAllBookingsAsync();
    Task<Result<BookingResponse>> CreateBookingAsync(int userId, CreateBookingRequest request);
    Task<Result> CancelBookingAsync(int bookingId, int userId);
}

