using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;

namespace HotelApp.Application.Interfaces;

public interface IAuthService
{
    Task<Result<UserResponse>> LoginAsync(string email, string password);
    Task<Result<UserResponse>> RegisterAsync(string email, string password, string? displayName);
    Task<Result<UserResponse>> GetUserByIdAsync(int userId);
    Task UpdateLastLoginAsync(int userId);
}

