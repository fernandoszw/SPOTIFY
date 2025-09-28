document.addEventListener('DOMContentLoaded', () => {
    const artistsData = [
        { name:"Henrique & Juliano", image:'https://akamai.sscdn.co/uploadfile/letras/fotos/8/f/0/6/8f0603b942e51fcd335fddde828b62cc.jpg' },
        { name:"Jorge & Mateus", image:'https://i.uai.com.br/0Lo15zVF-onPM_PfttOTpU0AQLU=/1200x1200/smart/imgsapp2.uai.com.br/app/noticia_133890394703/2025/02/10/354770/jorge-mateus-celebram-20-anos-de-carreira-com-turne-historica-e-show-em-curitiba_1_35970.webp' },
        { name:"Zé Neto & Cristiano", image:'https://curtamais.com.br/goiania/wp-content/uploads/sites/2/2024/11/500x500.jpg' },
        { name:"Gusttavo Lima", image:'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/09/imagem-29-1.jpg?w=1200&h=1200&crop=1' },
        { name:"Luan Santana", image:'https://billboard.com.br/wp-content/uploads/2024/05/IMG_3206-3-scaled.jpg' },
        { name:"Matheus & Kauan", image:'https://yt3.googleusercontent.com/EQBlMW5igU2KWWIDLHIO44r2xtkCpTSluc1ENA0msFsMn6kMnRlhp0_QQRtv2HA5DEidC5RaLg=s900-c-k-c0x00ffffff-no-rj' },
    ];

    const albumsData = [
        { name: 'Check-In', artist: 'Jorge & Mateus', image: 'https://upload.wikimedia.org/wikipedia/pt/2/29/Jorge_%26_Mateus_-_2024_-_Check-In.jpeg' },
        { name: 'O Céu Explica Tudo (Ao Vivo)', artist: 'Henrique & Juliano', image: 'https://i.scdn.co/image/ab67616d0000b273bccf7bd68398aa587d3232fe' },
        { name: 'Escolhas', artist: 'Zé Neto & Cristiano', image: 'https://i.scdn.co/image/ab67616d0000b2733354017c31f2d6623236f571' },
        { name: 'Feito à Mão (Volume 01)', artist: 'Gusttavo Lima', image: 'https://i.scdn.co/image/ab67616d0000b2732eb93ac3d1ed64ddd3fbeee4' },
        { name: 'Viva', artist: 'Luan Santana', image: 'https://akamai.sscdn.co/uploadfile/letras/albuns/9/f/3/0/770571716823795.jpg' },
        { name: 'Face a Face', artist: 'Mateus & Kauan', image: 'https://i.scdn.co/image/ab67616d0000b273c08f5933fbe44282925bc9e0' },
    ];

    const artistGrid = document.querySelector('.artists-grid');
    const albumsGrid = document.querySelector('.albums-grid');

    // Render artistas com fade-in escalonado
    artistsData.forEach((artist, index) => {
        const artistCard = document.createElement('div');
        artistCard.classList.add('artist-card', 'fade-in');
        artistCard.style.animationDelay = `${index * 0.08}s`;

        artistCard.innerHTML = `
            <img src="${artist.image}" alt="Imagem do ${artist.name}">
            <div>
                <h3>${artist.name}</h3>
                <p>artista</p>
            </div>
        `;

        artistGrid.appendChild(artistCard);
    });

    // Render álbuns com fade-in escalonado
    albumsData.forEach((album, index) => {
        const albumCard = document.createElement('div');
        albumCard.classList.add('album-card', 'fade-in');
        // offset para que os álbuns comecem um pouco depois dos artistas
        albumCard.style.animationDelay = `${0.3 + index * 0.08}s`;

        albumCard.innerHTML = `
            <img src="${album.image}" alt="Imagem do ${album.name}">
            <div>
                <h3>${album.name}</h3>
                <p>${album.artist}</p>
            </div>
        `;

        albumsGrid.appendChild(albumCard);
    });

    // Header scrolled (ouvir o scroll do main, não da janela)
    const main = document.querySelector('main');
    const header = document.querySelector('.header');
    if (main && header) {
        main.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', main.scrollTop > 12);
        });
    }
});
