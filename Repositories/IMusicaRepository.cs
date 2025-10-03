using System.Collections.Generic;
using System.Threading.Tasks;
using ProjetoSpotify.Models;

namespace ProjetoSpotify.Repositories
{
    public interface IMusicaRepository
    {
        Task<Musica> GetByIdAsync(int id);
        Task<Musica> GetByTituloAsync(string titulo);
        Task<Musica> GetByArtistaAsync(string artista);
        Task<IEnumerable<Musica>> GetAllAsync();
        Task AddAsync(Musica musica);
        Task UpdateAsync(Musica musica);
        Task DeleteAsync(Musica musica);  // recebe o objeto para remoção
        Task SaveChangesAsync();
    }
}