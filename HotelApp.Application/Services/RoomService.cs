using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Services;

public sealed class RoomService : IRoomService
{
    private readonly IRoomRepository _roomRepository;

    public RoomService(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public async Task<Result<RoomResponse>> GetRoomByIdAsync(int id)
    {
        Result<Room> result = await _roomRepository.GetByIdAsync(id);
        
        if (result.IsFailure)
        {
            return Result.Failure<RoomResponse>(result.Error);
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result<List<RoomResponse>>> GetRoomsByHotelIdAsync(int hotelId)
    {
        Result<List<Room>> result = await _roomRepository.GetByHotelIdAsync(hotelId);
        
        if (result.IsFailure)
        {
            return Result.Failure<List<RoomResponse>>(result.Error);
        }

        List<RoomResponse> response = result.Value.Select(MapToResponse).ToList();
        return Result.Success(response);
    }

    public async Task<Result<List<RoomResponse>>> SearchAvailableRoomsAsync(SearchRoomsRequest request)
    {
        Result<List<Room>> result = await _roomRepository.SearchAvailableRoomsAsync(request);
        
        if (result.IsFailure)
        {
            return Result.Failure<List<RoomResponse>>(result.Error);
        }

        List<RoomResponse> response = result.Value.Select(MapToResponse).ToList();
        return Result.Success(response);
    }

    public async Task<Result<RoomResponse>> CreateRoomAsync(CreateRoomRequest request)
    {
        Result<Room> result = await _roomRepository.CreateAsync(
            request.HotelId,
            request.RoomNumber,
            request.PricePerNight,
            request.Capacity,
            request.Description);
        
        if (result.IsFailure)
        {
            return Result.Failure<RoomResponse>(result.Error);
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result<RoomResponse>> UpdateRoomAsync(int id, UpdateRoomRequest request)
    {
        Result<Room> result = await _roomRepository.UpdateAsync(
            id,
            request.RoomNumber,
            request.PricePerNight,
            request.Capacity,
            request.Description,
            request.IsAvailable);
        
        if (result.IsFailure)
        {
            return Result.Failure<RoomResponse>(result.Error);
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result> DeleteRoomAsync(int id)
    {
        return await _roomRepository.DeleteAsync(id);
    }

    private static RoomResponse MapToResponse(Room room)
    {
        return new RoomResponse
        {
            Id = room.Id,
            HotelId = room.HotelId,
            HotelName = room.Hotel?.Name ?? string.Empty,
            RoomNumber = room.RoomNumber,
            PricePerNight = room.PricePerNight,
            Capacity = room.Capacity,
            Description = room.Description,
            IsAvailable = room.IsAvailable
        };
    }
}

