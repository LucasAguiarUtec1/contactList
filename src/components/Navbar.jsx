import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {

	const location = useLocation();

	return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Mi lista de contactos</span>
        </Link>
        <div className="ml-auto">
          {location.pathname !== "/addContact" && (
            <Link to="/addContact">
              <button className="btn btn-light button me-5">Añadir contacto</button>
            </Link>
          )}
          {(location.pathname !== "/" && location.pathname !== "/home") && (
            <Link to="/">
              <button className="btn btn-light button">Ver Contactos</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};