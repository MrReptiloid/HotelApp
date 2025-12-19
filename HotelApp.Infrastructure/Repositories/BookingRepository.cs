using CSharpFunctionalExtensions;
using HotelApp.Infrastructure.Data;
using HotelApp.Domain.Entities;
using HotelApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelApp.Infrastructure.Repositories;

public sealed class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _context;

    public BookingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Booking>> CreateAsync(int userId, int roomId, DateTime checkInDate, DateTime checkOutDate, decimal totalPrice)
    {
        if (checkInDate.Kind == DateTimeKind.Unspecified)
        {
            checkInDate = DateTime.SpecifyKind(checkInDate, DateTimeKind.Utc);
        }
        
        if (checkOutDate.Kind == DateTimeKind.Unspecified)
        {
            checkOutDate = DateTime.SpecifyKind(checkOutDate, DateTimeKind.Utc);
        }
        
        if (checkInDate >= checkOutDate)
        {
            return Result.Failure<Booking>("Check-in date must be before check-out date");
        }

        if (checkInDate.Date < DateTime.UtcNow.Date)
        {
            return Result.Failure<Booking>("Check-in date cannot be in the past");
        }

        Room? room = await _context.Rooms.FindAsync(roomId);
        if (room is null)
        {
            return Result.Failure<Booking>("Room not found");
        }

        if (!room.IsAvailable)
        {
            return Result.Failure<Booking>("Room is not available");
        }

        bool hasConflict = await _context.Bookings
            .AnyAsync(b => b.RoomId == roomId &&
                          b.Status == BookingStatus.Confirmed &&
                          ((b.CheckInDate <= checkInDate && b.CheckOutDate > checkInDate) ||
                           (b.CheckInDate < checkOutDate && b.CheckOutDate >= checkOutDate) ||
                           (b.CheckInDate >= checkInDate && b.CheckOutDate <= checkOutDate)));

        if (hasConflict)
        {
            return Result.Failure<Booking>("Room is already booked for the selected dates");
        }

        Booking booking = new()
        {
            UserId = userId,
            RoomId = roomId,
            CheckInDate = checkInDate,
            CheckOutDate = checkOutDate,
            TotalPrice = totalPrice,
            Status = BookingStatus.Confirmed,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return Result.Success(booking);
    }

    public async Task<Result<Booking>> GetByIdAsync(int id)
    {
        Booking? booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Room)
            .ThenInclude(r => r.Hotel)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking is null)
        {
            return Result.Failure<Booking>("Booking not found");
        }

        return Result.Success(booking);
    }

    public async Task<Result<List<Booking>>> GetByUserIdAsync(int userId)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Room)
            .ThenInclude(r => r.Hotel)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Result.Success(bookings);
    }

    public async Task<Result<List<Booking>>> GetAllAsync()
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Room)
            .ThenInclude(r => r.Hotel)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Result.Success(bookings);
    }

    public async Task<Result<Booking>> CancelAsync(int bookingId, int userId)
    {
        Booking? booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

        if (booking is null)
        {
            return Result.Failure<Booking>("Booking not found");
        }

        if (booking.Status == BookingStatus.Cancelled)
        {
            return Result.Failure<Booking>("Booking is already cancelled");
        }

        if (booking.Status == BookingStatus.Completed)
        {
            return Result.Failure<Booking>("Cannot cancel completed booking");
        }

        booking.Status = BookingStatus.Cancelled;
        await _context.SaveChangesAsync();

        return Result.Success(booking);
    }
}

