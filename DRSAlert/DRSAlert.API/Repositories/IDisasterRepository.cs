using DRSAlert.API.Entities;

namespace DRSAlert.API.Repositories;

public interface IDisasterRepository
{
    Task<int> Create(Disaster disaster);
    Task<Disaster?> GetById(int id);
    Task<List<Disaster?>> GetAll();
    Task<bool> Exists(int id);
    Task Update(Disaster disaster);
    Task Delete(int id);
}