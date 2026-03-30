import { useEffect, useState, useCallback } from "react";
import {
  getInscritosPorEvento,
  confirmarInscripcion,
  emitirCertificado,
} from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const InscritosEvento = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInscritos = useCallback(async () => {
    try {
      const res = await getInscritosPorEvento(id);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando inscritos");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInscritos();
  }, [fetchInscritos]);

  const handleConfirmar = async (inscripcionId) => {
    try {
      await confirmarInscripcion(inscripcionId);
      toast.success("Inscripción confirmada ✅");
      fetchInscritos();
    } catch (error) {
      toast.error(error.message || "Error al confirmar");
    }
  };

  const handleCertificado = async (inscripcionId) => {
    try {
      await emitirCertificado(inscripcionId);
      toast.success("Certificado emitido 🎓");
      fetchInscritos();
    } catch (error) {
      toast.error(error.message || "Error al emitir certificado");
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-600";
      case "pendiente":
        return "bg-yellow-600";
      case "cancelada":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="p-10 bg-gray-950 min-h-screen text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen text-white">
        <p>No se encontró el evento</p>
        <button
          onClick={() => nav("/organizador")}
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">👥 Inscritos</h1>
          <h2 className="text-xl text-blue-400 mt-1">{data.evento}</h2>
        </div>
        <button
          onClick={() => nav("/organizador")}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          ← Volver
        </button>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl text-center">
          <p className="text-gray-400 text-sm">Capacidad</p>
          <p className="text-2xl font-bold">{data.capacidadMaxima}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl text-center">
          <p className="text-gray-400 text-sm">Inscritos</p>
          <p className="text-2xl font-bold text-blue-400">
            {data.totalInscritos}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl text-center">
          <p className="text-gray-400 text-sm">Cupo disponible</p>
          <p
            className={`text-2xl font-bold ${
              data.cupoDisponible > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {data.cupoDisponible}
          </p>
        </div>
      </div>

      {/* TABLA DE INSCRITOS */}
      {data.inscritos && data.inscritos.length > 0 ? (
        <div className="overflow-x-auto bg-gray-900 rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-800 text-gray-300 text-sm">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Correo</th>
                <th className="p-4 text-left">Rol</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Certificado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.inscritos.map((insc, index) => (
                <tr
                  key={insc._id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-semibold">
                    {insc.usuario?.nombreUsuario || "—"}
                  </td>
                  <td className="p-4 text-gray-400">
                    {insc.usuario?.correoElectronico || "—"}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-600 px-2 py-1 text-xs rounded">
                      {insc.usuario?.rol || "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getBadgeColor(
                        insc.estadoInscripcion
                      )}`}
                    >
                      {insc.estadoInscripcion}
                    </span>
                  </td>
                  <td className="p-4">
                    {insc.certificadoEmitido ? (
                      <span className="text-green-400 text-sm">🎓 Emitido</span>
                    ) : (
                      <span className="text-gray-500 text-sm">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* Confirmar — solo si está pendiente */}
                      {insc.estadoInscripcion === "pendiente" && (
                        <button
                          onClick={() => handleConfirmar(insc._id)}
                          className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-xs"
                        >
                          Confirmar
                        </button>
                      )}
                      {/* Certificado — solo si está confirmada y no emitido */}
                      {insc.estadoInscripcion === "confirmada" &&
                        !insc.certificadoEmitido && (
                          <button
                            onClick={() => handleCertificado(insc._id)}
                            className="bg-purple-500 hover:bg-purple-600 px-2 py-1 rounded text-xs"
                          >
                            🎓 Certificado
                          </button>
                        )}
                      {insc.estadoInscripcion === "cancelada" && (
                        <span className="text-gray-500 text-xs">Cancelada</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No hay inscritos en este evento.</p>
      )}
    </div>
  );
};