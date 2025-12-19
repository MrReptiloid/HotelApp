using HotelApp.Domain.Entities;

namespace HotelApp.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> AuthenticateAsync(string email, string password);
    Task<User?> RegisterAsync(string email, string password, string? displayName);
    Task<User?> FindByEmailAsync(string email);
    Task<User?> FindByIdAsync(int id);
    Task UpdateLastLoginAsync(int userId);
    Task<int> GetTotalUsersCountAsync();
}

