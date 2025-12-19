using System.Text.Json.Serialization;
using HotelApp.Domain.Entities;
using HotelApp.Application.DTOs;

namespace HotelApp.Api;

[JsonSerializable(typeof(UserCredentials))]
[JsonSerializable(typeof(RegisterRequest))]
[JsonSerializable(typeof(CreateHotelRequest))]
[JsonSerializable(typeof(UpdateHotelRequest))]
[JsonSerializable(typeof(CreateRoomRequest))]
[JsonSerializable(typeof(UpdateRoomRequest))]
[JsonSerializable(typeof(CreateBookingRequest))]
[JsonSerializable(typeof(SearchRoomsRequest))]

[JsonSerializable(typeof(UserResponse))]
[JsonSerializable(typeof(LoginResponse))]
[JsonSerializable(typeof(RegisterResponse))]
[JsonSerializable(typeof(MessageResponse))]
[JsonSerializable(typeof(HotelResponse))]
[JsonSerializable(typeof(List<HotelResponse>))]
[JsonSerializable(typeof(RoomResponse))]
[JsonSerializable(typeof(List<RoomResponse>))]
[JsonSerializable(typeof(BookingResponse))]
[JsonSerializable(typeof(List<BookingResponse>))]
[JsonSerializable(typeof(AdminStatsResponse))]
[JsonSerializable(typeof(BookingStatsByMonth))]
[JsonSerializable(typeof(List<BookingStatsByMonth>))]

[JsonSerializable(typeof(User))]
[JsonSerializable(typeof(Hotel))]
[JsonSerializable(typeof(Room))]
[JsonSerializable(typeof(Booking))]

[JsonSerializable(typeof(string))]
[JsonSerializable(typeof(int))]
[JsonSerializable(typeof(decimal))]
[JsonSerializable(typeof(DateTime))]
[JsonSerializable(typeof(bool))]
public partial class AppJsonSerializerContext : JsonSerializerContext
{
}

