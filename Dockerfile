FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["HotelApp.Api/HotelApp.Api.csproj", "HotelApp.Api/"]
COPY ["HotelApp.Application/HotelApp.Application.csproj", "HotelApp.Application/"]
COPY ["HotelApp.Domain/HotelApp.Domain.csproj", "HotelApp.Domain/"]
COPY ["HotelApp.Infrastructure/HotelApp.Infrastructure.csproj", "HotelApp.Infrastructure/"]

RUN dotnet restore "HotelApp.Api/HotelApp.Api.csproj"

COPY . .
WORKDIR "/src/HotelApp.Api"

RUN dotnet publish "HotelApp.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "HotelApp.Api.dll"]

