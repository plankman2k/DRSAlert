using AutoMapper;
using DRSAlert.API.DTOs;
using DRSAlert.API.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DRSAlert.API.Endpoints;

public static class DisastersEndpoints
{
    public static RouteGroupBuilder MapDisasters(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetDisasters)
            .CacheOutput(c => c.Expire(TimeSpan.FromMinutes(5)).Tag("disasters-get"))
            .RequireAuthorization();
        group.MapGet("/{id:int}", GetById).RequireAuthorization();
        return group;
    }

    static async Task<Ok<List<DisasterDTO>>> GetDisasters(IDisasterRepository repository,
        IMapper mapper)
    {
        var disasters = await repository.GetAll();
        var disastersDTO = mapper.Map<List<DisasterDTO>>(disasters);
        return TypedResults.Ok(disastersDTO);
    }
    
    static async Task<Results<Ok<DisasterDTO>, NotFound>> GetById(int id, IDisasterRepository repository, 
        IMapper mapper)
    {
        var disaster = await repository.GetById(id);

        if (disaster is null)
        {
            return TypedResults.NotFound();
        }

        var disasterDTO = mapper.Map<DisasterDTO>(disaster);

        return TypedResults.Ok(disasterDTO);
    }
}