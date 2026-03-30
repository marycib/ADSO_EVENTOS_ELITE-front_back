import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 VALIDACIONES
    if (!form.nombre || !form.correo || !form.password) {
      return setError("Todos los campos son obligatorios");
    }

    if (form.password.length < 6) {
      return setError("La contraseña debe tener mínimo 6 caracteres");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      setLoading(true);

      const res = await register({
      nombre: form.nombre,
      correoElectronico: form.correo,
      contrasena: form.password,
    });


    toast.success(res.mensaje || "Usuario creado correctamente 🎉");

      nav("/login");
    } catch (err) {
       toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">

      <div className="bg-gray-900/80 p-8 rounded-2xl shadow-xl w-96 border border-gray-700">

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Crear cuenta 🚀
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Regístrate para comenzar
        </p>

        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handle}>
          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 text-white"
            placeholder="Nombre"
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 text-white"
            placeholder="Correo"
            type="email"
            onChange={(e) =>
              setForm({ ...form, correo: e.target.value })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 text-white"
            placeholder="Contraseña"
            type="password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 text-white"
            placeholder="Confirmar contraseña"
            type="password"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button
            className="w-full bg-green-500 py-3 rounded mt-2 hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Creando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => nav("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};