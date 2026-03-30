import { useEffect, useState } from "react";
import {
  crearUsuario,
  getUsuarioById,
  actualizarUsuario,
} from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export const UsuarioForm = () => {
  const [form, setForm] = useState({
    nombreUsuario: "",
    correoElectronico: "",
    contrasena: "",
    rol: "asistente",
  });

  const nav = useNavigate();
  const { id } = useParams();

  // 🔹 Cargar usuario si es edición
  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        try {
          const data = await getUsuarioById(id);

          setForm({
            nombreUsuario: data.nombreUsuario || "",
            correoElectronico: data.correoElectronico || "",
            rol: data.rol || "asistente",
            contrasena: "", // 👈 nunca traer contraseña
          });
        } catch (error) {
          console.error(error);
          toast.error("Error cargando usuario");
        }
      };

      fetchUsuario();
    }
  }, [id]);

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Validación básica frontend
    if (!form.nombreUsuario || !form.correoElectronico) {
      return toast.error("Nombre y correo son obligatorios");
    }

    if (!id && !form.contrasena) {
      return toast.error("La contraseña es obligatoria");
    }

    try {
      console.log("ENVIANDO:", form); // 👈 debug

      if (id) {
        // 👇 no enviar contraseña vacía al editar
        const dataToSend = { ...form };
        if (!dataToSend.contrasena) {
          delete dataToSend.contrasena;
        }

        await actualizarUsuario(id, dataToSend);
        toast.success("Usuario actualizado");
      } else {
        await crearUsuario(form);
        toast.success("Usuario creado");
      }

      nav("/usuarios");
    } catch (error) {
      console.error("Error al procesar:", error);
      toast.error(error.message || "Error inesperado");
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h2 className="text-2xl mb-4">
        {id ? "Editar Usuario" : "Crear Usuario"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        
        {/* Nombre */}
        <input
          placeholder="Nombre"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.nombreUsuario}
          onChange={(e) =>
            setForm({ ...form, nombreUsuario: e.target.value })
          }
        />

        {/* Correo */}
        <input
          placeholder="Correo"
          className="w-full p-2 bg-gray-800 rounded"
          value={form.correoElectronico}
          onChange={(e) =>
            setForm({ ...form, correoElectronico: e.target.value })
          }
        />

        {/* Rol */}
        <select
          className="w-full p-2 bg-gray-800 rounded"
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
        >
          <option value="asistente">Asistente</option>
          <option value="organizador">Organizador</option>
          <option value="ponente">Ponente</option>
          <option value="administrador">Administrador</option>
        </select>

        {/* Contraseña solo al crear */}
        {!id && (
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 bg-gray-800 rounded"
            value={form.contrasena}
            onChange={(e) =>
              setForm({ ...form, contrasena: e.target.value })
            }
          />
        )}

        <button className="bg-blue-500 px-4 py-2 rounded w-full">
          Guardar
        </button>
      </form>
    </div>
  );
};