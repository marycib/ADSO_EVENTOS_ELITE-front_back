import { useEffect, useState } from "react";
import { misInscripciones, cancelarInscripcion } from "../services/api";

export const PanelUsuario = () => {
  const [data, setData] = useState([]);
  const [vista, setVista] = useState("eventos"); // 👈 control de vista

  const rol = localStorage.getItem("rol");

  useEffect(() => {
    misInscripciones()
      .then((res) => setData(res.inscripciones || []))
      .catch(console.error);
  }, []);

  return (
    <div className="flex bg-gray-950 text-white min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 p-6">
        <h2 className="text-xl font-bold mb-6">Mi Panel</h2>

        <ul className="space-y-4">
          <li
            onClick={() => setVista("eventos")}
            className="hover:text-blue-400 cursor-pointer"
          >
            📅 Mis eventos
          </li>

          <li
            onClick={() => setVista("perfil")}
            className="hover:text-blue-400 cursor-pointer"
          >
            👤 Perfil
          </li>

          <li
            className="hover:text-red-400 cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("rol");
              window.location.href = "/login";
            }}
          >
            🚪 Cerrar sesión
          </li>
        </ul>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        {/* 🔹 VISTA EVENTOS */}
        {vista === "eventos" && (
          <>
            <h1 className="text-3xl font-bold mb-6">
              🎟 Mis inscripciones
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              {data.length > 0 ? (
                data.map((i) => (
                  <div
                    key={i._id}
                    className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-xl transition"
                  >
                    <h3 className="text-xl font-bold">
                      {i.evento?.nombreEvento}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {i.evento?.descripcionEvento}
                    </p>

                    <button
                      onClick={() => cancelarInscripcion(i._id)}
                      className="bg-red-500 mt-4 px-4 py-2 rounded hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No tienes inscripciones aún</p>
              )}
            </div>
          </>
        )}

        {/* 🔹 VISTA PERFIL */}
        {vista === "perfil" && (
          <div className="bg-gray-900 p-6 rounded-xl max-w-md shadow">
            <h1 className="text-2xl font-bold mb-4">👤 Mi Perfil</h1>

            <p className="text-gray-400 mb-2">
              Rol:
            </p>

            {/* 🎨 BADGE DINÁMICO */}
            <span
              className={`
                px-3 py-1 rounded-full text-sm font-semibold
                ${rol === "administrador" && "bg-red-500"}
                ${rol === "organizador" && "bg-green-500"}
                ${rol === "asistente" && "bg-blue-500"}
              `}
            >
              {rol || "sin rol"}
            </span>
          </div>
        )}

      </main>
    </div>
  );
};