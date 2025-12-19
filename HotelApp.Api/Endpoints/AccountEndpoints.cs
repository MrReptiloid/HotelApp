using System.Security.Claims;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using Result = CSharpFunctionalExtensions.Result;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace HotelApp.Api.Endpoints;

public class AccountEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("/Account");

        group.MapPost("/login", LoginAsync);
        group.MapPost("/register", RegisterAsync);
        group.MapPost("/logout", (Delegate)LogoutAsync);
        group.MapPost("/refresh", RefreshAsync).RequireAuthorization();
    }

    private static async Task<IResult> LoginAsync(
        UserCredentials credentials,
        IAuthService authService,
        HttpContext httpContext)
    {
        Result<UserResponse> result = await authService.LoginAsync(credentials.Email, credentials.Password);
        
        if (result.IsFailure)
        {
            return Results.Unauthorized();
        }

        UserResponse user = result.Value;

        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
        };

        if (!string.IsNullOrEmpty(user.DisplayName))
        {
            claims.Add(new Claim(ClaimTypes.Name, user.DisplayName));
        }

        ClaimsIdentity identity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        ClaimsPrincipal principal = new(identity);

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            });

        return Results.Ok(new LoginResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role
        });
    }

    private static async Task<IResult> RegisterAsync(
        RegisterRequest request,
        IAuthService authService,
        HttpContext httpContext)
    {
        Result<UserResponse> result = await authService.RegisterAsync(
            request.Email,
            request.Password,
            request.DisplayName);
        
        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        UserResponse user = result.Value;

        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
        };

        if (!string.IsNullOrEmpty(user.DisplayName))
        {
            claims.Add(new Claim(ClaimTypes.Name, user.DisplayName));
        }

        ClaimsIdentity identity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        ClaimsPrincipal principal = new(identity);

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            });

        return Results.Ok(new RegisterResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role
        });
    }

    private static async Task<IResult> LogoutAsync(HttpContext httpContext)
    {
        await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Results.Ok(new MessageResponse { Message = "Logged out successfully" });
    }

    private static async Task<IResult> RefreshAsync(ClaimsPrincipal user, IAuthService authService)
    {
        string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !int.TryParse(userIdClaim, out int userId))
        {
            return Results.Unauthorized();
        }

        Result<UserResponse> result = await authService.GetUserByIdAsync(userId);
        
        if (result.IsFailure)
        {
            return Results.Unauthorized();
        }

        return Results.Ok(result.Value);
    }
}

