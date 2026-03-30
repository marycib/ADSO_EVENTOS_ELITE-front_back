import { useEffect, useState } from "react";
import { crearRol, getRolById, actualizarRol } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export const RolForm = () => {
  const [form, setForm] = useState({
    nombreRol: "",
    descripcion: "",
    permisos: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { id } = useParams();

  // Cargar rol si es edición
  useEffect(() => {
    if (id) {
      const fetchRol = async () => {
        try {
          const data = await getRolById(id);
          setForm({
            nombreRol: data.nombreRol || "",
            descripcion: data.descripcion || "",
            permisos: data.permisos ? data.permisos.join(", ") : "",
            activo: data.activo !== false,
          });
        } catch (error) {
          console.error(error);
          toast.error("Error cargando rol");
        }
      };
      fetchRol();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombreRol.trim()) {
      return toast.error("El nombre del rol es obligatorio");
    }

    // Convertir permisos de string a array
    const permisosArray = form.permisos
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    const dataToSend = {
      nombreRol: form.nombreRol.trim(),
      descripcion: form.descripcion.trim(),
      permisos: permisosArray,
      activo: form.activo,
    };

    try {
      setLoading(true);
      if (id) {
        await actualizarRol(id, dataToSend);
        toast.success("Rol actualizado");
      } else {
        await crearRol(dataToSend);
        toast.success("Rol creado");
      }
      nav("/roles");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al guardar rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Editar Rol" : "Crear Rol"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Nombre */}
        <div>
          <label className="text-gray-400 text-sm">Nombre del rol *</label>
          <input
            placeholder="Ej: moderador"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.nombreRol}
            onChange={(e) =>
              setForm({ ...form, nombreRol: e.target.value })
            }
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-gray-400 text-sm">Descripción</label>
          <input
            placeholder="Descripción del rol"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
          />
        </div>

        {/* Permisos */}
        <div>
          <label className="text-gray-400 text-sm">
            Permisos (separados por coma)
          </label>
          <input
            placeholder="Ej: crear_evento, editar_evento, ver_usuarios"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.permisos}
            onChange={(e) =>
              setForm({ ...form, permisos: e.target.value })
            }
          />
          <p className="text-gray-600 text-xs mt-1">
            Escribe los permisos separados por coma
          </p>
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) =>
              setForm({ ...form, activo: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label className="text-gray-400 text-sm">Rol activo</label>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded font-semibold"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => nav("/roles")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};