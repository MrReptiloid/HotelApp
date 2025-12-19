using CSharpFunctionalExtensions;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using HotelApp.Domain.Entities;

namespace HotelApp.Application.Services;

public sealed class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserResponse>> LoginAsync(string email, string password)
    {
        User? user = await _userRepository.AuthenticateAsync(email, password);
        
        if (user is null)
        {
            return Result.Failure<UserResponse>("Invalid email or password");
        }

        await _userRepository.UpdateLastLoginAsync(user.Id);

        return Result.Success(MapToResponse(user));
    }

    public async Task<Result<UserResponse>> RegisterAsync(string email, string password, string? displayName)
    {
        User? user = await _userRepository.RegisterAsync(email, password, displayName);
        
        if (user is null)
        {
            return Result.Failure<UserResponse>("User with this email already exists");
        }

        return Result.Success(MapToResponse(user));
    }

    public async Task<Result<UserResponse>> GetUserByIdAsync(int userId)
    {
        User? user = await _userRepository.FindByIdAsync(userId);
        
        if (user is null)
        {
            return Result.Failure<UserResponse>("User not found");
        }

        return Result.Success(MapToResponse(user));
    }

    public async Task UpdateLastLoginAsync(int userId)
    {
        await _userRepository.UpdateLastLoginAsync(userId);
    }

    private static UserResponse MapToResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role
        };
    }
}

