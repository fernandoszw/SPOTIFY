using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ProjetoSpotify.DTOs;
using ProjetoSpotify.Models;

namespace CRUD_MProjetoSpotifyusica.Services
{
    public interface IMusicaService
    {
        Task<Musica> GetByIdAsync(int id);
        Task<Musica> GetByTituloAsync(string titulo);
        Task<Musica> GetByArtistaAsync(string artista);
        Task<IEnumerable<Musica>> GetAllAsync();

        // Criação de música via upload — sem depender do campo Duracao fornecido
        Task<Musica> AddAsync(MusicaUploadDto musicaDto);

        Task UpdateMetadataAsync(string titulo, MusicaMetadataUpdateDto musicaMetadata);
        Task DeleteByTituloAsync(string titulo);

        Task<byte[]> GetCoverAsync(int id);
        Task<(byte[] FileBytes, string FileName)> GetMusicFileAsync(int id);

        // Métodos auxiliares
        Task<int> CalcularDuracaoAsync(IFormFile arquivo);
        byte[] Compress(byte[] data);
    }
}