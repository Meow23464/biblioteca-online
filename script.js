import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Configuración de Firebase
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
const buscador = document.getElementById("buscador");
const sugerencias = document.getElementById("sugerencias");
const btnAgregar = document.getElementById("btn-agregar");

const modalConfirmacion = document.getElementById("modal-confirmacion");
const confirmarEliminar = document.getElementById("confirmar-eliminar");
const cancelarEliminar = document.getElementById("cancelar-eliminar");

const modalEdicion = document.getElementById("modal-edicion");
const formularioLibro = document.getElementById("formulario-libro");
const modalTitulo = document.getElementById("modal-titulo");
const cancelarEdicion = document.getElementById("cancelar-edicion");

let todosLosLibros = [];
let idLibroAEliminar = null;
let idLibroAEditar = null;
const generosDisponibles = ["Ficción", "Comedia", "Leyendas"];

// Mostrar Botones de Géneros
function mostrarBotonesGeneros() {
  generosContainer.innerHTML = "";
  generosDisponibles.forEach(genero => {
    const btn = document.createElement("button");
    btn.textContent = genero;
    btn.classList.add("btn-genero");
    btn.addEventListener("click", () => {
      mostrarLibrosPorGenero(genero);
    });
    generosContainer.appendChild(btn);
  });
}

// Mostrar libros por género
function mostrarLibrosPorGenero(generoSeleccionado) {
  const librosFiltrados = todosLosLibros.filter(doc => {
    const libro = doc.data();
    return libro.genero && libro.genero.toLowerCase() === generoSeleccionado.toLowerCase();
  });
  mostrarLibros(librosFiltrados);
}

// Mostrar libros
function mostrarLibros(libros) {
  librosContainer.innerHTML = "";
  libros.forEach(doc => {
    const libro = doc.data();
    const div = document.createElement("div");
    div.classList.add("libro");

    div.innerHTML = `
      <h2>${libro.nombre || "Sin título"}</h2>
      <p><strong>Autor:</strong> ${libro.autor || "Desconocido"}</p>
      <p><strong>Año:</strong> ${libro.año || "Desconocido"}</p>
      <p><strong>Género:</strong> ${libro.genero || "Sin género"}</p>
      <p><strong>¿Está siendo leído?:</strong> ${libro.esta_siendoleido ? "Sí" : "No"}</p>
      <p><strong>Lector actual:</strong> ${libro.lector_actual || "Nadie aún"}</p>
      <button class="editar" data-id="${doc.id}">Editar</button>
      <button class="borrar" data-id="${doc.id}">Borrar</button>
    `;
    librosContainer.appendChild(div);
  });

  // Acciones para borrar y editar libros
  document.querySelectorAll(".borrar").forEach(btn => {
    btn.addEventListener("click", () => {
      idLibroAEliminar = btn.getAttribute("data-id");
      modalConfirmacion.style.display = "block";
    });
  });

  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", () => {
      idLibroAEditar = btn.getAttribute("data-id");
      modalEdicion.style.display = "block";
      modalTitulo.textContent = "Editar libro";
      const libro = todosLosLibros.find(doc => doc.id === idLibroAEditar).data();
      document.getElementById("nombre").value = libro.nombre;
      document.getElementById("autor").value = libro.autor;
      document.getElementById("año").value = libro.año;
      document.getElementById("genero").value = libro.genero;
      document.getElementById("esta_siendoleido").checked = libro.esta_siendoleido;
      document.getElementById("lector_actual").value = libro.lector_actual || "";
    });
  });
}

// Confirmar eliminación de libro
confirmarEliminar.addEventListener("click", async () => {
  await deleteDoc(doc(db, "libros", idLibroAEliminar));
  modalConfirmacion.style.display = "none";
});

cancelarEliminar.addEventListener("click", () => {
  modalConfirmacion.style.display = "none";
});

// Guardar o actualizar libro
formularioLibro.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const autor = document.getElementById("autor").value;
  const año = document.getElementById("año").value;
  const genero = document.getElementById("genero").value;
  const esta_siendoleido = document.getElementById("esta_siendoleido").checked;
  const lector_actual = document.getElementById("lector_actual").value;

  if (idLibroAEditar) {
    await updateDoc(doc(db, "libros", idLibroAEditar), {
      nombre, autor, año, genero, esta_siendoleido, lector_actual
    });
  } else {
    await addDoc(collection(db, "libros"), {
      nombre, autor, año, genero, esta_siendoleido, lector_actual
    });
  }

  modalEdicion.style.display = "none";
});

// Cancelar edición
cancelarEdicion.addEventListener("click", () => {
  modalEdicion.style.display = "none";
});

// Cargar libros desde Firestore
const cargarLibros = () => {
  const q = query(collection(db, "libros"));
  onSnapshot(q, snapshot => {
    todosLosLibros = snapshot.docs;
    mostrarLibros(todosLosLibros);
  });
};

cargarLibros();
mostrarBotonesGeneros();
