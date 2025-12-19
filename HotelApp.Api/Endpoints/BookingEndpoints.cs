using System.Security.Claims;
using CSharpFunctionalExtensions;
using HotelApp.Domain.Constants;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using Result = CSharpFunctionalExtensions.Result;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace HotelApp.Api.Endpoints;

public class BookingEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("/api/bookings")
            .RequireAuthorization();

        group.MapGet("/my", GetMyBookingsAsync);
        group.MapGet("/{id:int}", GetBookingByIdAsync);
        group.MapPost("/", CreateBookingAsync);
        group.MapPost("/{id:int}/cancel", CancelBookingAsync);
        
        RouteGroupBuilder adminGroup = app.MapGroup("/api/admin/bookings")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        
        adminGroup.MapGet("/", GetAllBookingsAsync);
    }

    private static async Task<IResult> GetMyBookingsAsync(ClaimsPrincipal user, IBookingService bookingService)
    {
        string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !int.TryParse(userIdClaim, out int userId))
        {
            return Results.Unauthorized();
        }

        Result<List<BookingResponse>> result = await bookingService.GetUserBookingsAsync(userId);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> GetBookingByIdAsync(int id, ClaimsPrincipal user, IBookingService bookingService)
    {
        string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        string? userRole = user.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userIdClaim is null || !int.TryParse(userIdClaim, out int userId))
        {
            return Results.Unauthorized();
        }

        Result<BookingResponse> result = await bookingService.GetBookingByIdAsync(id, userId, userRole ?? string.Empty);

        if (result.IsFailure)
        {
            if (result.Error == "Access denied")
            {
                return Results.Forbid();
            }
            return Results.NotFound(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> CreateBookingAsync(
        CreateBookingRequest request,
        ClaimsPrincipal user,
        IBookingService bookingService)
    {
        string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !int.TryParse(userIdClaim, out int userId))
        {
            return Results.Unauthorized();
        }

        Result<BookingResponse> result = await bookingService.CreateBookingAsync(userId, request);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Created($"/api/bookings/{result.Value.Id}", result.Value);
    }

    private static async Task<IResult> CancelBookingAsync(int id, ClaimsPrincipal user, IBookingService bookingService)
    {
        string? userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !int.TryParse(userIdClaim, out int userId))
        {
            return Results.Unauthorized();
        }

        Result result = await bookingService.CancelBookingAsync(id, userId);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(new MessageResponse { Message = "Booking cancelled successfully" });
    }

    private static async Task<IResult> GetAllBookingsAsync(IBookingService bookingService)
    {
        Result<List<BookingResponse>> result = await bookingService.GetAllBookingsAsync();

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }
}

