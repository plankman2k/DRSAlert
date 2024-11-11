using DRSAlert.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace DRSAlert.API.Repositories;

public class NewsFeedRepository(ApplicationDBContext context) : INewsFeedRepository
{
    public async Task<int> Create(NewsFeed newsFeed)
    {
        context.Add(newsFeed);
        await context.SaveChangesAsync();
        return newsFeed.Id;
    }

    public async Task<NewsFeed?> GetById(int id)
    {
        return await context.NewsFeeds.FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task<List<NewsFeed?>> GetAll()
    {
        return await context.NewsFeeds.OrderByDescending(n => n.PublishedAt).ToListAsync();
    }

    public async Task<bool> Exists(int id)
    {
        return await context.NewsFeeds.AnyAsync(n => n.Id == id);
    }

    public async Task Update(NewsFeed newsFeed)
    {
        context.Update(newsFeed);
        await context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        await context.NewsFeeds.Where(n => n.Id == id).ExecuteDeleteAsync();
    }
}