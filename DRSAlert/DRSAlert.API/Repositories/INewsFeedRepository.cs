using DRSAlert.API.Entities;

namespace DRSAlert.API.Repositories;

public interface INewsFeedRepository
{
    Task<int> Create(NewsFeed newsFeed);
    Task<NewsFeed?> GetById(int id);
    Task<List<NewsFeed?>> GetAll();
    Task<bool> Exists(int id);
    Task Update(NewsFeed newsFeed);
    Task Delete(int id);
}