import { useEffect, useState, useCallback } from "react";
import { getEventos, getEventosDisponibles, inscribirse } from "../services/api";
import { SkeletonCard } from "../components/SkeletonCard";
import toast from "react-hot-toast";

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [soloDisponibles, setSoloDisponibles] = useState(false); // ← NUEVO

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (soloDisponibles) {
        // ← Consume /eventos/disponibles
        const res = await getEventosDisponibles();
        data = res.eventos || [];
      } else {
        data = await getEventos();
        data = Array.isArray(data) ? data : data.eventos || [];
      }
      setEventos(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }, [soloDisponibles]); // ← depende de soloDisponibles

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleInscribirse = async (eventoId) => {
    try {
      await inscribirse(eventoId);
      toast.success("Te inscribiste 🎟");
      fetchEventos();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al inscribirse");
    }
  };

  const eventosFiltrados = eventos.filter((e) => {
    const coincideBusqueda =
      e.nombreEvento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcionEvento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.ubicacionEvento?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" || e.estadoEvento === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case "activo":    return "bg-green-600";
      case "cancelado": return "bg-red-600";
      case "finalizado": return "bg-gray-600";
      default:          return "bg-gray-600";
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Eventos</h1>

      {/* ================================ */}
      {/* FILTROS ← AQUÍ VAN LOS 3 FILTROS */}
      {/* ================================ */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">

        {/* 1 — Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre, descripción o ubicación..."
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* 2 — Filtro por estado */}
        <select
          className="p-2 rounded bg-gray-800 text-white"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="cancelado">Cancelados</option>
          <option value="finalizado">Finalizados</option>
        </select>

        {/* 3 — Botón solo con cupo ← NUEVO */}
        <button
          onClick={() => setSoloDisponibles(!soloDisponibles)}
          className={`px-4 py-2 rounded text-sm font-semibold transition whitespace-nowrap ${
            soloDisponibles
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {soloDisponibles ? "✅ Con cupo" : "🔍 Solo con cupo"}
        </button>

      </div>
      {/* ================================ */}
      {/* FIN FILTROS                      */}
      {/* ================================ */}

      {/* CONTADOR */}
      {!loading && (
        <p className="text-gray-400 text-sm mb-4">
          {eventosFiltrados.length} evento(s) encontrado(s)
          {soloDisponibles && (
            <span className="text-green-400 ml-2">— mostrando solo con cupo disponible</span>
          )}
        </p>
      )}

      {/* LISTA */}
      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array(5).fill(0).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No hay eventos disponibles</p>
          <p className="text-gray-600 text-sm mt-2">
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((e) => (
            <div
              key={e._id}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              {/* BANNER */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
                <h2 className="font-bold text-center text-lg leading-tight">
                  {e.nombreEvento}
                </h2>
              </div>

              <div className="p-4">
                {/* DESCRIPCIÓN */}
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {e.descripcionEvento}
                </p>

                {/* DETALLES */}
                <div className="space-y-1 mb-4">
                  <p className="text-gray-500 text-xs">
                    📅 {new Date(e.fechaEvento).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {e.ubicacionEvento && (
                    <p className="text-gray-500 text-xs">📍 {e.ubicacionEvento}</p>
                  )}
                  {e.capacidadMaxima && (
                    <p className="text-gray-500 text-xs">
                      👥 Capacidad: {e.capacidadMaxima} personas
                    </p>
                  )}
                  {/* Muestra cupo disponible si viene de /disponibles */}
                  {e.cupoDisponible !== undefined && (
                    <p className={`text-xs font-semibold ${
                      e.cupoDisponible > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      🟢 Cupo disponible: {e.cupoDisponible}
                    </p>
                  )}
                </div>

                {/* ESTADO */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 py-1 text-xs rounded ${getBadgeEstado(e.estadoEvento)}`}>
                    {e.estadoEvento}
                  </span>
                </div>

                {/* BOTÓN INSCRIBIRSE */}
                {e.estadoEvento === "activo" ? (
                  <button
                    onClick={() => handleInscribirse(e._id)}
                    className="bg-green-500 w-full py-2 rounded hover:bg-green-600 transition font-semibold"
                  >
                    Inscribirse 🎟
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-700 w-full py-2 rounded text-gray-500 cursor-not-allowed"
                  >
                    {e.estadoEvento === "cancelado"
                      ? "Evento cancelado"
                      : "Evento finalizado"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};