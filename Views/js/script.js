import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCYDzcxDfN_WU-JqCg66O5KCaH112BkJq4",
    authDomain: "spotify-6f703.firebaseapp.com",
    projectId: "spotify-6f703",
    storageBucket: "spotify-6f703.firebasestorage.app",
    messagingSenderId: "87379432123",
    appId: "1:87379432123:web:31ae94a05498fe54c00f9e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const actionsDiv = document.querySelector(".actions");
const artistGrid = document.querySelector('.artists-grid');
const musicasGrid = document.querySelector('.musicas-grid');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerCover = document.getElementById('player-cover');
const playBtn = document.getElementById('player-play');
const pauseBtn = document.getElementById('player-pause');

let audioPlayer = null;
const API_BASE = "http://localhost:5004/api";

// Função para criar avatar genérico
function getAvatarUrl(email) {
    return `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=1DB954&color=fff&rounded=true&size=32`;
}

// Usuário logado e logout
onAuthStateChanged(auth, user => {
    actionsDiv.innerHTML = "";

    if (!user) {
        // Caminho relativo correto para login
        window.location.href = "../LOGIN/login.html";
    } else {
        const userName = document.createElement("span");
        userName.textContent = user.email.split('@')[0];
        userName.style.color = "#fff";
        userName.style.fontWeight = "600";
        userName.style.marginRight = "8px";

        const avatar = document.createElement("img");
        avatar.src = getAvatarUrl(user.email);
        avatar.alt = "Avatar do usuário";
        avatar.style.width = "32px";
        avatar.style.height = "32px";
        avatar.style.borderRadius = "50%";
        avatar.style.marginRight = "12px";

        const logoutBtn = document.createElement("button");
        logoutBtn.textContent = "Sair";
        logoutBtn.classList.add("logout-btn");

        actionsDiv.appendChild(avatar);
        actionsDiv.appendChild(userName);
        actionsDiv.appendChild(logoutBtn);

        logoutBtn.addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "../LOGIN/login.html";
        });
    }
});

// Dados fixos de artistas
const artistsData = [
    { name: "Henrique & Juliano", image: 'https://akamai.sscdn.co/uploadfile/letras/fotos/8/f/0/6/8f0603b942e51fcd335fddde828b62cc.jpg' },
    { name: "Zé Neto & Cristiano", image: 'https://curtamais.com.br/goiania/wp-content/uploads/sites/2/2024/11/500x500.jpg' },
    { name: "Gusttavo Lima", image: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/09/imagem-29-1.jpg?w=1200&h=1200&crop=1' },
    { name: "Luan Santana", image: 'https://billboard.com.br/wp-content/uploads/2024/05/IMG_3206-3-scaled.jpg' },
    { name: "Matheus & Kauan", image: 'https://yt3.googleusercontent.com/EQBlMW5igU2KWWIDLHIO44r2xtkCpTSluc1ENA0msFsMn6kMnRlhp0_QQRtv2HA5DEidC5RaLg=s900-c-k-c0x00ffffff-no-rj' },
    { name: "Zé Felipe", image: 'https://www.estrelando.com.br/uploads/2022/05/27/ze-felipe-xingamento-bravo-virginia-fonseca-1653672693.jpg' },
];

// Renderiza artistas
function renderArtists() {
    artistGrid.innerHTML = "";
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
}

// Renderiza músicas da API
function renderMusicasAPI(musicas) {
    musicasGrid.innerHTML = "";
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

        musicaCard.addEventListener('click', () => {
            tocarMusica(musica.id, musica.titulo, musica.artista, `${API_BASE}/Musica/GetCover/${musica.id}`);
        });

        musicasGrid.appendChild(musicaCard);
    });
}

// Requisição API para músicas
async function loadMusicasAPI() {
    try {
        const res = await fetch(`${API_BASE}/Musica/ListSongs`);
        if (!res.ok) throw new Error("Erro ao buscar músicas");
        const data = await res.json();
        renderMusicasAPI(data);
    } catch (err) {
        console.warn("API offline ou erro:", err);
    }
}

// Tocar música
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

        playerTitle.textContent = titulo;
        playerArtist.textContent = artista ?? "Artista desconhecido";
        playerCover.src = capaUrl;

        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';

        audioPlayer.addEventListener('ended', () => {
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
        });

    } catch (err) {
        console.warn("Erro ao tentar tocar música:", err);
    }
}

// Player controls
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

// Inicializa página
document.addEventListener('DOMContentLoaded', () => {
    renderArtists();
    loadMusicasAPI();
});
