import { useEffect, useState } from "react";
import { getUsuarioById } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const UsuarioDetalle = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getUsuarioById(id);
        setUsuario(data);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-white bg-gray-950 min-h-screen flex items-center justify-center">
        <p className="animate-pulse">Cargando usuario...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="p-6 text-white bg-gray-950 min-h-screen">
        <p>No se encontró el usuario</p>
        <button
          onClick={() => nav("/usuarios")}
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>
    );
  }

  const getRolColor = (rol) => {
    switch (rol) {
      case "administrador":
        return "bg-red-500";
      case "organizador":
        return "bg-blue-500";
      case "ponente":
        return "bg-purple-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detalle del Usuario</h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg">
        <div className="space-y-3">

          <div>
            <p className="text-gray-400 text-sm">Nombre</p>
            <p className="text-lg font-semibold">
              {usuario.nombreUsuario || "Sin nombre"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Correo</p>
            <p className="text-lg">
              {usuario.correoElectronico}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Rol</p>
            <span
              className={`px-3 py-1 rounded text-sm ${getRolColor(
                usuario.rol
              )}`}
            >
              {usuario.rol}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-sm">ID</p>
            <p className="text-xs break-all text-gray-300">
              {usuario._id}
            </p>
          </div>

        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => nav("/usuarios")}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Volver
          </button>

          <button
            onClick={() => nav(`/usuarios/editar/${usuario._id}`)}
            className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};