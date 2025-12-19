using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using HotelApp.Domain.Constants;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Services;

public sealed class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IRoomRepository _roomRepository;

    public BookingService(IBookingRepository bookingRepository, IRoomRepository roomRepository)
    {
        _bookingRepository = bookingRepository;
        _roomRepository = roomRepository;
    }

    public async Task<Result<BookingResponse>> GetBookingByIdAsync(int id, int userId, string userRole)
    {
        Result<Booking> result = await _bookingRepository.GetByIdAsync(id);
        
        if (result.IsFailure)
        {
            return Result.Failure<BookingResponse>(result.Error);
        }

        if (result.Value.UserId != userId && userRole != Roles.Administrator)
        {
            return Result.Failure<BookingResponse>("Access denied");
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result<List<BookingResponse>>> GetUserBookingsAsync(int userId)
    {
        Result<List<Booking>> result = await _bookingRepository.GetByUserIdAsync(userId);
        
        if (result.IsFailure)
        {
            return Result.Failure<List<BookingResponse>>(result.Error);
        }

        List<BookingResponse> response = result.Value.Select(MapToResponse).ToList();
        return Result.Success(response);
    }

    public async Task<Result<List<BookingResponse>>> GetAllBookingsAsync()
    {
        Result<List<Booking>> result = await _bookingRepository.GetAllAsync();
        
        if (result.IsFailure)
        {
            return Result.Failure<List<BookingResponse>>(result.Error);
        }

        List<BookingResponse> response = result.Value.Select(MapToResponse).ToList();
        return Result.Success(response);
    }

    public async Task<Result<BookingResponse>> CreateBookingAsync(int userId, CreateBookingRequest request)
    {
        DateTime checkInDate = request.CheckInDate.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(request.CheckInDate, DateTimeKind.Utc) 
            : request.CheckInDate.ToUniversalTime();
            
        DateTime checkOutDate = request.CheckOutDate.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(request.CheckOutDate, DateTimeKind.Utc) 
            : request.CheckOutDate.ToUniversalTime();
        
        if (checkInDate >= checkOutDate)
        {
            return Result.Failure<BookingResponse>("Check-in date must be before check-out date");
        }

        Result<Room> roomResult = await _roomRepository.GetByIdAsync(request.RoomId);
        if (roomResult.IsFailure)
        {
            return Result.Failure<BookingResponse>("Room not found");
        }

        int nights = (checkOutDate.Date - checkInDate.Date).Days;
        decimal totalPrice = roomResult.Value.PricePerNight * nights;

        Result<Booking> result = await _bookingRepository.CreateAsync(
            userId,
            request.RoomId,
            checkInDate,
            checkOutDate,
            totalPrice);
        
        if (result.IsFailure)
        {
            return Result.Failure<BookingResponse>(result.Error);
        }

        Result<Booking> bookingWithDetails = await _bookingRepository.GetByIdAsync(result.Value.Id);
        
        if (bookingWithDetails.IsFailure)
        {
            return Result.Failure<BookingResponse>("Failed to retrieve booking details");
        }
        
        return Result.Success(MapToResponse(bookingWithDetails.Value));
    }

    public async Task<Result> CancelBookingAsync(int bookingId, int userId)
    {
        return await _bookingRepository.CancelAsync(bookingId, userId);
    }

    private static BookingResponse MapToResponse(Booking booking)
    {
        return new BookingResponse
        {
            Id = booking.Id,
            RoomId = booking.RoomId,
            RoomNumber = booking.Room?.RoomNumber ?? "N/A",
            HotelName = booking.Room?.Hotel?.Name ?? "Unknown Hotel",
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            TotalPrice = booking.TotalPrice,
            Status = booking.Status.ToString(),
            CreatedAt = booking.CreatedAt
        };
    }
}

