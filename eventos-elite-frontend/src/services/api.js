// =============================
// CONFIGURACIÓN BASE
// =============================

const API = "http://localhost:5000/api";

// Guarda y recupera el token
export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const removeToken = () => localStorage.removeItem("token");

// Función base para todas las peticiones
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || data.msg || "Error en la petición");
  return data;
};

// =============================
// AUTH / LOGIN
// =============================

// ✅ CORREGIDO: usa la variable API en lugar de URL hardcodeada
// ✅ CORREGIDO: maneja tanto "mensaje" como "msg" en errores
export const login = async (data) => {
  const res = await fetch(`${API}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.mensaje || json.msg || "Error en login");
  return json;
};

export const register = (data) =>
  fetch(`${API}/usuarios/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

// =============================
// EVENTOS
// =============================

export const getEventos = () =>
  fetch(`${API}/eventos/listar`).then(handleResponse);

export const crearEvento = (data) =>
  fetch(`${API}/eventos/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

// ✅ CORREGIDO: indentación alineada con el resto de exports
export const cancelarEvento = (id) =>
  fetch(`${API}/eventos/${id}/cancelar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const finalizarEvento = (id) =>
  fetch(`${API}/eventos/${id}/finalizar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

// =============================
// INSCRIPCIONES
// =============================

export const inscribirse = (id) =>
  fetch(`${API}/inscripciones/inscribir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ evento: id }),
  }).then(handleResponse);

export const misInscripciones = () =>
  fetch(`${API}/inscripciones/mis-inscripciones`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const cancelarInscripcion = (id) =>
  fetch(`${API}/inscripciones/${id}/cancelar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

// =============================
// USUARIOS
// =============================

export const getUsuarios = () =>
  fetch(`${API}/usuarios/listar`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const getUsuarioById = (id) =>
  fetch(`${API}/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const crearUsuario = (data) =>
  fetch(`${API}/usuarios/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const actualizarUsuario = (id, data) =>
  fetch(`${API}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const eliminarUsuario = (id) =>
  fetch(`${API}/usuarios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

  // =============================
// ROLES
// =============================
export const getRoles = () =>
  fetch(`${API}/roles`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const getRolById = (id) =>
  fetch(`${API}/roles/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const crearRol = (data) =>
  fetch(`${API}/roles/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const actualizarRol = (id, data) =>
  fetch(`${API}/roles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const eliminarRol = (id) =>
  fetch(`${API}/roles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

  // =============================
// PONENTES
// =============================
export const getPonentes = () =>
  fetch(`${API}/ponentes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const getPonentePorId = (id) =>
  fetch(`${API}/ponentes/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const crearPonente = (data) =>
  fetch(`${API}/ponentes/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const actualizarPonente = (id, data) =>
  fetch(`${API}/ponentes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const eliminarPonente = (id) =>
  fetch(`${API}/ponentes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

  // =============================
// SESIONES
// =============================
export const getSesiones = () =>
  fetch(`${API}/sesiones/listar`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const getSesionPorId = (id) =>
  fetch(`${API}/sesiones/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const crearSesion = (data) =>
  fetch(`${API}/sesiones/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const actualizarSesion = (id, data) =>
  fetch(`${API}/sesiones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const eliminarSesion = (id) =>
  fetch(`${API}/sesiones/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);


  // =============================
// EVENTOS
// =============================
export const getEventoPorId = (id) =>
  fetch(`${API}/eventos/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const actualizarEvento = (id, data) =>
  fetch(`${API}/eventos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const eliminarEvento = (id) =>
  fetch(`${API}/eventos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

  // =============================
// INSCRIPCIONES - GESTIÓN (organizador/admin)
// =============================
export const getInscritosPorEvento = (eventoId) =>
  fetch(`${API}/eventos/${eventoId}/inscritos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const confirmarInscripcion = (id) =>
  fetch(`${API}/inscripciones/${id}/confirmar`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const emitirCertificado = (id) =>
  fetch(`${API}/inscripciones/${id}/certificado`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleResponse);

export const getEventosDisponibles = () =>
  fetch(`${API}/eventos/disponibles`).then(handleResponse);