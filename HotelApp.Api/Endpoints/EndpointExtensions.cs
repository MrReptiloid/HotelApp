namespace HotelApp.Api.Endpoints;

public static class EndpointExtensions
{
    public static IServiceCollection AddEndpointModules(this IServiceCollection services)
    {
        services.AddScoped<IEndpointModule, AccountEndpoints>();
        services.AddScoped<IEndpointModule, AdminEndpoints>();
        services.AddScoped<IEndpointModule, HotelEndpoints>();
        services.AddScoped<IEndpointModule, RoomEndpoints>();
        services.AddScoped<IEndpointModule, BookingEndpoints>();

        return services;
    }

    public static IApplicationBuilder MapEndpointModules(this WebApplication app)
    {
        using IServiceScope scope = app.Services.CreateScope();
        IEnumerable<IEndpointModule> modules = scope.ServiceProvider.GetServices<IEndpointModule>();

        foreach (IEndpointModule module in modules)
        {
            module.MapEndpoints(app);
        }

        return app;
    }
}

