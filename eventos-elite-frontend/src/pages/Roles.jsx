import { useEffect, useState } from "react";
import { getRoles, eliminarRol } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : data.roles || []);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este rol?")) return;
    try {
      await eliminarRol(id);
      toast.success("Rol eliminado");
      fetchRoles();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error eliminando rol");
    }
  };

  const rolesFiltrados = roles.filter(
    (r) =>
      r.nombreRol?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛡 Roles</h1>
        <Link
          to="/roles/crear"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          + Crear Rol
        </Link>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar rol..."
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
          {rolesFiltrados.length === 0 ? (
            <p className="text-gray-500">No hay roles registrados.</p>
          ) : (
            <div className="overflow-x-auto bg-gray-900 rounded-xl">
              <table className="w-full">
                <thead className="bg-gray-800 text-gray-300 text-sm">
                  <tr>
                    <th className="p-4 text-left">Nombre</th>
                    <th className="p-4 text-left">Descripción</th>
                    <th className="p-4 text-left">Permisos</th>
                    <th className="p-4 text-left">Estado</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rolesFiltrados.map((rol) => (
                    <tr
                      key={rol._id}
                      className="border-b border-gray-800 hover:bg-gray-800 transition"
                    >
                      <td className="p-4 font-semibold">{rol.nombreRol}</td>
                      <td className="p-4 text-gray-400">
                        {rol.descripcion || "—"}
                      </td>
                      <td className="p-4">
                        {rol.permisos && rol.permisos.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rol.permisos.map((p, i) => (
                              <span
                                key={i}
                                className="bg-blue-600 text-xs px-2 py-1 rounded"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Sin permisos
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            rol.activo !== false
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {rol.activo !== false ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/roles/editar/${rol._id}`}
                            className="bg-yellow-500 px-2 py-1 rounded text-sm hover:bg-yellow-600"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleEliminar(rol._id)}
                            className="bg-red-500 px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};