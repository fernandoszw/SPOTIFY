namespace ProjetoSpotify.Models
{
    public class Musica
    {
        public int Id { get; set; }
        public string NomeMusica { get; set; } = string.Empty;
        public string Duracao { get; set; } = string.Empty;
        public int AlbumId { get; set; }

    }
}