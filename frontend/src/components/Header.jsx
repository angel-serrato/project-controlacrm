import { Link } from "react-router"

const Header = () => {
  return (
    <header>
      <h1>ControlaCRM</h1>
      <nav>
        <Link to="/login">Iniciar Sesión</Link>
        <Link to="/register">Crear Cuenta</Link>
      </nav>
    </header>
  );
};

export default Header;
