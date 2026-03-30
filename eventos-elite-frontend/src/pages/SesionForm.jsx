import { useEffect, useState } from "react";
import {
  crearSesion,
  getSesionPorId,
  actualizarSesion,
  getPonentes,
  getEventos,
} from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export const SesionForm = () => {
  const [form, setForm] = useState({
    tituloSesion: "",
    descripcionSesion: "",
    horaInicio: "",
    horaFin: "",
    evento: "",
    ponente: "",
  });
  const [loading, setLoading] = useState(false);
  const [ponentes, setPonentes] = useState([]);
  const [eventos, setEventos] = useState([]);

  const nav = useNavigate();
  const { id } = useParams();

  // Cargar ponentes y eventos para los selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataP, dataE] = await Promise.all([
          getPonentes(),
          getEventos(),
        ]);
        setPonentes(Array.isArray(dataP) ? dataP : dataP.ponentes || []);
        setEventos(Array.isArray(dataE) ? dataE : dataE.eventos || []);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando datos");
      }
    };
    fetchData();
  }, []);

  // Cargar sesión si es edición
  useEffect(() => {
    if (id) {
      const fetchSesion = async () => {
        try {
          const data = await getSesionPorId(id);
          setForm({
            tituloSesion: data.tituloSesion || "",
            descripcionSesion: data.descripcionSesion || "",
            horaInicio: data.horaInicio || "",
            horaFin: data.horaFin || "",
            evento: data.evento?._id || data.evento || "",
            ponente: data.ponente?._id || data.ponente || "",
          });
        } catch (error) {
          console.error(error);
          toast.error("Error cargando sesión");
        }
      };
      fetchSesion();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.tituloSesion.trim()) {
      return toast.error("El título es obligatorio");
    }
    if (!form.descripcionSesion.trim()) {
      return toast.error("La descripción es obligatoria");
    }
    if (!form.horaInicio) {
      return toast.error("La hora de inicio es obligatoria");
    }
    if (!form.horaFin) {
      return toast.error("La hora de fin es obligatoria");
    }
    if (!form.evento) {
      return toast.error("Debes seleccionar un evento");
    }
    if (!form.ponente) {
      return toast.error("Debes seleccionar un ponente");
    }

    try {
      setLoading(true);
      if (id) {
        await actualizarSesion(id, form);
        toast.success("Sesión actualizada");
      } else {
        await crearSesion(form);
        toast.success("Sesión creada");
      }
      nav("/sesiones");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al guardar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "✏️ Editar Sesión" : "🗓 Agregar Sesión"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Título */}
        <div>
          <label className="text-gray-400 text-sm">Título de la sesión *</label>
          <input
            placeholder="Ej: Introducción a Machine Learning"
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.tituloSesion}
            onChange={(e) => setForm({ ...form, tituloSesion: e.target.value })}
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-gray-400 text-sm">Descripción *</label>
          <textarea
            placeholder="Descripción de la sesión..."
            className="w-full p-2 bg-gray-800 rounded mt-1 h-24 resize-none"
            value={form.descripcionSesion}
            onChange={(e) =>
              setForm({ ...form, descripcionSesion: e.target.value })
            }
            required
          />
        </div>

        {/* Horas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm">Hora inicio *</label>
            <input
              type="time"
              className="w-full p-2 bg-gray-800 rounded mt-1"
              value={form.horaInicio}
              onChange={(e) =>
                setForm({ ...form, horaInicio: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Hora fin *</label>
            <input
              type="time"
              className="w-full p-2 bg-gray-800 rounded mt-1"
              value={form.horaFin}
              onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Evento */}
        <div>
          <label className="text-gray-400 text-sm">Evento *</label>
          <select
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.evento}
            onChange={(e) => setForm({ ...form, evento: e.target.value })}
            required
          >
            <option value="">-- Selecciona un evento --</option>
            {eventos.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.nombreEvento}
              </option>
            ))}
          </select>
        </div>

        {/* Ponente */}
        <div>
          <label className="text-gray-400 text-sm">Ponente *</label>
          <select
            className="w-full p-2 bg-gray-800 rounded mt-1"
            value={form.ponente}
            onChange={(e) => setForm({ ...form, ponente: e.target.value })}
            required
          >
            <option value="">-- Selecciona un ponente --</option>
            {ponentes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre} — {p.especialidad}
              </option>
            ))}
          </select>
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
            onClick={() => nav("/sesiones")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};