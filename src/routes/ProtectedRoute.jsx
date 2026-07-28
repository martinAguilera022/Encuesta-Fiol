
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/auth";
import Loading from "../components/Loading";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  // Firebase todavía está comprobando la sesión
  if (user === undefined) {
    return <Loading />;
  }

  // Usuario no autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado
  return children;
}

export default ProtectedRoute;

