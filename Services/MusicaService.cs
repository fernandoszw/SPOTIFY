using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ProjetoSpotify.DTOs;
using ProjetoSpotify.Models;
using ProjetoSpotify.Repositories;
using ProjetoSpotify.Helpers;
using CRUD_MProjetoSpotifyusica.Services;

namespace ProjetoSpotify.Services
{
    public class MusicaService : IMusicaService
    {
        private readonly IMusicaRepository _repository;

        public MusicaService(IMusicaRepository repository)
        {
            _repository = repository;
        }

        public async Task<Musica> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Musica> GetByTituloAsync(string titulo)
        {
            return await _repository.GetByTituloAsync(titulo);
        }

        public async Task<Musica> GetByArtistaAsync(string artista)
        {
            return await _repository.GetByArtistaAsync(artista);
        }

        public async Task<IEnumerable<Musica>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Musica> AddAsync(MusicaUploadDto musicaDto)
        {
            if (musicaDto == null) throw new ArgumentNullException(nameof(musicaDto));
            if (musicaDto.Arquivo == null) throw new ArgumentException("Arquivo da música é obrigatório.");

            // Calcula a duração com base no arquivo
            int duracao = await CalcularDuracaoAsync(musicaDto.Arquivo);

            // Comprimir o arquivo da música
            byte[] arquivoComprimido;
            using (var ms = new MemoryStream())
            {
                await musicaDto.Arquivo.CopyToAsync(ms);
                arquivoComprimido = Compress(ms.ToArray());
            }

            // Comprimir a capa do álbum, se existir
            byte[] capaBytes = null;
            if (musicaDto.Capa != null)
            {
                using var msCapa = new MemoryStream();
                await musicaDto.Capa.CopyToAsync(msCapa);
                capaBytes = Compress(msCapa.ToArray());
            }

            var musica = new Musica
            {
                Titulo = musicaDto.Titulo,
                Artista = musicaDto.Artista,
                Genero = musicaDto.Genero,
                Duracao = duracao,  // só o valor calculado
                ArquivoComprimido = arquivoComprimido,
                CapaDoAlbum = capaBytes
            };

            await _repository.AddAsync(musica);
            await _repository.SaveChangesAsync();

            return musica;
        }

        public async Task UpdateMetadataAsync(string titulo, MusicaMetadataUpdateDto musicaMetadata)
        {
            var musica = await _repository.GetByTituloAsync(titulo);
            if (musica == null)
            {
                throw new KeyNotFoundException($"Música com título '{titulo}' não encontrada.");
            }

            musica.Titulo = musicaMetadata.Titulo;
            musica.Artista = musicaMetadata.Artista;
            musica.Genero = musicaMetadata.Genero;
            musica.Duracao = musicaMetadata.Duracao;  // aqui você decide: se quiser manter a duração antiga ou sobrescrever

            await _repository.UpdateAsync(musica);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteByTituloAsync(string titulo)
        {
            var musica = await _repository.GetByTituloAsync(titulo);
            if (musica == null)
            {
                throw new KeyNotFoundException($"Música com título '{titulo}' não encontrada.");
            }
            await _repository.DeleteAsync(musica);
            await _repository.SaveChangesAsync();
        }

        public async Task<byte[]> GetCoverAsync(int id)
        {
            var musica = await _repository.GetByIdAsync(id);
            if (musica == null || musica.CapaDoAlbum == null)
                return null;

            return Decompress(musica.CapaDoAlbum);
        }

        public async Task<(byte[] FileBytes, string FileName)> GetMusicFileAsync(int id)
        {
            var musica = await _repository.GetByIdAsync(id);
            if (musica == null || musica.ArquivoComprimido == null)
                return (null, null);

            var arquivoDescomprimido = Decompress(musica.ArquivoComprimido);
            var fileName = $"{musica.Titulo}.mp3";
            return (arquivoDescomprimido, fileName);
        }

        public async Task<int> CalcularDuracaoAsync(IFormFile arquivo)
        {
            using var stream = arquivo.OpenReadStream();
            var abstraction = new FormFileAbstraction(arquivo);
            var tagFile = TagLib.File.Create(abstraction);
            return (int)tagFile.Properties.Duration.TotalSeconds;
        }

        public byte[] Compress(byte[] data)
        {
            using var compressedStream = new MemoryStream();
            using var gzip = new System.IO.Compression.GZipStream(compressedStream, System.IO.Compression.CompressionMode.Compress);
            gzip.Write(data, 0, data.Length);
            return compressedStream.ToArray();
        }

        private byte[] Decompress(byte[] compressedData)
        {
            using var compressedStream = new MemoryStream(compressedData);
            using var gzip = new System.IO.Compression.GZipStream(compressedStream, System.IO.Compression.CompressionMode.Decompress);
            using var result = new MemoryStream();
            gzip.CopyTo(result);
            return result.ToArray();
        }
    }
}