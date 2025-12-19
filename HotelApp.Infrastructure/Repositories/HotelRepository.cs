using CSharpFunctionalExtensions;
using HotelApp.Infrastructure.Data;
using HotelApp.Domain.Entities;
using HotelApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelApp.Infrastructure.Repositories;

public sealed class HotelRepository : IHotelRepository
{
    private readonly AppDbContext _context;

    public HotelRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Hotel>> CreateAsync(string name, string city, string? address, string? description)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result.Failure<Hotel>("Hotel name is required");
        }

        if (string.IsNullOrWhiteSpace(city))
        {
            return Result.Failure<Hotel>("City is required");
        }

        Hotel hotel = new()
        {
            Name = name,
            City = city,
            Address = address ?? string.Empty,
            Description = description ?? string.Empty,
        };

        _context.Hotels.Add(hotel);
        await _context.SaveChangesAsync();

        return Result.Success(hotel);
    }

    public async Task<Result<Hotel>> GetByIdAsync(int id)
    {
        Hotel? hotel = await _context.Hotels
            .Include(h => h.Rooms)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (hotel is null)
        {
            return Result.Failure<Hotel>("Hotel not found");
        }

        return Result.Success(hotel);
    }

    public async Task<Result<List<Hotel>>> GetAllAsync()
    {
        List<Hotel> hotels = await _context.Hotels
            .Include(h => h.Rooms)
            .OrderBy(h => h.Name)
            .ToListAsync();

        return Result.Success(hotels);
    }

    public async Task<Result<List<Hotel>>> SearchByCityAsync(string city)
    {
        if (string.IsNullOrWhiteSpace(city))
        {
            return Result.Failure<List<Hotel>>("City parameter is required");
        }

        List<Hotel> hotels = await _context.Hotels
            .Include(h => h.Rooms)
            .Where(h => h.City.ToLower().Contains(city.ToLower()))
            .OrderBy(h => h.Name)
            .ToListAsync();

        return Result.Success(hotels);
    }

    public async Task<Result<Hotel>> UpdateAsync(int id, string name, string city, string? address, string? description)
    {
        Hotel? hotel = await _context.Hotels.FindAsync(id);

        if (hotel is null)
        {
            return Result.Failure<Hotel>("Hotel not found");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            return Result.Failure<Hotel>("Hotel name is required");
        }

        if (string.IsNullOrWhiteSpace(city))
        {
            return Result.Failure<Hotel>("City is required");
        }

        hotel.Name = name;
        hotel.City = city;
        hotel.Address = address ?? string.Empty;
        hotel.Description = description ?? string.Empty;

        await _context.SaveChangesAsync();

        return Result.Success(hotel);
    }

    public async Task<Result> DeleteAsync(int id)
    {
        Hotel? hotel = await _context.Hotels.FindAsync(id);

        if (hotel is null)
        {
            return Result.Failure("Hotel not found");
        }

        _context.Hotels.Remove(hotel);
        await _context.SaveChangesAsync();

        return Result.Success();
    }
}

