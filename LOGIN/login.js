import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const messageDiv = document.getElementById("message");

  function setMessage(text, isError = true) {
    messageDiv.textContent = text;
    messageDiv.style.color = isError ? "#b00020" : "#007700";
  }

  function toggleButtons(disabled = true) {
    loginBtn.disabled = disabled;
    signupBtn.disabled = disabled;
  }

  // Verifica se o usuário já está logado
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setMessage("Você já está logado! Redirecionando...", false);
      // Caminho relativo correto para a página inicial
      setTimeout(() => window.location.href = "../Views/index.html", 500);
    }
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) return setMessage("Preencha email e senha.");

    try {
      toggleButtons(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Redireciona após login
      window.location.href = "../Views/index.html";
    } catch (err) {
      setMessage(mapAuthError(err));
    } finally {
      toggleButtons(false);
    }
  });

  // Cadastro
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) return setMessage("Preencha email e senha.");
    if (password.length < 6) return setMessage("Senha precisa ter ao menos 6 caracteres.");

    try {
      toggleButtons(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // Redireciona após cadastro
      window.location.href = "../Views/index.html";
    } catch (err) {
      setMessage(mapAuthError(err));
    } finally {
      toggleButtons(false);
    }
  });

  function mapAuthError(err) {
    const code = err?.code || "";
    if (code.includes("auth/email-already-in-use")) return "Esse e-mail já está em uso.";
    if (code.includes("auth/invalid-email")) return "E-mail inválido.";
    if (code.includes("auth/weak-password")) return "Senha muito fraca (mínimo 6 caracteres).";
    if (code.includes("auth/wrong-password")) return "Senha incorreta.";
    if (code.includes("auth/user-not-found")) return "Usuário não encontrado.";
    return err.message || "Erro desconhecido. Veja o console (F12).";
  }
});
