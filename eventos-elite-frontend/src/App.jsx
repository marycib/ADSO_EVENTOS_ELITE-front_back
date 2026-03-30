import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Eventos } from "./pages/Eventos";
import { PanelUsuario } from "./pages/PanelUsuario";
import { PanelOrganizador } from "./pages/PanelOrganizador";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Usuarios } from "./pages/Usuarios";
import { UsuarioForm } from "./pages/UsuarioForm";
import { UsuarioDetalle } from "./pages/UsuarioDetalle";
import { NoAutorizado } from "./pages/NoAutorizado";
import { NotFound } from "./pages/NotFound";
import { Roles } from "./pages/Roles";
import { RolForm } from "./pages/RolForm";
import { Ponentes } from "./pages/Ponentes";
import { PonenteForm } from "./pages/PonenteForm";
import { Sesiones } from "./pages/Sesiones";
import { SesionForm } from "./pages/SesionForm";
import { InscritosEvento } from "./pages/InscritosEvento";


export default function App() {
  // ✅ El estado guarda el usuario completo (id, nombre, rol), no solo isAuth.
  // Esto evita tener dos estados separados (isAuth + rol) que se pueden
  // desincronizar, y elimina la necesidad de un useEffect para sincronizarlos.
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    const rol   = localStorage.getItem("rol");
    const nombre = localStorage.getItem("nombreUsuario");
    if (token && rol) return { token, rol, nombreUsuario: nombre || "" };
    return null;
  });

  const isAuth = !!usuario;
  const rol    = usuario?.rol || "";

  // Login: recibe el objeto usuario que devuelve el backend
  const handleSetIsAuth = (value, datosUsuario) => {
    if (value && datosUsuario) {
      setUsuario(datosUsuario);
      // Login.jsx ya guarda token y rol en localStorage antes de llamar esto
    } else {
      setUsuario(null);
    }
  };

  return (
    <BrowserRouter>
      {isAuth && <Navbar setIsAuth={handleSetIsAuth} />}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/eventos" />
            ) : (
              <Login setIsAuth={handleSetIsAuth} />
            )
          }
        />

        <Route
          path="/register"
          element={isAuth ? <Navigate to="/eventos" /> : <Register />}
        />

        <Route
          path="/eventos"
          element={isAuth ? <Eventos /> : <Navigate to="/login" />}
        />

        <Route
          path="/usuario"
          element={isAuth ? <PanelUsuario /> : <Navigate to="/login" />}
        />

        {/* 🔥 ORGANIZADOR + ADMIN */}
        <Route
          path="/organizador"
          element={
            isAuth ? (
              ["organizador", "administrador"].includes(rol) ? (
                <PanelOrganizador />
              ) : (
                <Navigate to="/no-autorizado" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔥 SOLO ADMIN */}
        <Route
          path="/usuarios"
          element={
            isAuth ? (
              rol === "administrador" ? (
                <Usuarios />
              ) : (
                <Navigate to="/no-autorizado" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* 🎤 PONENTES - organizador y admin */}
<Route
  path="/ponentes"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <Ponentes />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/ponentes/crear"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <PonenteForm />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/ponentes/editar/:id"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <PonenteForm />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>

{/* 🗓 SESIONES - organizador y admin */}
<Route
  path="/sesiones"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <Sesiones />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/sesiones/crear"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <SesionForm />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/sesiones/editar/:id"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <SesionForm />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>

{/* 👥 INSCRITOS POR EVENTO */}
<Route
  path="/eventos/:id/inscritos"
  element={
    isAuth ? (
      ["organizador", "administrador"].includes(rol) ? (
        <InscritosEvento />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>


        <Route
  path="/roles"
  element={
    isAuth ? (
      rol === "administrador" ? (
        <Roles />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/roles/crear"
  element={
    isAuth ? (
      rol === "administrador" ? (
        <RolForm />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/roles/editar/:id"
  element={
    isAuth ? (
      rol === "administrador" ? (
        <RolForm />
      ) : (
        <Navigate to="/no-autorizado" />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>

        <Route
          path="/usuarios/crear"
          element={
            isAuth ? (
              rol === "administrador" ? (
                <UsuarioForm />
              ) : (
                <Navigate to="/no-autorizado" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/usuarios/editar/:id"
          element={
            isAuth ? (
              rol === "administrador" ? (
                <UsuarioForm />
              ) : (
                <Navigate to="/no-autorizado" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/usuarios/:id"
          element={
            isAuth ? (
              rol === "administrador" ? (
                <UsuarioDetalle />
              ) : (
                <Navigate to="/no-autorizado" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/no-autorizado" element={<NoAutorizado />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}