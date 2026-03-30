import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-yellow-500">
        404 - Página no encontrada
      </h1>

      <p className="text-gray-400 mb-6">
        La página que buscas no existe
      </p>

      <button
        onClick={() => nav("/")}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Ir al inicio
      </button>
    </div>
  );
};