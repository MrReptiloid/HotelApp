using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using HotelApp.Application.Interfaces;
namespace HotelApp.Infrastructure.Services;
public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100000;
    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: Iterations,
            numBytesRequested: HashSize);
        byte[] result = new byte[SaltSize + HashSize];
        Buffer.BlockCopy(salt, 0, result, 0, SaltSize);
        Buffer.BlockCopy(hash, 0, result, SaltSize, HashSize);
        return Convert.ToBase64String(result);
    }
    public bool VerifyPassword(string password, string hashedPassword)
    {
        byte[] decoded = Convert.FromBase64String(hashedPassword);
        if (decoded.Length != SaltSize + HashSize)
            return false;
        byte[] salt = new byte[SaltSize];
        Buffer.BlockCopy(decoded, 0, salt, 0, SaltSize);
        byte[] expectedHash = new byte[HashSize];
        Buffer.BlockCopy(decoded, SaltSize, expectedHash, 0, HashSize);
        byte[] actualHash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: Iterations,
            numBytesRequested: HashSize);
        return CryptographicOperations.FixedTimeEquals(expectedHash, actualHash);
    }
}
