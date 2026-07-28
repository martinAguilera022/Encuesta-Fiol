import "../styles/Notfound.css";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <h1>Página no encontrada</h1>

        <p>
          La página que estás buscando no existe o fue movida.
        </p>

        <button onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
}

export default NotFound;

