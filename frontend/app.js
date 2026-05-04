import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const API_URL = "http://localhost:8000";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authPanel = document.querySelector("#authPanel");
const chatPanel = document.querySelector("#chatPanel");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const authMessage = document.querySelector("#authMessage");
const userEmail = document.querySelector("#userEmail");
const messages = document.querySelector("#messages");
const chatInput = document.querySelector("#chatInput");

async function getToken() {
  if (!auth.currentUser) throw new Error("Ban chua dang nhap");
  return auth.currentUser.getIdToken();
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Request that bai");
  }

  return response.json();
}

function formatTime(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function renderPair(item) {
  const fragment = document.createDocumentFragment();

  const bot = document.createElement("article");
  bot.className = "bubble bot";
  bot.innerHTML = `${escapeHtml(item.answer)}<span class="time">${formatTime(item.created_at)}</span>`;

  const user = document.createElement("article");
  user.className = "bubble user";
  user.innerHTML = `${escapeHtml(item.question)}<span class="time">${formatTime(item.created_at)}</span>`;

  fragment.append(bot, user);
  return fragment;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  }[char]));
}

async function loadMessages() {
  messages.innerHTML = "";
  const history = await apiFetch("/messages");
  history.forEach((item) => messages.append(renderPair(item)));
}

async function handleAuth(action) {
  authMessage.textContent = "";
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    if (action === "register") {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    authMessage.textContent = error.message;
  }
}

document.querySelector("#loginBtn").addEventListener("click", () => handleAuth("login"));
document.querySelector("#registerBtn").addEventListener("click", () => handleAuth("register"));
document.querySelector("#logoutBtn").addEventListener("click", () => signOut(auth));

document.querySelector("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  try {
    const item = await apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
    messages.prepend(renderPair(item));
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

onAuthStateChanged(auth, async (user) => {
  authMessage.textContent = "";
  if (!user) {
    authPanel.classList.remove("hidden");
    chatPanel.classList.add("hidden");
    return;
  }

  userEmail.textContent = user.email || user.uid;
  authPanel.classList.add("hidden");
  chatPanel.classList.remove("hidden");

  try {
    await apiFetch("/auth/me");
    await loadMessages();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});
