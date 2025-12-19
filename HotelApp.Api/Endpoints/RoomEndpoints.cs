using CSharpFunctionalExtensions;
using HotelApp.Domain.Constants;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;
using Result = CSharpFunctionalExtensions.Result;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace HotelApp.Api.Endpoints;

public class RoomEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("/api/rooms");

        group.MapGet("/{id:int}", GetRoomByIdAsync);
        group.MapGet("/hotel/{hotelId:int}", GetRoomsByHotelIdAsync);
        group.MapGet("/search", SearchAvailableRoomsAsync);
        group.MapPost("/", CreateRoomAsync).RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        group.MapPut("/{id:int}", UpdateRoomAsync).RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        group.MapDelete("/{id:int}", DeleteRoomAsync).RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    private static async Task<IResult> GetRoomByIdAsync(int id, IRoomService roomService)
    {
        Result<RoomResponse> result = await roomService.GetRoomByIdAsync(id);

        if (result.IsFailure)
        {
            return Results.NotFound(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> GetRoomsByHotelIdAsync(int hotelId, IRoomService roomService)
    {
        Result<List<RoomResponse>> result = await roomService.GetRoomsByHotelIdAsync(hotelId);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> SearchAvailableRoomsAsync([AsParameters] SearchRoomsRequest request,
        IRoomService roomService)
    {
        Result<List<RoomResponse>> result = await roomService.SearchAvailableRoomsAsync(request);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> CreateRoomAsync(CreateRoomRequest request, IRoomService roomService)
    {
        Result<RoomResponse> result = await roomService.CreateRoomAsync(request);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Created($"/api/rooms/{result.Value.Id}", result.Value);
    }

    private static async Task<IResult> UpdateRoomAsync(int id, UpdateRoomRequest request, IRoomService roomService)
    {
        Result<RoomResponse> result = await roomService.UpdateRoomAsync(id, request);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> DeleteRoomAsync(int id, IRoomService roomService)
    {
        Result result = await roomService.DeleteRoomAsync(id);

        if (result.IsFailure)
        {
            return Results.BadRequest(new MessageResponse { Message = result.Error });
        }

        return Results.Ok(new MessageResponse { Message = "Room deleted successfully" });
    }
}

