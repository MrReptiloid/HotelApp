using Microsoft.EntityFrameworkCore;
using HotelApp.Infrastructure.Data;
using HotelApp.Domain.Entities;
using HotelApp.Domain.Constants;
using HotelApp.Application.Interfaces;

namespace HotelApp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UserRepository(AppDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<User?> AuthenticateAsync(string email, string password)
    {
        User? user = await _context.Users
            .Where(u => u.Email == email)
            .FirstOrDefaultAsync();
            
        if (user == null)
            return null;

        if (!_passwordHasher.VerifyPassword(password, user.PasswordHash))
            return null;

        return user;
    }

    public async Task<User?> RegisterAsync(string email, string password, string? displayName)
    {
        bool exists = await _context.Users
            .Where(u => u.Email == email)
            .AnyAsync();
            
        if (exists)
            return null;

        User user = new()
        {
            Email = email,
            PasswordHash = _passwordHasher.HashPassword(password),
            DisplayName = displayName,
            Role = Roles.Client,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> FindByEmailAsync(string email)
    {
        return await _context.Users
            .Where(u => u.Email == email)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> FindByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task UpdateLastLoginAsync(int userId)
    {
        User? user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        return await _context.Users.CountAsync();
    }
}

