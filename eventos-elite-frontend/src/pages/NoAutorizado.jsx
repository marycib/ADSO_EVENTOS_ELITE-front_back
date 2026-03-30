import { useNavigate } from "react-router-dom";

export const NoAutorizado = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500">
        403 - No autorizado
      </h1>

      <p className="text-gray-400 mb-6">
        No tienes permisos para acceder a esta página
      </p>

      <button
        onClick={() => nav("/")}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Volver al inicio
      </button>
    </div>
  );
};