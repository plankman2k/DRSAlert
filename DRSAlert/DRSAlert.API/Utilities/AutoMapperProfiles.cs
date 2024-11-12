using AutoMapper;
using DRSAlert.API.DTOs;
using DRSAlert.API.Entities;
using NewsFeed = DRSAlert.API.Models.NewsFeed;

namespace DRSAlert.API.Utilities;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Disaster, DisasterDTO>();
        CreateMap<CreateDisasterDTO, Disaster>();
        
        CreateMap<DRSAlert.API.Entities.NewsFeed, NewsFeedDTO>();
        CreateMap<CreateNewsFeedDTO, DRSAlert.API.Entities.NewsFeed>();
    }
}