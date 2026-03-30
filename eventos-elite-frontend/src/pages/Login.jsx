import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";



export const Login = ({ setIsAuth }) => {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login({
        correoElectronico: correo,
        contrasena: pass,
      });

      // 🔐 Guardar token
      localStorage.setItem("token", res.token);

      // 🔍 Decodificar token para obtener el rol de forma segura
      const decoded = jwtDecode(res.token);

      // 🧠 Prioridad: objeto usuario en respuesta > payload del token
      const rol = (
        res.usuario?.rol ||
        decoded.rol       ||
        decoded.role      ||
        "asistente"
      ).toLowerCase();

      const nombreUsuario = res.usuario?.nombreUsuario || decoded.nombreUsuario || "";

      localStorage.setItem("rol", rol);
      localStorage.setItem("nombreUsuario", nombreUsuario);

      // actualice su estado en un solo paso, sin useEffect ni setState en cascada.
      setIsAuth(true, { token: res.token, rol, nombreUsuario });

      toast.success("Login exitoso 🎉");
      nav("/eventos");
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
       
        <div className="mb-4">
        <Link
          to="/"
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition"
        >
          ← Volver al inicio
        </Link>
      </div>
       
        <h2 className="text-3xl font-bold text-white mb-2 text-center">

          Bienvenido 👋
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Ingresa a tu cuenta para continuar
        </p>

        <form onSubmit={handle}>
          <div className="mb-4">
            <label className="text-gray-400 text-sm">Correo</label>
            <input
              type="email"
              required
              placeholder="ejemplo@email.com"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm">Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-lg font-semibold mt-2"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => nav("/register")}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};