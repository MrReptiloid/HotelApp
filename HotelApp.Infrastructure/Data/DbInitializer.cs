using HotelApp.Domain.Entities;
using HotelApp.Domain.Constants;
using HotelApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HotelApp.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using IServiceScope scope = serviceProvider.CreateScope();
        AppDbContext context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        IPasswordHasher passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        await context.Database.EnsureCreatedAsync();

        if (await context.Users.AnyAsync())
        {
            return;
        }

        User admin = new()
        {
            Email = "admin@hotel.com",
            PasswordHash = passwordHasher.HashPassword("Admin123!"),
            DisplayName = "Administrator",
            Role = Roles.Administrator,
            CreatedAt = DateTime.UtcNow
        };

        User client = new()
        {
            Email = "client@test.com",
            PasswordHash = passwordHasher.HashPassword("Client123!"),
            DisplayName = "Test Client",
            Role = Roles.Client,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.AddRange(admin, client);
        await context.SaveChangesAsync();

        Hotel hotel1 = new()
        {
            Name = "Grand Hotel Kyiv",
            City = "Kyiv",
            Address = "Khreshchatyk St, 1",
            Description = "Luxury hotel in the heart of the capital with stunning views of Maidan"
        };

        Hotel hotel2 = new()
        {
            Name = "Lviv Palace",
            City = "Lviv",
            Address = "Rynok Square, 10",
            Description = "Historic hotel in the heart of the old town"
        };

        Hotel hotel3 = new()
        {
            Name = "Odesa Beach Resort",
            City = "Odesa",
            Address = "French Boulevard, 85",
            Description = "Seaside hotel with private beach"
        };

        context.Hotels.AddRange(hotel1, hotel2, hotel3);
        await context.SaveChangesAsync();

        List<Room> rooms1 = new()
        {
            new Room
            {
                HotelId = hotel1.Id,
                RoomNumber = "101",
                PricePerNight = 1500,
                Capacity = 2,
                Description = "Standard room with double bed",
                IsAvailable = true
            },
            new Room
            {
                HotelId = hotel1.Id,
                RoomNumber = "102",
                PricePerNight = 2000,
                Capacity = 3,
                Description = "Superior room with balcony",
                IsAvailable = true
            },
            new Room
            {
                HotelId = hotel1.Id,
                RoomNumber = "201",
                PricePerNight = 3500,
                Capacity = 4,
                Description = "Luxury suite with panoramic view",
                IsAvailable = true
            }
        };

        List<Room> rooms2 = new()
        {
            new Room
            {
                HotelId = hotel2.Id,
                RoomNumber = "10",
                PricePerNight = 1200,
                Capacity = 2,
                Description = "Cozy room in historic style",
                IsAvailable = true
            },
            new Room
            {
                HotelId = hotel2.Id,
                RoomNumber = "15",
                PricePerNight = 1800,
                Capacity = 2,
                Description = "Room with view of Rynok Square",
                IsAvailable = true
            }
        };

        List<Room> rooms3 = new()
        {
            new Room
            {
                HotelId = hotel3.Id,
                RoomNumber = "301",
                PricePerNight = 2500,
                Capacity = 2,
                Description = "Room with sea view",
                IsAvailable = true
            },
            new Room
            {
                HotelId = hotel3.Id,
                RoomNumber = "302",
                PricePerNight = 3000,
                Capacity = 4,
                Description = "Family room with two bedrooms",
                IsAvailable = true
            }
        };

        context.Rooms.AddRange(rooms1);
        context.Rooms.AddRange(rooms2);
        context.Rooms.AddRange(rooms3);
        await context.SaveChangesAsync();

        Console.WriteLine("Database has been seeded successfully!");
        Console.WriteLine($"Admin login: {admin.Email} / Admin123!");
        Console.WriteLine($"Client login: {client.Email} / Client123!");
    }
}

