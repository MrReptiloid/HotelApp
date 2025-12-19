using CSharpFunctionalExtensions;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Interfaces;

public interface IHotelRepository
{
    Task<Result<Hotel>> CreateAsync(string name, string city, string address, string description);
    Task<Result<Hotel>> GetByIdAsync(int id);
    Task<Result<List<Hotel>>> GetAllAsync();
    Task<Result<List<Hotel>>> SearchByCityAsync(string city);
    Task<Result<Hotel>> UpdateAsync(int id, string name, string city, string address, string description);
    Task<Result> DeleteAsync(int id);
}

