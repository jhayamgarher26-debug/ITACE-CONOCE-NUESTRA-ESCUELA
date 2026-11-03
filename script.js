/* ITACE DIGITAL 4.0 | Interacciones del sitio */
"use strict";

const barraProgreso = document.getElementById("barraProgreso");
const toast = document.getElementById("toast");

function mostrarMensaje(mensaje) {
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add("visible");
    window.clearTimeout(mostrarMensaje.temporizador);
    mostrarMensaje.temporizador = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

/* Menú adaptable para celular y tableta */
const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menuToggle");
function cerrarMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.remove("menu-abierto");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
}
if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
        const abierto = menu.classList.toggle("menu-abierto");
        menuToggle.setAttribute("aria-expanded", String(abierto));
        menuToggle.setAttribute("aria-label", abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });
    menu.querySelectorAll("a").forEach(enlace => enlace.addEventListener("click", cerrarMenu));
    document.addEventListener("keydown", evento => { if (evento.key === "Escape") cerrarMenu(); });
    document.addEventListener("click", evento => {
        if (!menu.contains(evento.target) && !menuToggle.contains(evento.target)) cerrarMenu();
    });
}

/* Marcar la sección que se está visitando */
const enlacesMenu = [...document.querySelectorAll(".menu a[href^='#']")];
const secciones = enlacesMenu.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;
            enlacesMenu.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === `#${entrada.target.id}`));
        });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    secciones.forEach(seccion => observador.observe(seccion));
}

/* Botones informativos */
document.querySelectorAll(".boton-info").forEach(boton => {
    boton.addEventListener("click", () => mostrarMensaje(boton.dataset.info || "Información no disponible."));
});

/* Reflexión */
const botonOpinion = document.getElementById("botonOpinion");
const reflexion = document.getElementById("reflexion");
if (botonOpinion && reflexion) {
    botonOpinion.addEventListener("click", () => {
        const visible = reflexion.classList.toggle("visible");
        botonOpinion.textContent = visible ? "Ocultar reflexión" : "Leer mi reflexión";
        botonOpinion.setAttribute("aria-expanded", String(visible));
    });
}

/* Galería ampliable con teclado */
const visor = document.getElementById("visor");
const imagenGrande = document.getElementById("imagenGrande");
const textoFoto = document.getElementById("textoFoto");
const cerrarVisor = document.getElementById("cerrarVisor");
let elementoAnterior = null;
function abrirGaleria(imagen) {
    if (!visor || !imagenGrande) return;
    if (!imagen.complete || imagen.naturalWidth === 0) {
        mostrarMensaje("No se encontró esta fotografía. Revisa el nombre del archivo en la carpeta img.");
        return;
    }
    elementoAnterior = document.activeElement;
    imagenGrande.src = imagen.currentSrc || imagen.src;
    imagenGrande.alt = imagen.alt || "Fotografía del ITACE";
    if (textoFoto) textoFoto.textContent = imagen.alt || "Fotografía del ITACE";
    visor.classList.add("activo");
    visor.setAttribute("aria-hidden", "false");
    cerrarVisor?.focus();
}
function cerrarGaleria() {
    if (!visor || !imagenGrande) return;
    visor.classList.remove("activo");
    visor.setAttribute("aria-hidden", "true");
    imagenGrande.removeAttribute("src");
    elementoAnterior?.focus?.();
}
document.querySelectorAll(".foto img").forEach(imagen => {
    imagen.tabIndex = 0;
    imagen.setAttribute("role", "button");
    imagen.setAttribute("aria-label", `Ampliar fotografía: ${imagen.alt}`);
    imagen.addEventListener("click", () => abrirGaleria(imagen));
    imagen.addEventListener("keydown", evento => {
        if (evento.key === "Enter" || evento.key === " ") { evento.preventDefault(); abrirGaleria(imagen); }
    });
});
cerrarVisor?.addEventListener("click", cerrarGaleria);
visor?.addEventListener("click", evento => { if (evento.target === visor) cerrarGaleria(); });
document.addEventListener("keydown", evento => { if (evento.key === "Escape" && visor?.classList.contains("activo")) cerrarGaleria(); });

/* Progreso de lectura */
function actualizarProgreso() {
    if (!barraProgreso) return;
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje = recorrido > 0 ? (window.scrollY / recorrido) * 100 : 0;
    barraProgreso.style.width = `${Math.min(100, Math.max(0, porcentaje))}%`;
}
window.addEventListener("scroll", actualizarProgreso, { passive: true });
window.addEventListener("resize", actualizarProgreso);
actualizarProgreso();

