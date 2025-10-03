using System.IO;
using Microsoft.AspNetCore.Http;
using TagLib;

namespace ProjetoSpotify.Helpers
{
    public class FormFileAbstraction : TagLib.File.IFileAbstraction
    {
        private readonly IFormFile _formFile;

        public FormFileAbstraction(IFormFile formFile)
        {
            _formFile = formFile;
        }

        public string Name => _formFile.FileName;

        public Stream ReadStream => _formFile.OpenReadStream();

        public Stream WriteStream => null; // não usado para escrita

        public void CloseStream(Stream stream)
        {
            stream?.Dispose();
        }
    }
}