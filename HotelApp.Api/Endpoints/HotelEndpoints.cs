using CSharpFunctionalExtensions;
using HotelApp.Domain.Constants;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Result = CSharpFunctionalExtensions.Result;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace HotelApp.Api.Endpoints;

public class HotelEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("/api/hotels");

        group.MapGet("/", GetAllHotelsAsync);
        group.MapGet("/{id:int}", GetHotelByIdAsync);
        group.MapGet("/search", SearchHotelsByCityAsync);
        group.MapPost("/", CreateHotelAsync).RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        group.MapPut("/{id:int}", UpdateHotelAsync).RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        group.MapDelete("/{id:int}", DeleteHotelAsync).RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    private static async Task<IResult> GetAllHotelsAsync(IHotelService hotelService)
    {
        Result<List<HotelResponse>> result = await hotelService.GetAllHotelsAsync();

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> GetHotelByIdAsync(int id, IHotelService hotelService)
    {
        Result<HotelResponse> result = await hotelService.GetHotelByIdAsync(id);

        if (result.IsFailure)
        {
            return Results.NotFound(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> SearchHotelsByCityAsync([FromQuery] string city, IHotelService hotelService)
    {
        if (string.IsNullOrWhiteSpace(city))
        {
            return Results.BadRequest(new MessageResponse { Message = "City parameter is required" });
        }

        Result<List<HotelResponse>> result = await hotelService.SearchHotelsByCityAsync(city);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> CreateHotelAsync(CreateHotelRequest request, IHotelService hotelService)
    {
        Result<HotelResponse> result = await hotelService.CreateHotelAsync(request);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Created($"/api/hotels/{result.Value.Id}", result.Value);
    }

    private static async Task<IResult> UpdateHotelAsync(int id, UpdateHotelRequest request, IHotelService hotelService)
    {
        Result<HotelResponse> result = await hotelService.UpdateHotelAsync(id, request);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> DeleteHotelAsync(int id, IHotelService hotelService)
    {
        Result result = await hotelService.DeleteHotelAsync(id);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(new MessageResponse { Message = "Hotel deleted successfully" });
    }
}

