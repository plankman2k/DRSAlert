using AutoMapper;
using DRSAlert.API.DTOs;
using DRSAlert.API.Entities;

namespace DRSAlert.API.Utilities;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Disaster, DisasterDTO>();
        CreateMap<CreateDisasterDTO, Disaster>();
    }
}