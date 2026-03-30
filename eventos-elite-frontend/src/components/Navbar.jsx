import { Link, useNavigate } from "react-router-dom";

export const Navbar = ({ setIsAuth }) => {
  const nav = useNavigate();
  const rol = localStorage.getItem("rol");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setIsAuth(false);
    nav("/login");
  };

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold">Eventos Elite</h1>
      <div className="flex gap-4 items-center">
        <Link to="/eventos">Eventos</Link>

        {/* 👤 PANEL USUARIO */}
        <Link to="/usuario">Mi Panel</Link>

        {/* 🟢 ORGANIZADOR + ADMIN */}
        {(rol === "organizador" || rol === "administrador") && (
          <>
            <Link to="/organizador">Panel Organizador</Link>
            <Link to="/ponentes">Ponentes</Link>
            <Link to="/sesiones">Sesiones</Link>
          </>
        )}

        {/* 🔵 SOLO ADMIN */}
        {rol === "administrador" && (
          <>
            <Link to="/usuarios">Usuarios</Link>
            <Link to="/roles">Roles</Link>
          </>
        )}

        {/* 🔴 LOGOUT */}

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Salir
        </button>
      </div>
    </div>
  );
};
