import { useEffect, useState } from "react";
import { getPonentes, eliminarPonente } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const Ponentes = () => {
  const [ponentes, setPonentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const fetchPonentes = async () => {
    try {
      const data = await getPonentes();
      setPonentes(Array.isArray(data) ? data : data.ponentes || []);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando ponentes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPonentes();
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este ponente?")) return;
    try {
      await eliminarPonente(id);
      toast.success("Ponente eliminado");
      fetchPonentes();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error eliminando ponente");
    }
  };

  const ponentesFiltrados = ponentes.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.especialidad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.correo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎤 Ponentes</h1>
        <Link
          to="/ponentes/crear"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          + Agregar Ponente
        </Link>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre, especialidad o correo..."
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
          {ponentesFiltrados.length === 0 ? (
            <p className="text-gray-500">No hay ponentes registrados.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ponentesFiltrados.map((ponente) => (
                <div
                  key={ponente._id}
                  className="bg-gray-900 p-5 rounded-xl shadow-lg"
                >
                  {/* AVATAR */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold mb-3">
                    {ponente.nombre?.charAt(0).toUpperCase()}
                  </div>

                  {/* INFO */}
                  <h3 className="text-lg font-bold">{ponente.nombre}</h3>
                  <p className="text-blue-400 text-sm mb-1">
                    {ponente.especialidad}
                  </p>
                  <p className="text-gray-400 text-sm mb-1">
                    📧 {ponente.correo}
                  </p>
                  {ponente.telefono && (
                    <p className="text-gray-400 text-sm mb-1">
                      📞 {ponente.telefono}
                    </p>
                  )}
                  {ponente.biografia && (
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                      {ponente.biografia}
                    </p>
                  )}

                  {/* ACCIONES */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/ponentes/editar/${ponente._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm flex-1 text-center"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(ponente._id)}
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