using DRSAlert.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace DRSAlert.API.Repositories;

public class DisasterRepository(ApplicationDBContext context) : IDisasterRepository
{
    public async Task<int> Create(Disaster disaster)
    {
        context.Add(disaster);
        await context.SaveChangesAsync();
        return disaster.Id;
    }

    public async Task<Disaster?> GetById(int id)
    {
        return await context.Disasters.FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<List<Disaster?>> GetAll()
    {
        return await context.Disasters.OrderBy(d => d.City).ToListAsync();
    }

    public async Task<bool> Exists(int id)
    {
        return await context.Disasters.AnyAsync(d => d.Id == id);
    }

    public async Task Update(Disaster disaster)
    {
        context.Update(disaster);
        await context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        await context.Disasters.Where(d => d.Id == id).ExecuteDeleteAsync();
    }
}