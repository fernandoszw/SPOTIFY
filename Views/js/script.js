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
        { name: 'White Noise (Sleep & Relaxation Sounds)', artist: 'Sleepy John', image: 'https://i1.sndcdn.com/artworks-1TOUHZYOHKwe-0-t500x500.jpg' },
        { name: 'O Céu Explica Tudo (Ao Vivo)', artist: 'Henrique & Juliano', image: 'https://i.scdn.co/image/ab67616d0000b273bccf7bd68398aa587d3232fe' },
        { name: 'Nada como um dia após o outro', artist: 'Racionais', image: 'https://akamai.sscdn.co/uploadfile/letras/albuns/b/2/0/6/19286.jpg' },
        { name: 'HIT ME HARD AND SOFT', artist: 'Billie Eilish', image: 'https://cdn-images.dzcdn.net/images/cover/5d284b31cb9ddeb1a0c79aede5a94e1c/1900x1900-000000-81-0-0.jpg' },
        { name: 'CAJU', artist: 'Liniker', image: 'https://images.genius.com/5d8ef1925d3db3ecf147cf37e8f8103a.1000x1000x1.jpg' },
        { name: 'Escândalo Íntimo', artist: 'Luísa Sonza', image: 'https://s2-g1.glbimg.com/PdfwBwbI2SO9O3f8ZyKjZKFPUp8=/0x0:2048x2048/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2023/q/q/A40hpHRceiB3Ewik8t2w/luisasonzaescandalointimocapa.jpg' },
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
