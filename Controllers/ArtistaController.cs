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
    public class ArtistaController : ControllerBase
    {
        private readonly SpotifyContext _context;

        public ArtistaController(SpotifyContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Create(Artista artista)
        {
            _context.Add(artista);
            _context.SaveChanges();
            return CreatedAtAction
            (nameof(ObterPorId),
            new { id = artista.Id },
            artista
            );
        }

     [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var artista = _context.Artistas.Find(id);
            if (artista == null)
            {
                return NotFound();
            }
            return Ok(artista);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, Artista artista)
        {
            var artistaBanco = _context.Artistas.Find(id);
            if (artistaBanco == null)
            {
                return NotFound("Nenhum Artista encontrado");
            }

            artistaBanco.Nome = artista.Nome;
            artistaBanco.Nacionalidade = artista.Nacionalidade;
            artistaBanco.OuvintesMensais = artista.OuvintesMensais;

            _context.Artistas.Update(artistaBanco);
            _context.SaveChanges();
            return Ok(artistaBanco);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var artistaBanco = _context.Artistas.Find(id);
            if (artistaBanco == null)
            {
                return NotFound("Nenhum Artista encontrado");
            }

            _context.Artistas.Remove(artistaBanco);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var artistas = _context.Artistas.ToList();
            return Ok(artistas);
        }
    }
}