using Dapper;
using HotelApp.Infrastructure.Data;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using HotelApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MySqlConnector;

namespace HotelApp.Infrastructure.Services;

public sealed class StatisticsService : IStatisticsService
{
    private readonly AppDbContext _context;
    private readonly string _connectionString;

    public StatisticsService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<AdminStatsResponse> GetAdminStatisticsAsync()
    {
        int totalUsers = await _context.Users.CountAsync();
        int totalHotels = await _context.Hotels.CountAsync();
        int totalRooms = await _context.Rooms.CountAsync();
        int totalBookings = await _context.Bookings.CountAsync();
        int activeBookings = await _context.Bookings
            .CountAsync(b => b.Status == BookingStatus.Confirmed);

        await using MySqlConnection connection = new(_connectionString);
        await connection.OpenAsync();

        string bookingStatsQuery = @"
            SELECT 
                YEAR(`CreatedAt`) as Year,
                MONTH(`CreatedAt`) as Month,
                COUNT(*) as Count,
                COALESCE(SUM(`TotalPrice`), 0) as Revenue
            FROM `Bookings`
            WHERE `CreatedAt` >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY YEAR(`CreatedAt`), MONTH(`CreatedAt`)
            ORDER BY Year DESC, Month DESC
            LIMIT 6";

        IEnumerable<BookingStatsByMonth> bookingsByMonth = await connection.QueryAsync<BookingStatsByMonth>(bookingStatsQuery);

        string totalRevenueQuery = @"
            SELECT COALESCE(SUM(`TotalPrice`), 0) as TotalRevenue
            FROM `Bookings`
            WHERE `Status` = 'Confirmed' OR `Status` = 'Completed'";

        decimal totalRevenue = await connection.QueryFirstOrDefaultAsync<decimal>(totalRevenueQuery);

        return new AdminStatsResponse
        {
            TotalUsers = totalUsers,
            TotalHotels = totalHotels,
            TotalRooms = totalRooms,
            TotalBookings = totalBookings,
            ActiveBookings = activeBookings,
            TotalRevenue = totalRevenue,
            BookingsByMonth = bookingsByMonth.ToList()
        };
    }
}

