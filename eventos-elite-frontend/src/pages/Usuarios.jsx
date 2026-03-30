import { useEffect, useState } from "react";
import { getUsuarios, eliminarUsuario } from "../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const usuariosPorPagina = 5;

  // 🔹 Cargar usuarios
  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data.usuarios || data);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔍 FILTRO
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correoElectronico.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 📄 PAGINACIÓN
  const indexUltimo = paginaActual * usuariosPorPagina;
  const indexPrimero = indexUltimo - usuariosPorPagina;
  const usuariosActuales = usuariosFiltrados.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(
    usuariosFiltrados.length / usuariosPorPagina
  );

  // 🎨 BADGE COLOR
  const getBadgeColor = (rol) => {
    switch (rol) {
      case "administrador":
        return "bg-red-600";
      case "organizador":
        return "bg-blue-600";
      case "ponente":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  // 🗑 ELIMINAR
  const confirmarEliminar = async () => {
    try {
      await eliminarUsuario(usuarioAEliminar);
      toast.success("Usuario eliminado");
      setUsuarioAEliminar(null);
      fetchUsuarios();
    } catch (error) {
      console.error(error);
      toast.error("Error eliminando");
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>

        <Link
          to="/usuarios/crear"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          + Crear
        </Link>
      </div>

      {/* 🔍 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar usuario..."
        className="w-full mb-4 p-2 rounded bg-gray-800"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* ⏳ LOADER */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* TABLA */}
          <div className="overflow-x-auto bg-gray-900 rounded-xl">
            <table className="w-full">
              <thead className="bg-gray-800 text-gray-300 text-sm">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Correo</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosActuales.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-800 hover:bg-gray-800 transition"
                  >
                    <td className="p-4">{u.nombreUsuario}</td>
                    <td className="p-4 text-gray-400">
                      {u.correoElectronico}
                    </td>

                    {/* 🎨 BADGE */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getBadgeColor(
                          u.rol
                        )}`}
                      >
                        {u.rol}
                      </span>
                    </td>

                    <td className="p-4 flex justify-center gap-2">
                     <div className="flex gap-2">
  
  <Link
    to={`/usuarios/${u._id}`}
    className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
  >
    Ver
  </Link>

  <Link
    to={`/usuarios/editar/${u._id}`}
    className="bg-yellow-500 px-2 py-1 rounded"
  >
    Editar
  </Link>

  <button
    onClick={async () => {
      if (!confirm("¿Eliminar usuario?")) return;

      try {
        await eliminarUsuario(u._id);
        toast.success("Eliminado");
        fetchUsuarios();
      } catch {
        toast.error("Error");
      }
    }}
    className="bg-red-500 px-2 py-1 rounded"
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

          {/* 📄 PAGINACIÓN */}
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPaginaActual(i + 1)}
                className={`px-3 py-1 rounded ${
                  paginaActual === i + 1
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🧠 MODAL */}
      {usuarioAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">¿Seguro que deseas eliminar?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmarEliminar}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Sí, eliminar
              </button>

              <button
                onClick={() => setUsuarioAEliminar(null)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};