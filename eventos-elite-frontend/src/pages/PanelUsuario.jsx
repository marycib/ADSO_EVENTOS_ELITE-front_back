import { useEffect, useState, useCallback } from "react";
import { misInscripciones, cancelarInscripcion } from "../services/api";
import toast from "react-hot-toast";

export const PanelUsuario = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState("eventos");
  const rol = localStorage.getItem("rol");
  const nombre = localStorage.getItem("nombreUsuario");

  const fetchInscripciones = useCallback(async () => {
    try {
      const res = await misInscripciones();
      setData(res.inscripciones || []);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando inscripciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInscripciones();
  }, [fetchInscripciones]);

  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar esta inscripción?")) return;
    try {
      await cancelarInscripcion(id);
      toast.success("Inscripción cancelada");
      fetchInscripciones();
    } catch (error) {
      toast.error(error.message || "Error al cancelar");
    }
  };

  const getBadgeRol = (rol) => {
    switch (rol) {
      case "administrador":
        return "bg-red-500";
      case "organizador":
        return "bg-green-500";
      case "ponente":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  const getBadgeInscripcion = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-600";
      case "pendiente":
        return "bg-yellow-600";
      case "cancelada":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex bg-gray-950 text-white min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Mi Panel</h2>
        {nombre && (
          <p className="text-gray-400 text-sm mb-6">Hola, {nombre} 👋</p>
        )}

        <ul className="space-y-2 flex-1">
          <li
            onClick={() => setVista("eventos")}
            className={`px-3 py-2 rounded cursor-pointer transition ${
              vista === "eventos"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            📅 Mis inscripciones
          </li>
          <li
            onClick={() => setVista("perfil")}
            className={`px-3 py-2 rounded cursor-pointer transition ${
              vista === "perfil"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            👤 Mi Perfil
          </li>
        </ul>

        {/* CERRAR SESIÓN */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            localStorage.removeItem("nombreUsuario");
            window.location.href = "/login";
          }}
          className="mt-6 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm w-full"
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        {/* VISTA: MIS INSCRIPCIONES */}
        {vista === "eventos" && (
          <>
            <h1 className="text-3xl font-bold mb-6">🎟 Mis inscripciones</h1>

            {loading ? (
              <div className="flex justify-center mt-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">
                  No tienes inscripciones aún
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Ve a{" "}
                  <a href="/eventos" className="text-blue-400 underline">
                    Eventos
                  </a>{" "}
                  e inscríbete en uno
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {data.map((i) => (
                  <div
                    key={i._id}
                    className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-xl transition border border-gray-800"
                  >
                    {/* NOMBRE EVENTO */}
                    <h3 className="text-xl font-bold mb-1">
                      {i.evento?.nombreEvento || "Evento no disponible"}
                    </h3>

                    {/* DESCRIPCIÓN */}
                    {i.evento?.descripcionEvento && (
                      <p className="text-gray-400 text-sm mb-3">
                        {i.evento.descripcionEvento}
                      </p>
                    )}

                    {/* DETALLES */}
                    <div className="space-y-1 mb-3">
                      {i.evento?.fechaEvento && (
                        <p className="text-gray-500 text-xs">
                          📅{" "}
                          {new Date(i.evento.fechaEvento).toLocaleDateString(
                            "es-CO",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      )}
                      {i.evento?.ubicacionEvento && (
                        <p className="text-gray-500 text-xs">
                          📍 {i.evento.ubicacionEvento}
                        </p>
                      )}
                    </div>

                    {/* BADGES */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getBadgeInscripcion(
                          i.estadoInscripcion
                        )}`}
                      >
                        Inscripción: {i.estadoInscripcion}
                      </span>
                      {i.certificadoEmitido && (
                        <span className="bg-purple-600 px-2 py-1 text-xs rounded">
                          🎓 Certificado emitido
                        </span>
                      )}
                    </div>

                    {/* BOTÓN CANCELAR */}
                    {i.estadoInscripcion !== "cancelada" && (
                      <button
                        onClick={() => handleCancelar(i._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm w-full transition"
                      >
                        Cancelar inscripción
                      </button>
                    )}

                    {i.estadoInscripcion === "cancelada" && (
                      <p className="text-gray-600 text-sm text-center">
                        Inscripción cancelada
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* VISTA: PERFIL */}
        {vista === "perfil" && (
          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-6">👤 Mi Perfil</h1>

            <div className="bg-gray-900 p-6 rounded-xl shadow border border-gray-800">
              {/* AVATAR */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {nombre?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* NOMBRE */}
              <h2 className="text-xl font-bold text-center mb-1">
                {nombre || "Usuario"}
              </h2>

              {/* ROL */}
              <div className="flex justify-center mb-6">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getBadgeRol(
                    rol
                  )}`}
                >
                  {rol || "sin rol"}
                </span>
              </div>

              {/* ESTADÍSTICAS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">{data.length}</p>
                  <p className="text-gray-400 text-xs">Total inscripciones</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {
                      data.filter((i) => i.estadoInscripcion === "confirmada")
                        .length
                    }
                  </p>
                  <p className="text-gray-400 text-xs">Confirmadas</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {data.filter((i) => i.certificadoEmitido).length}
                  </p>
                  <p className="text-gray-400 text-xs">Certificados</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {
                      data.filter((i) => i.estadoInscripcion === "cancelada")
                        .length
                    }
                  </p>
                  <p className="text-gray-400 text-xs">Canceladas</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};