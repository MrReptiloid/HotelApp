using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;

namespace HotelApp.Application.Interfaces;

public interface IRoomService
{
    Task<Result<RoomResponse>> GetRoomByIdAsync(int id);
    Task<Result<List<RoomResponse>>> GetRoomsByHotelIdAsync(int hotelId);
    Task<Result<List<RoomResponse>>> SearchAvailableRoomsAsync(SearchRoomsRequest request);
    Task<Result<RoomResponse>> CreateRoomAsync(CreateRoomRequest request);
    Task<Result<RoomResponse>> UpdateRoomAsync(int id, UpdateRoomRequest request);
    Task<Result> DeleteRoomAsync(int id);
}

