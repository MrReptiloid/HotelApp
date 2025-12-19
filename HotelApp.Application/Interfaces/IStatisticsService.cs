using HotelApp.Application.DTOs;

namespace HotelApp.Application.Interfaces;

public interface IStatisticsService
{
    Task<AdminStatsResponse> GetAdminStatisticsAsync();
}

