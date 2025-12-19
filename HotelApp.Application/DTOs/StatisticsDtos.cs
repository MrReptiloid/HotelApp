
namespace HotelApp.Application.DTOs;

public sealed class AdminStatsResponse
{
    public int TotalUsers { get; set; }
    public int TotalHotels { get; set; }
    public int TotalRooms { get; set; }
    public int TotalBookings { get; set; }
    public int ActiveBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<BookingStatsByMonth> BookingsByMonth { get; set; } = new();
}

public sealed class BookingStatsByMonth
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int Count { get; set; }
    public decimal Revenue { get; set; }
}

