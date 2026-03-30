import { useEffect, useState } from "react";
import { getSesiones, eliminarSesion } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const fetchSesiones = async () => {
    try {
      const data = await getSesiones();
      setSesiones(Array.isArray(data) ? data : data.sesiones || []);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando sesiones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSesiones();
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta sesión?")) return;
    try {
      await eliminarSesion(id);
      toast.success("Sesión eliminada");
      fetchSesiones();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error eliminando sesión");
    }
  };

  const sesionesFiltradas = sesiones.filter(
    (s) =>
      s.tituloSesion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.evento?.nombreEvento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.ponente?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🗓 Sesiones</h1>
        <Link
          to="/sesiones/crear"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          + Agregar Sesión
        </Link>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por título, evento o ponente..."
        className="w-full mb-4 p-2 rounded bg-gray-800"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* LOADER */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {sesionesFiltradas.length === 0 ? (
            <p className="text-gray-500">No hay sesiones registradas.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sesionesFiltradas.map((sesion) => (
                <div
                  key={sesion._id}
                  className="bg-gray-900 p-5 rounded-xl shadow-lg border border-gray-800"
                >
                  {/* ICONO + TÍTULO */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                      🗓
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">
                        {sesion.tituloSesion}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        ⏰ {sesion.horaInicio} — {sesion.horaFin}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN */}
                  {sesion.descripcionSesion && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {sesion.descripcionSesion}
                    </p>
                  )}

                  {/* EVENTO */}
                  <div className="bg-gray-800 rounded-lg p-2 mb-2">
                    <p className="text-xs text-gray-400">📅 Evento</p>
                    <p className="text-sm font-semibold">
                      {sesion.evento?.nombreEvento || "Sin evento"}
                    </p>
                  </div>

                  {/* PONENTE */}
                  <div className="bg-gray-800 rounded-lg p-2 mb-4">
                    <p className="text-xs text-gray-400">🎤 Ponente</p>
                    <p className="text-sm font-semibold">
                      {sesion.ponente?.nombre || "Sin ponente"}
                    </p>
                    {sesion.ponente?.especialidad && (
                      <p className="text-xs text-blue-400">
                        {sesion.ponente.especialidad}
                      </p>
                    )}
                  </div>

                  {/* ACCIONES */}
                  <div className="flex gap-2">
                    <Link
                      to={`/sesiones/editar/${sesion._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm flex-1 text-center"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(sesion._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex-1"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};