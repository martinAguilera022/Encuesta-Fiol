import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";

import logoFiol from "../assets/LogoFiol.png";
import { logout } from "../firebase/auth";

const navItems = [
  {
    to: "/dashboard",
    label: "Resumen",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/dashboard/respuestas",
    label: "Respuestas",
    icon: ClipboardList,
  },
  {
    to: "/dashboard/comentarios",
    label: "Comentarios",
    icon: MessageCircle,
  },
];

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} />
      </button>

      <div
        className={`sidebar-backdrop ${isOpen ? "visible" : ""}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <img src={logoFiol} alt="Embragues Fiol" className="brand-logo" />
          <button
            type="button"
            className="sidebar-close"
            aria-label="Cerrar menú"
            onClick={() => setIsOpen(false)}
          >
            <X size={21} />
          </button>
        </div>

        <nav aria-label="Navegación del dashboard">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon size={21} strokeWidth={1.9} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut size={21} aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </aside>
    </>
  );
}

export default SideBar;