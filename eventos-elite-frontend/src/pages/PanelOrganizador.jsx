import { useEffect, useState, useCallback } from "react";
import {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  cancelarEvento,
  finalizarEvento,
} from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FORM_VACIO = {
  nombreEvento: "",
  descripcionEvento: "",
  fechaEvento: "",
  capacidadMaxima: "",
  ubicacionEvento: "",
};

export const PanelOrganizador = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);

  const normalizarEventos = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.eventos)) return data.eventos;
    return [];
  };

  // ✅ Una sola definición con useCallback
  const fetchEventos = useCallback(async () => {
    try {
      const res = await getEventos();
      setEventos(normalizarEventos(res));
    } catch (error) {
      console.error(error);
      toast.error("Error cargando eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await actualizarEvento(editandoId, form);
        toast.success("Evento actualizado ✅");
        setEditandoId(null);
      } else {
        await crearEvento(form);
        toast.success("Evento creado ✅");
      }
      setForm(FORM_VACIO);
      fetchEventos();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error guardando evento");
    }
  };

  const handleEditar = (ev) => {
    setEditandoId(ev._id);
    setForm({
      nombreEvento: ev.nombreEvento || "",
      descripcionEvento: ev.descripcionEvento || "",
      fechaEvento: ev.fechaEvento
        ? new Date(ev.fechaEvento).toISOString().split("T")[0]
        : "",
      capacidadMaxima: ev.capacidadMaxima || "",
      ubicacionEvento: ev.ubicacionEvento || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este evento permanentemente?")) return;
    try {
      await eliminarEvento(id);
      toast.success("Evento eliminado");
      fetchEventos();
    } catch (error) {
      toast.error(error.message || "Error eliminando evento");
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm("¿Cancelar evento?")) return;
    try {
      await cancelarEvento(id);
      toast.success("Evento cancelado");
      fetchEventos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFinalizar = async (id) => {
    if (!confirm("¿Finalizar evento?")) return;
    try {
      await finalizarEvento(id);
      toast.success("Evento finalizado");
      fetchEventos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white text-center bg-gray-950 min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🛠 Panel Organizador</h1>

      {/* ===== FORMULARIO ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl mb-8 space-y-4 max-w-lg"
      >
        <h2 className="text-xl font-bold">
          {editandoId ? "✏️ Editar Evento" : "➕ Crear Evento"}
        </h2>

        <input
          placeholder="Nombre del evento *"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.nombreEvento}
          onChange={(e) => setForm({ ...form, nombreEvento: e.target.value })}
          required
        />
        <textarea
          placeholder="Descripción *"
          className="w-full p-2 bg-gray-800 rounded h-20 resize-none"
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
          placeholder="Capacidad máxima *"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.capacidadMaxima}
          onChange={(e) =>
            setForm({ ...form, capacidadMaxima: e.target.value })
          }
          required
          min="1"
        />
        <input
          placeholder="Ubicación *"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.ubicacionEvento}
          onChange={(e) =>
            setForm({ ...form, ubicacionEvento: e.target.value })
          }
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded flex-1 font-semibold"
          >
            {editandoId ? "Actualizar" : "Crear Evento"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={handleCancelarEdicion}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* ===== LISTA DE EVENTOS ===== */}
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
              className="bg-gray-900 p-4 rounded-xl flex items-start justify-between gap-4"
            >
              {/* INFO DEL EVENTO */}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{ev.nombreEvento}</h3>
                <p className="text-gray-400 text-sm">{ev.descripcionEvento}</p>
                <p className="text-gray-500 text-xs mt-1">
                  📅 {new Date(ev.fechaEvento).toLocaleDateString("es-CO")} —{" "}
                  📍 {ev.ubicacionEvento} — 👥 Cupo: {ev.capacidadMaxima} —{" "}
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

              {/* ✅ BOTONES DE ACCIÓN */}
              <div className="flex gap-2 flex-wrap justify-end">

                {/* 👥 VER INSCRITOS ← AQUÍ */}
                <Link
                  to={`/eventos/${ev._id}/inscritos`}
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                >
                  👥 Inscritos
                </Link>

                {/* ✏️ EDITAR */}
                <button
                  onClick={() => handleEditar(ev)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
                >
                  Editar
                </button>

                {/* Solo si está activo */}
                {ev.estadoEvento === "activo" && (
                  <>
                    {/* 🚫 CANCELAR */}
                    <button
                      onClick={() => handleCancelar(ev._id)}
                      className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm"
                    >
                      Cancelar
                    </button>

                    {/* ✅ FINALIZAR */}
                    <button
                      onClick={() => handleFinalizar(ev._id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      Finalizar
                    </button>
                  </>
                )}

                {/* 🗑 ELIMINAR */}
                <button
                  onClick={() => handleEliminar(ev._id)}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Eliminar
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};