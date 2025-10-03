using System.IO;
using System.Threading.Tasks;
using ProjetoSpotify.DTOs;
using ProjetoSpotify.Models;
using ProjetoSpotify.Services;
using Microsoft.AspNetCore.Mvc;
using TagLib;
using CRUD_MProjetoSpotifyusica.Services;

namespace ProjetoSpotify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicaController : ControllerBase
    {
        private readonly IMusicaService _musicaService;

        public MusicaController(IMusicaService musicaService)
        {
            _musicaService = musicaService;
        }
        [HttpGet("ListSongs")]
        public async Task<IActionResult> Listar()
        {
            var musicas = await _musicaService.GetAllAsync();
            return Ok(musicas);
        }

        [HttpGet("GetMusicByTitle/{titulo}")]
        public async Task<IActionResult> ObterMusicaPorTitulo(string titulo)
        {
            var musica = await _musicaService.GetByTituloAsync(titulo);
            if (musica == null) return NotFound();
            return Ok(musica);
        }

        [HttpGet("GetMusicByArtist/{artista}")]
        public async Task<IActionResult> ObterMusicaPorArtista(string artista)
        {
            var musica = await _musicaService.GetByArtistaAsync(artista);
            if (musica == null) return NotFound();
            return Ok(musica);
        }

        [HttpPut("UpdateMusicByTitle/{titulo}")]
        public async Task<IActionResult> AtualizarMusica(string titulo, MusicaMetadataUpdateDto musicaAtualizada)
        {
            try
            {
                await _musicaService.UpdateMetadataAsync(titulo, musicaAtualizada);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("DeleteMusicByTitle/{titulo}")]
        public async Task<IActionResult> DeletarMusica(string titulo)
        {
            try
            {
                await _musicaService.DeleteByTituloAsync(titulo);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            return NoContent();
        }


        [HttpPost("AddSongWithFile")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AdicionarMusicaComArquivo([FromForm] MusicaUploadDto musicaDto)
        {
            int duracao = await _musicaService.CalcularDuracaoAsync(musicaDto.Arquivo);
            byte[] arquivoComprimido;
            using (var memoryStreamMusica = new MemoryStream())
            {
                await musicaDto.Arquivo.CopyToAsync(memoryStreamMusica);
                arquivoComprimido = _musicaService.Compress(memoryStreamMusica.ToArray());
            }

            byte[] imagemCapaBytes = null;
            if (musicaDto.Capa != null)
            {
                await using var msCapa = new MemoryStream();
                await musicaDto.Capa.CopyToAsync(msCapa);
                imagemCapaBytes = _musicaService.Compress(msCapa.ToArray());
            }

            var musicaSalva = await _musicaService.AddAsync(musicaDto);

            return CreatedAtAction(nameof(ObterMusicaPorTitulo), new { titulo = musicaSalva.Titulo }, musicaSalva);
        }


        [HttpGet("GetCover/{id}")]
        public async Task<IActionResult> GetCover(int id)
        {
            var capa = await _musicaService.GetCoverAsync(id);
            if (capa == null) return NotFound();
            return File(capa, "image/jpeg");
        }

        [HttpGet("PlayMusic/{id}")]
        public async Task<IActionResult> TocarMusica(int id)
        {
            var (fileBytes, fileName) = await _musicaService.GetMusicFileAsync(id);
            if (fileBytes == null) return NotFound();
            var stream = new MemoryStream(fileBytes);
            return new FileStreamResult(stream, "audio/mpeg")
            {
                FileDownloadName = fileName
            };
        }
    }
}