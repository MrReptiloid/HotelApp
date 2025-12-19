using CSharpFunctionalExtensions;
using HotelApp.Infrastructure.Data;
using HotelApp.Domain.Entities;
using HotelApp.Application.Interfaces;
using HotelApp.Application.DTOs;
using Microsoft.EntityFrameworkCore;
namespace HotelApp.Infrastructure.Repositories;
public sealed class RoomRepository : IRoomRepository
{
    private readonly AppDbContext _context;
    public RoomRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Result<Room>> CreateAsync(int hotelId, string roomNumber, decimal pricePerNight, int capacity, string description)
    {
        Hotel? hotel = await _context.Hotels.FindAsync(hotelId);
        if (hotel is null)
        {
            return Result.Failure<Room>("Hotel not found");
        }
        bool roomExists = await _context.Rooms.AnyAsync(r => r.HotelId == hotelId && r.RoomNumber == roomNumber);
        if (roomExists)
        {
            return Result.Failure<Room>("Room number already exists in this hotel");
        }
        Room room = new()
        {
            HotelId = hotelId,
            RoomNumber = roomNumber,
            PricePerNight = pricePerNight,
            Capacity = capacity,
            Description = description,
            IsAvailable = true
        };
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();
        return Result.Success(room);
    }
    public async Task<Result<Room>> GetByIdAsync(int id)
    {
        Room? room = await _context.Rooms.Include(r => r.Hotel).FirstOrDefaultAsync(r => r.Id == id);
        if (room is null)
        {
            return Result.Failure<Room>("Room not found");
        }
        return Result.Success(room);
    }
    public async Task<Result<List<Room>>> GetByHotelIdAsync(int hotelId)
    {
        List<Room> rooms = await _context.Rooms.Include(r => r.Hotel).Where(r => r.HotelId == hotelId).OrderBy(r => r.RoomNumber).ToListAsync();
        return Result.Success(rooms);
    }
    public async Task<Result<List<Room>>> SearchAvailableRoomsAsync(SearchRoomsRequest request)
    {
        IQueryable<Room> query = _context.Rooms.Include(r => r.Hotel).Where(r => r.IsAvailable);
        if (!string.IsNullOrWhiteSpace(request.City))
        {
            query = query.Where(r => r.Hotel.City.Contains(request.City));
        }
        if (request.MinCapacity.HasValue)
        {
            query = query.Where(r => r.Capacity >= request.MinCapacity.Value);
        }
        if (request.MaxPrice.HasValue)
        {
            query = query.Where(r => r.PricePerNight <= request.MaxPrice.Value);
        }
        if (request.CheckInDate.HasValue && request.CheckOutDate.HasValue)
        {
            List<int> bookedRoomIds = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed && 
                    ((b.CheckInDate <= request.CheckInDate && b.CheckOutDate > request.CheckInDate) || 
                    (b.CheckInDate < request.CheckOutDate && b.CheckOutDate >= request.CheckOutDate) || 
                    (b.CheckInDate >= request.CheckInDate && b.CheckOutDate <= request.CheckOutDate)))
                .Select(b => b.RoomId).Distinct().ToListAsync();
            query = query.Where(r => !bookedRoomIds.Contains(r.Id));
        }
        List<Room> rooms = await query.OrderBy(r => r.PricePerNight).ToListAsync();
        return Result.Success(rooms);
    }
    public async Task<Result<Room>> UpdateAsync(int id, string roomNumber, decimal pricePerNight, int capacity, string description, bool isAvailable)
    {
        Room? room = await _context.Rooms.FindAsync(id);
        if (room is null)
        {
            return Result.Failure<Room>("Room not found");
        }
        bool roomNumberExists = await _context.Rooms.AnyAsync(r => r.HotelId == room.HotelId && r.RoomNumber == roomNumber && r.Id != id);
        if (roomNumberExists)
        {
            return Result.Failure<Room>("Room number already exists in this hotel");
        }
        room.RoomNumber = roomNumber;
        room.PricePerNight = pricePerNight;
        room.Capacity = capacity;
        room.Description = description;
        room.IsAvailable = isAvailable;
        await _context.SaveChangesAsync();
        return Result.Success(room);
    }
    public async Task<Result> DeleteAsync(int id)
    {
        Room? room = await _context.Rooms.FindAsync(id);
        if (room is null)
        {
            return Result.Failure("Room not found");
        }
        bool hasBookings = await _context.Bookings.AnyAsync(b => b.RoomId == id && b.Status == BookingStatus.Confirmed);
        if (hasBookings)
        {
            return Result.Failure("Cannot delete room with active bookings");
        }
        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
        return Result.Success();
    }
    public async Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut)
    {
        bool hasConflict = await _context.Bookings.AnyAsync(b => b.RoomId == roomId && 
            b.Status == BookingStatus.Confirmed && 
            ((b.CheckInDate <= checkIn && b.CheckOutDate > checkIn) || 
            (b.CheckInDate < checkOut && b.CheckOutDate >= checkOut) || 
            (b.CheckInDate >= checkIn && b.CheckOutDate <= checkOut)));
        return !hasConflict;
    }
}
