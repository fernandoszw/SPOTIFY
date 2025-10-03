document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = "http://localhost:5004/api";  // URL base da API
    let audioPlayer = null;
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerCover = document.getElementById('player-cover');
    const playBtn = document.getElementById('player-play');
    const pauseBtn = document.getElementById('player-pause');

    const artistsData = [
        { name: "Henrique & Juliano", image: 'https://akamai.sscdn.co/uploadfile/letras/fotos/8/f/0/6/8f0603b942e51fcd335fddde828b62cc.jpg' },
        { name: "Zé Neto & Cristiano", image: 'https://curtamais.com.br/goiania/wp-content/uploads/sites/2/2024/11/500x500.jpg' },
        { name: "Gusttavo Lima", image: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/09/imagem-29-1.jpg?w=1200&h=1200&crop=1' },
        { name: "Luan Santana", image: 'https://billboard.com.br/wp-content/uploads/2024/05/IMG_3206-3-scaled.jpg' },
        { name: "Matheus & Kauan", image: 'https://yt3.googleusercontent.com/EQBlMW5igU2KWWIDLHIO44r2xtkCpTSluc1ENA0msFsMn6kMnRlhp0_QQRtv2HA5DEidC5RaLg=s900-c-k-c0x00ffffff-no-rj' },
        { name: "Zé Felipe", image: 'https://www.estrelando.com.br/uploads/2022/05/27/ze-felipe-xingamento-bravo-virginia-fonseca-1653672693.jpg' },

    ];

    const artistGrid = document.querySelector('.artists-grid');
    playBtn.addEventListener('click', () => {
        if (audioPlayer) {
            audioPlayer.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        }
    });

    pauseBtn.addEventListener('click', () => {
        if (audioPlayer) {
            audioPlayer.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
        }
    });

    const musicasGrid = document.querySelector('.musicas-grid');
    artistsData.forEach((artist, index) => {
        const artistCard = document.createElement('div');
        artistCard.classList.add('artist-card', 'fade-in');
        artistCard.style.animationDelay = `${index * 0.08}s`;

        artistCard.innerHTML = `
            <img src="${artist.image}" alt="Imagem do ${artist.name}">
            <div>
                <h3>${artist.name}</h3>
                <p>Artista</p>
            </div>
        `;

        artistGrid.appendChild(artistCard);
    });
    // Função para renderizar as músicas
    function renderMusicasAPI(musicas) {
        musicasGrid.innerHTML = "";  // Limpa o conteúdo anterior
        musicas.forEach((musica, index) => {
            const musicaCard = document.createElement('div');
            musicaCard.classList.add('musica-card', 'fade-in');
            musicaCard.style.animationDelay = `${index * 0.08}s`;

            musicaCard.innerHTML = `
<img src="${API_BASE}/Musica/GetCover/${musica.id}" alt="Capa do álbum ${musica.titulo}" onerror="this.src='https://via.placeholder.com/180'">
                <div>
                    <h3>${musica.titulo}</h3>
                    <p>${musica.artista ?? 'Artista desconhecido'}</p>
                </div>
            `;
            musicaCard.addEventListener('click', async () => {
                const id = musica.id;
                const title = musica.titulo;
                const artist = musica.artista;
                const coverUrl = `${API_BASE}/Musica/GetCover/${id}`;
                await tocarMusica(id, title, artist, coverUrl);
            });



            musicasGrid.appendChild(musicaCard);
        });
    }

    // Função para fazer a requisição da lista de músicas
    async function loadMusicasAPI() {
        try {
            const res = await fetch(`${API_BASE}/Musica/ListSongs`);
            if (!res.ok) throw new Error("Erro ao buscar músicas");

            const data = await res.json();
            console.log("Músicas retornadas:", data);  // Verifique se as músicas estão sendo retornadas

            renderMusicasAPI(data);  // Chama a função para renderizar as músicas
        } catch (err) {
            console.warn("API offline ou erro:", err);
            // Aqui você pode definir um fallback com músicas mockadas, se necessário
        }
    }

    // Função para tocar música (essa função ainda precisa ser definida)
    async function tocarMusica(id, titulo, artista, capaUrl) {
        try {
            const res = await fetch(`${API_BASE}/Musica/PlayMusic/${id}`);
            if (!res.ok) throw new Error("Erro ao tocar música");

            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);

            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer = null;
            }

            audioPlayer = new Audio(audioUrl);
            audioPlayer.play();

            // Atualiza o rodapé
            playerTitle.textContent = titulo;
            playerArtist.textContent = artista ?? "Artista desconhecido";
            playerCover.src = capaUrl;

            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';

            // Quando a música acabar, volta para botão de play
            audioPlayer.addEventListener('ended', () => {
                pauseBtn.style.display = 'none';
                playBtn.style.display = 'inline-block';
            });

        } catch (err) {
            console.warn("Erro ao tentar tocar a música:", err);
        }
    }


    // Tenta carregar as músicas da API
    loadMusicasAPI();
});
