
import { NavLink, useNavigate } from "react-router-dom";
import logoFiol from "../assets/LogoFiol.png";
import { logout } from "../firebase/auth";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Intentando cerrar sesión...");

      await logout();

      console.log("Sesión cerrada correctamente");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className="sidebar">
      <img
        src={logoFiol}
        alt="Embragues Fiol"
        className="brand-logo"
      />

      <nav>
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/dashboard/respuestas"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Respuestas
        </NavLink>

        <NavLink
          to="/dashboard/comentarios"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Comentarios
        </NavLink>
      </nav>

      <button onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </aside>
  );
}

export default Sidebar;
