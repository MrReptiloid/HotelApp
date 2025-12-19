using HotelApp.Domain.Constants;
using HotelApp.Application.DTOs;
using HotelApp.Application.Interfaces;

namespace HotelApp.Api.Endpoints;

public class AdminEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapGroup("/api/admin")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));

        group.MapGet("/stats", GetStatsAsync);
    }

    private static async Task<IResult> GetStatsAsync(IStatisticsService statisticsService)
    {
        AdminStatsResponse stats = await statisticsService.GetAdminStatisticsAsync();
        return Results.Ok(stats);
    }
}

