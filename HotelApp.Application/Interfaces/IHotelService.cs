using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Interfaces;

public interface IHotelService
{
    Task<Result<List<HotelResponse>>> GetAllHotelsAsync();
    Task<Result<HotelResponse>> GetHotelByIdAsync(int id);
    Task<Result<List<HotelResponse>>> SearchHotelsByCityAsync(string city);
    Task<Result<HotelResponse>> CreateHotelAsync(CreateHotelRequest request);
    Task<Result<HotelResponse>> UpdateHotelAsync(int id, UpdateHotelRequest request);
    Task<Result> DeleteHotelAsync(int id);
}

