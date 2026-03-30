import { useEffect, useState } from "react";
import {
  getEventos,
  crearEvento,
  cancelarEvento,
  finalizarEvento,
} from "../services/api";
import toast from "react-hot-toast";

export const PanelOrganizador = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // FORM
  const [form, setForm] = useState({
    nombreEvento: "",
    descripcionEvento: "",
    fechaEvento: "",
    capacidadMaxima: "",
  });

  // ✅ CORREGIDO: helper para normalizar la respuesta de getEventos()
  // La API devuelve un array plano, no { eventos: [] }
  const normalizarEventos = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.eventos)) return data.eventos;
    return [];
  };

  // 🔥 CARGAR EVENTOS
  useEffect(() => {
    let mounted = true;

    const fetchEventos = async () => {
      try {
        const res = await getEventos();
        if (mounted) {
          // ✅ CORREGIDO: antes hacía res.eventos || [] pero getEventos()
          // devuelve un array directo, no { eventos: [] }
          setEventos(normalizarEventos(res));
        }
      } catch (error) {
        console.error(error);
        toast.error("Error cargando eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
    return () => (mounted = false);
  }, []);

  // 🔥 CREAR EVENTO
  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearEvento(form);
      toast.success("Evento creado");

      // Refrescar lista
      const res = await getEventos();
      setEventos(normalizarEventos(res));

      // ✅ CORREGIDO: reset completo del form — antes faltaba capacidadMaxima
      setForm({
        nombreEvento: "",
        descripcionEvento: "",
        fechaEvento: "",
        capacidadMaxima: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error creando evento");
    }
  };

  // 🔥 CANCELAR
  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar evento?")) return;
    try {
      await cancelarEvento(id);
      toast.success("Evento cancelado");
      const res = await getEventos();
      setEventos(normalizarEventos(res));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔥 FINALIZAR
  const handleFinalizar = async (id) => {
    if (!confirm("¿Finalizar evento?")) return;
    try {
      await finalizarEvento(id);
      toast.success("Evento finalizado");
      const res = await getEventos();
      setEventos(normalizarEventos(res));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🟡 LOADER
  if (loading) {
    return (
      <div className="p-10 text-white text-center">⏳ Cargando eventos...</div>
    );
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🛠 Panel Organizador</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleCrear}
        className="bg-gray-900 p-6 rounded-xl mb-8 space-y-4 max-w-md"
      >
        <h2 className="text-xl font-bold">Crear Evento</h2>

        <input
          placeholder="Nombre"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.nombreEvento}
          onChange={(e) => setForm({ ...form, nombreEvento: e.target.value })}
          required
        />

        <input
          placeholder="Descripción"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.descripcionEvento}
          onChange={(e) =>
            setForm({ ...form, descripcionEvento: e.target.value })
          }
          required
        />

        <input
          type="date"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.fechaEvento}
          onChange={(e) => setForm({ ...form, fechaEvento: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Capacidad máxima"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.capacidadMaxima}
          onChange={(e) =>
            setForm({ ...form, capacidadMaxima: e.target.value })
          }
          required
          min="1"
        />

        <input
          placeholder="Ubicación"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.ubicacionEvento || ""}
          onChange={(e) =>
            setForm({ ...form, ubicacionEvento: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full font-semibold"
        >
          Crear Evento
        </button>
      </form>

      {/* ================= LISTA ================= */}
      <h2 className="text-xl font-bold mb-4">
        Mis Eventos ({eventos.length})
      </h2>

      {eventos.length === 0 ? (
        <p className="text-gray-500">No hay eventos creados aún.</p>
      ) : (
        <div className="grid gap-4">
          {eventos.map((ev) => (
            <div
              key={ev._id}
              className="bg-gray-900 p-4 rounded-xl flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{ev.nombreEvento}</h3>
                <p className="text-gray-400 text-sm">{ev.descripcionEvento}</p>
                <p className="text-gray-500 text-xs mt-1">
                  📅 {new Date(ev.fechaEvento).toLocaleDateString("es-CO")} —
                  Estado:{" "}
                  <span
                    className={
                      ev.estadoEvento === "activo"
                        ? "text-green-400"
                        : ev.estadoEvento === "cancelado"
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  >
                    {ev.estadoEvento}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                {ev.estadoEvento === "activo" && (
                  <>
                    <button
                      onClick={() => handleCancelar(ev._id)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleFinalizar(ev._id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Finalizar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};