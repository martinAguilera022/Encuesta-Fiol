import "../styles/login.css";
import { loginWithGoogle, logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

import logoFiol from "../assets/LogoFiol.png";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const email = result.user.email;

      const snapshot = await getDocs(collection(db, "admins"));
      const admins = snapshot.docs.map((doc) => doc.data().email);

      if (!admins.includes(email)) {
        await logout();

        alert("No tienes permisos para acceder.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al iniciar sesión.");
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">
             <img
                          src={logoFiol}
                          alt="Embragues Fiol"
                          className="brand-logo"
                      />
        </div>

        <div className="login-content">
          <h1>Bienvenido</h1>

          <p>
            Inicia sesión para acceder al panel de administración.
          </p>

          <button className="google-button" onClick={handleLogin}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 10.023H12v3.955h5.64c-.243 1.273-.973 2.352-2.07 3.073v2.51h3.34c1.955-1.8 3.085-4.45 3.085-7.62 0-.68-.062-1.34-.19-1.918Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.79 0 5.13-.925 6.84-2.51l-3.34-2.51c-.925.62-2.105.99-3.5.99-2.69 0-4.97-1.82-5.785-4.26H2.765v2.59A10.34 10.34 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M6.215 13.71A6.22 6.22 0 0 1 5.89 12c0-.592.108-1.167.325-1.71V7.7H2.765A10.002 10.002 0 0 0 1.7 12c0 1.617.388 3.145 1.065 4.3l3.45-2.59Z"
                fill="#FBBC05"
              />
              <path
                d="M12 6.03c1.52 0 2.885.522 3.96 1.548l2.97-2.97C17.125 2.925 14.79 2 12 2a10.34 10.34 0 0 0-9.235 5.7l3.45 2.59C7.03 7.85 9.31 6.03 12 6.03Z"
                fill="#EA4335"
              />
            </svg>

            <span>Continuar con Google</span>
          </button>
        </div>

        <div className="login-footer">
          <span>Panel de administración</span>
          <span>•</span>
          <span>Embragues Fiol</span>
        </div>
      </div>
    </main>
  );
}

export default Login;

