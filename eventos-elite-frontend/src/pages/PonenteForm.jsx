import { useEffect, useState } from "react";
import { crearPonente, getPonentePorId, actualizarPonente } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export const PonenteForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    especialidad: "",
    correo: "",
    telefono: "",
    biografia: "",
  });
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { id } = useParams();

  // Cargar ponente si es edición
  useEffect(() => {
    if (id) {
      const fetchPonente = async () => {
        try {
          const data = await getPonentePorId(id);
          setForm({
            nombre: data.nombre || "",
            especialidad: data.especialidad || "",
            correo: data.correo || "",
            telefono: data.telefono || "",
            biografia: data.biografia || "",
          });
        } catch (error) {
          console.error(error);
          toast.error("Error cargando ponente");
        }
      };
      fetchPonente();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.nombre.trim()) {
      return toast.error("El nombre es obligatorio");
    }
    if (!form.especialidad.trim()) {
      return toast.error("La especialidad es obligatoria");
    }
    if (!form.correo.trim()) {
      return toast.error("El correo es obligatorio");
    }

    try {
      setLoading(true);
      if (id) {
        await actualizarPonente(id, form);
        toast.success("Ponente actualizado");
      } else {
        await crearPonente(form);
        toast.success("Ponente creado");
      }
      nav("/ponentes");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al guardar ponente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "✏️ Editar Ponente" : "🎤 Agregar Ponente"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Nombre */}
        <div>
          <label className="text-gray-400 text-sm">Nombre completo *</label>
          <input
            placeholder="Ej: Juan García"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
        </div>

        {/* Especialidad */}
        <div>
          <label className="text-gray-400 text-sm">Especialidad *</label>
          <input
            placeholder="Ej: Inteligencia Artificial"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.especialidad}
            onChange={(e) =>
              setForm({ ...form, especialidad: e.target.value })
            }
            required
          />
        </div>

        {/* Correo */}
        <div>
          <label className="text-gray-400 text-sm">Correo electrónico *</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="text-gray-400 text-sm">Teléfono (opcional)</label>
          <input
            placeholder="Ej: 3001234567"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </div>

        {/* Biografía */}
        <div>
          <label className="text-gray-400 text-sm">Biografía (opcional)</label>
          <textarea
            placeholder="Breve descripción del ponente..."
            className="w-full p-2 bg-gray-800 rounded mt-1 h-24 resize-none"
            value={form.biografia}
            onChange={(e) => setForm({ ...form, biografia: e.target.value })}
          />
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
            onClick={() => nav("/ponentes")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};