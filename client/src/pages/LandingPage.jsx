import NavBar from '../components/NavBar';

function LandingPage() {
  return (
    <div>
      <h1>ControlaCRM!</h1>
      <NavBar />
      <section>
        <h1>CRM & Gestor de Inventarios</h1>
        <p>
          Administra clientes, productos y órdenes desde una sola plataforma
          pensada para pequeñas y medianas empresas.
        </p>
        <div>
          <a href="/register">
            <button>Comenzar</button>
          </a>
          <a href="/login">Iniciar sesión</a>
        </div>
      </section>
      <section>
        <h2>Características principales</h2>
        <ul>
          <li>
            <strong>Gestión de Clientes:</strong> registra y administra tus
            contactos.
          </li>
          <li>
            <strong>Inventario de Productos:</strong> controla stock, categorías
            y precios.
          </li>
          <li>
            <strong>Gestión de Órdenes:</strong> crea, edita y controla pedidos.
          </li>
          <li>
            <strong>Dashboard básico:</strong> visualiza datos importantes del
            negocio.
          </li>
        </ul>
      </section>
      <section>
        <h2>Empieza hoy mismo</h2>
        <p>Regístrate y comienza a gestionar tu negocio en minutos.</p>
        <a href="/register">
          <button>Crear cuenta</button>
        </a>
      </section>
      <footer>
        <p>© {new Date().getFullYear()} CRM & Inventarios MVP</p>
      </footer>
    </div>
  );
}

export default LandingPage;
