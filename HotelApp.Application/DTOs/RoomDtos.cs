namespace HotelApp.Application.DTOs;

public sealed class RoomResponse
{
    public int Id { get; set; }
    public int HotelId { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public string RoomNumber { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
}

public sealed class CreateRoomRequest
{
    public int HotelId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; } = string.Empty;
}

public sealed class SearchRoomsRequest
{
    public string? City { get; set; }
    public DateTime? CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public int? MinCapacity { get; set; }
    public decimal? MaxPrice { get; set; }
}

public sealed class UpdateRoomRequest
{
    public string RoomNumber { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
}