/* Aviso visual cuando falta un recurso de imagen */
document.querySelectorAll("img").forEach(imagen => {
    imagen.addEventListener("error", () => {
        imagen.classList.add("imagen-no-disponible");
        imagen.dataset.errorImagen = "true";
        imagen.setAttribute("aria-label", `${imagen.alt || "Imagen"}. Archivo pendiente de agregar.`);
    });
});


/* Evitar que varios audios y videos se reproduzcan al mismo tiempo */

const reproductores = document.querySelectorAll("audio, video");

reproductores.forEach(reproductor => {
    reproductor.addEventListener("play", () => {

        reproductores.forEach(otro => {
            if (otro !== reproductor) {
                otro.pause();
            }
        });

    });
});


const docentes = [

    {
        nombre: "Gerardo de la Rosa Ortega",
        foto: "img/maestros/gerardo.jpeg",
        especialidad: "Licenciado en Contaduría",
        materias: ["Inglés"],
        semestre: "5.º semestre",
        academia: "Idiomas"
    },

    {
        nombre: "Erika Aidé Pérez Abrego",
        foto: "img/maestros/erika.jpeg",
        especialidad: "Ingeniería Industrial en Sistemas y Maestría en Educación",
        materias: ["Ciencias Naturales", "Humanidades"],
        semestre: "3.º y 5.º semestre",
        academia: "Ciencias y Humanidades"
    },

    {
        nombre: "Samuel Gonzales de la Fuente",
        foto: "img/maestros/samuel.jpeg",
        especialidad: "Licenciatura en Administración de Empresas y carrera técnica en Ebanistería",
        materias: [
            "Pensamiento Filosófico 1 y 3",
            "Ciencias Sociales 1",
            "Estudios Literarios"
        ],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Humanidades y Ciencias Sociales"
    },

    {
        nombre: "Laura Esmeralda Heredia Blanco",
        foto: "img/maestros/laura.jpeg",
        especialidad: "Bióloga, especializada en Física y Química",
        materias: ["Ciencias 1, 3 y 5"],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Ciencias"
    },

    {
        nombre: "Felipe Hernández González",
        foto: "img/maestros/felipe.jpeg",
        especialidad: "Ingeniería en Electrónica",
        materias: [
            "Módulo de Electrónica y Semiconductores",
            "Lengua y Comunicación 1 y 3",
            "Conciencia Histórica 2"
        ],
        semestre: "3.º y 5.º semestre",
        academia: "Electrónica y Comunicación"
    },

    {
        nombre: "Luis Enrique Lerma Martínez",
        foto: "img/maestros/luis.jpeg",
        especialidad: "Ingeniería Petrolera, Licenciatura en Pedagogía/Docencia y Diplomado en Competencias Docentes",
        materias: [
            "Conciencia Histórica",
            "Formación Socioemocional",
            "Lengua y Comunicación",
            "Mantenimiento Petrolero",
            "Mantenimiento Industrial"
        ],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Multidisciplinaria"
    },

    {
        nombre: "Yuridia Lizbeth Cepeda Ramos",
        foto: "img/maestros/yuridia.jpeg",
        especialidad: "Ingeniería Industrial, Licenciatura en Matemáticas, Maestría en Educación e Innovación Educativa y actualmente estudia un Doctorado en Educación",
        materias: [
            "Inglés",
            "Temas Selectos de Matemáticas 2"
        ],
        semestre: "No especificado",
        academia: "Matemáticas e Idiomas"
    },

    {
        nombre: "Juan Pablo Torres Adame",
        foto: "img/maestros/juan.jpeg",
        especialidad: "Licenciatura en Información Administrativa y Maestría en Ciencias de la Enseñanza",
        materias: [
            "Programación",
            "Cultura Digital"
        ],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Programación",
        extra: "Club de Robótica · Cursos de Excel los sábados"
    },

    {
        nombre: "Romualdo Guadalupe de la Cruz",
        foto: "img/maestros/romualdo.jpeg",
        especialidad: "Mantenimiento Industrial y Mantenimiento en Instalaciones Petroleras",
        materias: ["Pensamiento Matemático 1 y 3"],
        semestre: "1.º y 3.º semestre",
        academia: "Matemáticas"
    },

    {
        nombre: "Nohemí Quintanilla Arcos",
        foto: "img/maestros/nohemi.jpeg",
        especialidad: "Perfecta",
        materias: ["No especificada"],
        semestre: "No especificado",
        academia: "Otra"
    },

    {
        nombre: "Liliana Rosas Pacheco",
        foto: "img/maestros/liliana.jpeg",
        especialidad: "Licenciatura en Pedagogía, Maestría en Educación Media Superior/Docencia y Doctorado en Educación",
        materias: [
            "Humanidades",
            "Pensamiento Filosófico",
            "Conciencia Histórica",
            "Lengua y Comunicación",
            "Formación Socioemocional"
        ],
        semestre: "1.º y 5.º semestre",
        academia: "Humanidades"
    },

    {
        nombre: "Ulises Solís Rieboles",
        foto: "img/maestros/ulises.jpeg",
        especialidad: "Químico Farmacéutico Biólogo, Maestría en Análisis Clínicos, Maestría en Educación y actualmente estudia un Doctorado en Educación",
        materias: ["Ciencias Naturales 1, 3 y 5"],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Ciencias"
    },

    {
        nombre: "Benjamín Limón Martínez",
        foto: "img/maestros/benjamin.jpeg",
        especialidad: "Informática en Sistemas, Administración en Productividad y Calidad y Maestría en Educación",
        materias: [
            "Programación",
            "Inteligencia Artificial",
            "Cultura Digital"
        ],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Programación"
    },

    {
        nombre: "Trinidad Hernades Barrera",
        foto: "img/maestros/trinidad.jpeg",
        especialidad: "Biólogo",
        materias: [
            "Ciencias Naturales",
            "Experimentales y Tecnología 1, 3 y 5"
        ],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Ciencias"
    },

    {
        nombre: "Erik Ramírez Solís",
        foto: "img/maestros/erik.jpeg",
        especialidad: "Ingeniería en Electromecánica y Maestría en Educación",
        materias: ["Pensamiento Matemático"],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Matemáticas"
    },

    {
        nombre: "Mildred Yasmín Reyes Norberto",
        foto: "img/maestros/mildred.jpeg",
        especialidad: "Ingeniería Química y Maestría en Docencia",
        materias: ["Temas Selectos de Matemáticas 2"],
        semestre: "5.º semestre",
        academia: "Matemáticas"
    },

    {
        nombre: "Isidro de León Flores",
        foto: "img/maestros/isidro.jpeg",
        especialidad: "Licenciatura en Psicopedagogía y Licenciatura en Pedagogía",
        materias: ["Educación Física Premilitar"],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Educación Física"
    },

    {
        nombre: "Bertha Alicia Zapata Aldape",
        foto: "img/maestros/bertha.jpeg",
        especialidad: "Doctorado",
        materias: ["Matemáticas"],
        semestre: "1.º y 3.º semestre",
        academia: "Matemáticas"
    },

    {
        nombre: "Carlos Melecio Carmona Olivares",
        foto: "img/maestros/carlos.jpeg",
        especialidad: "Licenciatura en Diseño Gráfico y Maestría en Educación Básica",
        materias: [
            "Módulo Profesional en Diseño Gráfico",
            "Inglés"
        ],
        semestre: "1.º y 3.º semestre",
        academia: "Diseño e Idiomas"
    },

    {
        nombre: "Grecia Ávalos Ramos",
        foto: "img/maestros/grecia.jpeg",
        especialidad: "Licenciatura y Maestría",
        materias: ["Lengua y Comunicación"],
        semestre: "1.º y 3.º semestre",
        academia: "Comunicación"
    },

    {
        nombre: "Sandra Catalina Silva Camacho",
        foto: "img/maestros/sandra.jpeg",
        especialidad: "Maestría en Metodología de la Enseñanza",
        materias: ["Comunicación"],
        semestre: "5.º semestre",
        academia: "Comunicación"
    },

    {
        nombre: "Karla Valeria Moran Lerma",
        foto: "img/maestros/karla.jpeg",
        especialidad: "Maestría",
        materias: [
            "Pensamiento Filosófico",
            "Ciencias Sociales",
            "Cultura Digital"
        ],
        semestre: "1.º y 3.º semestre",
        academia: "Humanidades y Ciencias Sociales"
    },

    {
        nombre: "Norma Elena Torres Quiñones",
        foto: "img/maestros/norma.jpeg",
        especialidad: "Ingeniería Química y Maestría en Docencia",
        materias: [
            "Ciencias Naturales",
            "IT"
        ],
        semestre: "1.º, 3.º y 5.º semestre",
        academia: "Ciencias"
    },

    {
        nombre: "Brenda Itzel Herrera García",
        foto: "img/maestros/brenda.jpeg",
        especialidad: "Técnica en Informática, Ingeniería en Sistemas Computacionales y Maestría en Educación",
        materias: [
            "Cultura Digital",
            "Inteligencia Artificial"
        ],
        semestre: "1.º y 3.º semestre",
        academia: "Programación"
    },

    {
        nombre: "Walter Allan Barrera Cerda",
        foto: "img/maestros/walter.jpeg",
        especialidad: "Ingeniería Industrial y Administración",
        materias: ["Inglés 3"],
        semestre: "Inglés en 3.º semestre; club en 1.º, 2.º y 3.º semestre",
        academia: "Idiomas",
        extra: "Club de Rondalla"
    }

];

