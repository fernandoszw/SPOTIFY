using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjetoSpotify.Context;
using ProjetoSpotify.Models;
using Microsoft.EntityFrameworkCore;

namespace ProjetoSpotify.Repositories
{
    public class MusicaRepository : IMusicaRepository
    {
        private readonly SpotifyContext _context;

        public MusicaRepository(SpotifyContext context)
        {
            _context = context;
        }

        public async Task<Musica> GetByIdAsync(int id)
        {
            return await _context.Musicas.FindAsync(id);
        }

        public async Task<Musica> GetByTituloAsync(string titulo)
        {
            return await _context.Musicas
                .FirstOrDefaultAsync(m => m.Titulo == titulo);
        }

        public async Task<Musica> GetByArtistaAsync(string artista)
        {
            return await _context.Musicas
                .FirstOrDefaultAsync(m => m.Artista == artista);
        }

        public async Task<IEnumerable<Musica>> GetAllAsync()
        {
            return await _context.Musicas.ToListAsync();
        }

        public async Task AddAsync(Musica musica)
        {
            await _context.Musicas.AddAsync(musica);
        }

        public async Task UpdateAsync(Musica musica)
        {
            _context.Musicas.Update(musica);
        }

        public async Task DeleteAsync(Musica musica)
        {
            _context.Musicas.Remove(musica);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}