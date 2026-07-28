import { useNavigate } from "react-router-dom";

import logoFiol from "../assets/Logofiol.png";
import fondoEmbrague from "../assets/Embrague-fondo.png";

import "../styles/thanks.css";

function Thanks() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/");
  };

  return (
    <main className="thanks-screen">

      {/* CONTENIDO */}
      <div className="thanks-content">

        <div className="thanks-icon">
          <div className="checkmark"></div>
        </div>

        <h1>
          ¡Gracias por
          <span>tu tiempo!</span>
        </h1>

        <p>
          Tu opinión nos ayuda a seguir
          <br />
          ofreciendo el mejor servicio y
          <br />
          los mejores productos.
        </p>

        <button
          className="thanks-exit-button"
          onClick={handleExit}
        >
          Salir
        </button>

      </div>

      {/* IMAGEN */}
      <div className="thanks-image">

        <img
          src={fondoEmbrague}
          alt=""
        />

        <div className="thanks-overlay"></div>

        <div className="thanks-logo">
          <img
            src={logoFiol}
            alt="Embragues Fiol"
          />
        </div>

      </div>

    </main>
  );
}

export default Thanks;