/* Directorio docente: búsqueda por nombre, materia, academia, semestre y perfil */
const buscarDocente = document.getElementById("buscarDocente");
const filtroAcademia = document.getElementById("filtroAcademia");
const resultadosDocentes = document.getElementById("resultadosDocentes");
const limpiarDirectorio = document.getElementById("limpiarDirectorio");
const totalDocentes = document.getElementById("totalDocentes");

function crearTexto(etiqueta, contenido) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${etiqueta}: `;
    p.append(strong, document.createTextNode(contenido));
    return p;
}
function normalizar(texto) {
    return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX").trim();
}
function renderizarDocentes() {
    if (!resultadosDocentes) return;
    const texto = normalizar(buscarDocente?.value);
    const academia = filtroAcademia?.value || "";
    const filtrados = docentes.filter(docente => {
        const contenido = [docente.nombre, docente.especialidad, docente.academia,
            ...(docente.materias || []), docente.semestre, docente.extra].join(" ");
        return normalizar(contenido).includes(texto) && (!academia || docente.academia === academia);
    });
    resultadosDocentes.replaceChildren();
    if (totalDocentes) totalDocentes.textContent = `${filtrados.length} ${filtrados.length === 1 ? "docente encontrado" : "docentes encontrados"}`;
    if (!filtrados.length) {
        const vacio = document.createElement("p");
        vacio.className = "directorio-vacio";
        vacio.textContent = "No se encontraron docentes con esa búsqueda. Intenta con otro nombre, materia o academia.";
        resultadosDocentes.append(vacio);
        return;
    }
    const fragmento = document.createDocumentFragment();
    filtrados.forEach(docente => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "docente-card";
        const fotoWrap = document.createElement("div");
        fotoWrap.className = "docente-foto-wrap";
        const foto = document.createElement("img");
        foto.className = "docente-foto";
        foto.src = docente.foto || "img/maestros/sin-foto.jpg";
        foto.alt = `Fotografía de ${docente.nombre}`;
        foto.loading = "lazy";
        foto.decoding = "async";
        foto.addEventListener("error", () => {
            foto.src = "img/maestros/sin-foto.jpg";
            foto.addEventListener("error", () => { foto.hidden = true; }, { once: true });
        }, { once: true });
        fotoWrap.append(foto);
        const area = document.createElement("span");
        area.className = "docente-area";
        area.textContent = docente.academia || "Área no especificada";
        const nombre = document.createElement("h3");
        nombre.textContent = docente.nombre;
        tarjeta.append(fotoWrap, area, nombre,
            crearTexto("Especialidad", docente.especialidad || "No especificada"),
            crearTexto("Materia(s)", (docente.materias || []).join(", ") || "No especificadas"),
            crearTexto("Semestre(s)", docente.semestre || "No especificado"));
        if (docente.extra) tarjeta.append(crearTexto("Actividad adicional", docente.extra));
        fragmento.append(tarjeta);
    });
    resultadosDocentes.append(fragmento);
}
buscarDocente?.addEventListener("input", renderizarDocentes);
filtroAcademia?.addEventListener("change", renderizarDocentes);
limpiarDirectorio?.addEventListener("click", () => {
    if (buscarDocente) buscarDocente.value = "";
    if (filtroAcademia) filtroAcademia.value = "";
    renderizarDocentes();
    buscarDocente?.focus();
});
renderizarDocentes();
