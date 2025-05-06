import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTBCPAHTimLmxiQuu2bXGIXyq6k0x-vcA",
  authDomain: "biblioteca-a8c9b.firebaseapp.com",
  databaseURL: "https://biblioteca-a8c9b-default-rtdb.firebaseio.com",
  projectId: "biblioteca-a8c9b",
  storageBucket: "biblioteca-a8c9b.appspot.com",
  messagingSenderId: "605509949359",
  appId: "1:605509949359:web:f26bda1c98203b0b06815a",
  measurementId: "G-4QK5QDCNP4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const librosContainer = document.getElementById("libros-container");
const generosContainer = document.getElementById("generos-container");

let todosLosLibros = [];

const mostrarLibros = (libros) => {
  librosContainer.innerHTML = "";
  libros.forEach(doc => {
    const libro = doc.data();
    const div = document.createElement("div");
    div.classList.add("libro");

    div.innerHTML = `
      <h2>${libro.nombre}</h2>
      <p><strong>Autor:</strong> ${libro.autor}</p>
      <p><strong>Año:</strong> ${libro.año}</p>
      <p><strong>Género:</strong> ${libro.genero}</p>
      <p><strong>¿Está siendo leído?:</strong> ${libro.esta_siendoleido ? "Sí" : "No"}</p>
      <p><strong>Lector actual:</strong> ${libro.lector_actual || "Nadie aún"}</p>
    `;
    librosContainer.appendChild(div);
  });
};

const crearBotonesGenero = (libros) => {
  generosContainer.innerHTML = "";
  const generosUnicos = [...new Set(libros.map(l => l.data().genero))];

  generosUnicos.forEach(genero => {
    const boton = document.createElement("button");
    boton.textContent = genero.toUpperCase();
    boton.onclick = () => {
      const filtrados = libros.filter(l => l.data().genero === genero);
      mostrarLibros(filtrados);
    };
    generosContainer.appendChild(boton);
  });

  // Botón para mostrar todos
  const botonTodos = document.createElement("button");
  botonTodos.textContent = "TODOS";
  botonTodos.onclick = () => mostrarLibros(libros);
  generosContainer.appendChild(botonTodos);
};

// Escucha en tiempo real
const q = query(collection(db, "libros"));
onSnapshot(q, (snapshot) => {
  todosLosLibros = snapshot.docs;
  crearBotonesGenero(todosLosLibros);
  mostrarLibros(todosLosLibros);
});
