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
    public class AlbumController : ControllerBase
    {
        private readonly SpotifyContext _context;

        public AlbumController(SpotifyContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Create(Album album)
        {
            _context.Add(album);
            _context.SaveChanges();
            return CreatedAtAction
            (nameof(ObterPorId),
            new { id = album.Id },
            album
            );
        }

    [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var album = _context.Albuns.Find(id);
            if (album == null)
            {
                return NotFound();
            }
            return Ok(album);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, Album album)
        {
            var albumBanco = _context.Albuns.Find(id);
            if (albumBanco == null)
            {
                return NotFound("Nenhum Álbum encontrado");
            }

            albumBanco.Nome = album.Nome;
            albumBanco.Ano = album.Ano;
            albumBanco.ArtistaId = album.ArtistaId;

            _context.Albuns.Update(albumBanco);
            _context.SaveChanges();
            return Ok(albumBanco);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var albumBanco = _context.Albuns.Find(id);
            if (albumBanco == null)
            {
                return NotFound("Nenhum Álbum encontrado");
            }

            _context.Albuns.Remove(albumBanco);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var albuns = _context.Albuns.ToList();
            return Ok(albuns);
        }
    }
}