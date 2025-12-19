using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Services;

public sealed class HotelService : IHotelService
{
    private readonly IHotelRepository _hotelRepository;

    public HotelService(IHotelRepository hotelRepository)
    {
        _hotelRepository = hotelRepository;
    }

    public async Task<Result<List<HotelResponse>>> GetAllHotelsAsync()
    {
        Result<List<Hotel>> result = await _hotelRepository.GetAllAsync();
        
        if (result.IsFailure)
        {
            return Result.Failure<List<HotelResponse>>(result.Error);
        }

        List<HotelResponse> response = result.Value.Select(MapToResponse).ToList();
        return Result.Success(response);
    }

    public async Task<Result<HotelResponse>> GetHotelByIdAsync(int id)
    {
        Result<Hotel> result = await _hotelRepository.GetByIdAsync(id);
        
        if (result.IsFailure)
        {
            return Result.Failure<HotelResponse>(result.Error);
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result<List<HotelResponse>>> SearchHotelsByCityAsync(string city)
    {
        Result<List<Hotel>> result = await _hotelRepository.SearchByCityAsync(city);
        
        if (result.IsFailure)
        {
            return Result.Failure<List<HotelResponse>>(result.Error);
        }

        List<HotelResponse> response = result.Value.Select(MapToResponse).ToList();
        return Result.Success(response);
    }

    public async Task<Result<HotelResponse>> CreateHotelAsync(CreateHotelRequest request)
    {
        Result<Hotel> result = await _hotelRepository.CreateAsync(
            request.Name,
            request.City,
            request.Address,
            request.Description);
        
        if (result.IsFailure)
        {
            return Result.Failure<HotelResponse>(result.Error);
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result<HotelResponse>> UpdateHotelAsync(int id, UpdateHotelRequest request)
    {
        Result<Hotel> result = await _hotelRepository.UpdateAsync(
            id,
            request.Name,
            request.City,
            request.Address,
            request.Description);
        
        if (result.IsFailure)
        {
            return Result.Failure<HotelResponse>(result.Error);
        }

        return Result.Success(MapToResponse(result.Value));
    }

    public async Task<Result> DeleteHotelAsync(int id)
    {
        return await _hotelRepository.DeleteAsync(id);
    }

    private static HotelResponse MapToResponse(Hotel hotel)
    {
        return new HotelResponse
        {
            Id = hotel.Id,
            Name = hotel.Name,
            City = hotel.City,
            Address = hotel.Address,
            Description = hotel.Description,
            RoomCount = hotel.Rooms?.Count ?? 0
        };
    }
}

