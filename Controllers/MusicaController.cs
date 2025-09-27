using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjetoSpotify.Context;
using ProjetoSpotify.Models;

namespace ProjetoSpotify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicaController : ControllerBase
    {
        private readonly SpotifyContext _context;

        public MusicaController(SpotifyContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Create(Musica musica)
        {
            _context.Add(musica);
            _context.SaveChanges();
            return CreatedAtAction
            (nameof(ObterPorId),
            new { id = musica.Id },
            musica
            );
        }

     [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var musica = _context.Musicas.Find(id);
            if (musica == null)
            {
                return NotFound();
            }
            return Ok(musica);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, Musica musica)
        {
            var musicaBanco = _context.Musicas.Find(id);
            if (musicaBanco == null)
            {
                return NotFound("Nenhuma Música encontrada");
            }

            musicaBanco.NomeMusica = musica.NomeMusica;
            musicaBanco.Duracao = musica.Duracao;
            musicaBanco.AlbumId = musica.AlbumId;

            _context.Musicas.Update(musicaBanco);
            _context.SaveChanges();
            return Ok(musicaBanco);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var musicaBanco = _context.Musicas.Find(id);
            if (musicaBanco == null)
            {
                return NotFound("Nenhuma Música encontrada");
            }

            _context.Musicas.Remove(musicaBanco);
            _context.SaveChanges();
            return Ok(musicaBanco);
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var musicas = _context.Musicas.ToList();
            return Ok(musicas);
        }
    }
}