import { useEffect, useState } from "react";
import { getEventos, inscribirse } from "../services/api";
import { SkeletonCard } from "../components/SkeletonCard";
import toast from "react-hot-toast";

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = async () => {
    try {
      const data = await getEventos();
      // La API devuelve un array directo
      setEventos(Array.isArray(data) ? data : data.eventos || []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar eventos ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleInscribirse = async (eventoId) => {
    try {
      await inscribirse(eventoId);
      toast.success("Te inscribiste 🎟");
      // ✅ CORREGIDO: refrescar la lista después de inscribirse
      // para actualizar el contador de inscritos y cupo disponible
      await fetchEventos();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al inscribirse");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Eventos disponibles</h1>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          : eventos.map((e) => (
              <div
                key={e._id}
                className="min-w-[250px] bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
              >
                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                  {e.nombreEvento}
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-sm mb-3">
                    {e.descripcionEvento}
                  </p>
                  <button
                    onClick={() => handleInscribirse(e._id)}
                    className="bg-green-500 w-full py-2 rounded hover:bg-green-600 transition"
                  >
                    Inscribirse
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};