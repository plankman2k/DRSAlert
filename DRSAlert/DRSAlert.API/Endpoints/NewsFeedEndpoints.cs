using AutoMapper;
using DRSAlert.API.DTOs;
using DRSAlert.API.Models;
using DRSAlert.API.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DRSAlert.API.Endpoints;

public static class NewsFeedEndpoints
{
    public static RouteGroupBuilder MapNewsFeeds(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetNewsFeeds)
            .CacheOutput(c => c.Expire(TimeSpan.FromMinutes(5)).Tag("newsfeeds-get"))
            .RequireAuthorization();
        group.MapGet("/{id:int}", GetById).RequireAuthorization();
        return group;
    }
    
    static async Task<Ok<List<NewsFeedDTO>>> GetNewsFeeds(INewsFeedRepository repository,
        IMapper mapper)
    {
        var newsFeeds = await repository.GetAll();
        var newsFeedsDTO = mapper.Map<List<NewsFeedDTO>>(newsFeeds);
        return TypedResults.Ok(newsFeedsDTO);
    }
    
    static async Task<Results<Ok<NewsFeedDTO>, NotFound>> GetById(int id, INewsFeedRepository repository, 
        IMapper mapper)
    {
        var newsFeed = await repository.GetById(id);

        if (newsFeed is null)
        {
            return TypedResults.NotFound();
        }

        var newsFeedDTO = mapper.Map<NewsFeedDTO>(newsFeed);

        return TypedResults.Ok(newsFeedDTO);
    }
}