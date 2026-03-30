import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-5">
        <h1 className="text-2xl font-bold tracking-wide">Eventos Elite</h1>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/eventos"
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Ver eventos
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Vive experiencias únicas <br />
          en eventos increíbles 🎉
        </h2>
        <p className="text-gray-400 max-w-xl mb-8">
          Descubre, crea y participa en eventos de tecnología, networking y
          aprendizaje. Todo en un solo lugar.
        </p>
        <div className="flex gap-4">
          <Link
            to="/eventos"
            className="bg-green-500 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-600 transition"
          >
            Explorar eventos
          </Link>
        
          <Link
            to="/register"
            className="bg-gray-800 px-6 py-3 rounded-xl text-lg hover:bg-gray-700 transition"
          >
            Comenzar ahora
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-10 py-16">
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">📅 Gestión de eventos</h3>
          <p className="text-gray-400">
            Crea y administra eventos fácilmente con herramientas intuitivas.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">🎟 Inscripciones rápidas</h3>
          <p className="text-gray-400">
            Regístrate en segundos y asegura tu lugar en cualquier evento.
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">📊 Panel personalizado</h3>
          <p className="text-gray-400">
            Consulta tus eventos, inscripciones y actividad en tiempo real.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-4xl font-bold mb-4">
          ¿Listo para tu próximo evento?
        </h2>
        <p className="mb-6 text-gray-200">
          Únete ahora y comienza a vivir la experiencia
        </p>
        
        <Link
          to="/register"
          className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Crear cuenta
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2026 Eventos Elite - Todos los derechos reservados
      </footer>
    </div>
  );
};