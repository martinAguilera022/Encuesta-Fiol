import { useNavigate } from "react-router-dom";

import logoFiol from "../assets/LogoFiol.png";
import fondoEmbrague from "../assets/Embrague-fondo.png";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/thanks.css";

function Thanks() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/");
  };
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
  return (
   <main className="thanks-screen">
  <motion.div
    className="thanks-content"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div
      className="thanks-icon"
      variants={itemVariants}
    >

      
      <div className="checkmark"></div>
    </motion.div>

    <motion.h1 variants={itemVariants}>
      ¡Gracias por
      <span>tu tiempo!</span>
    </motion.h1>

    <motion.p variants={itemVariants}>
      Tu opinión nos ayuda a seguir
      <br />
      ofreciendo el mejor servicio y
      <br />
      los mejores productos.
    </motion.p>

    <motion.button
      className="thanks-exit-button"
      onClick={handleExit}
      variants={itemVariants}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      Salir
    </motion.button>
  </motion.div>

  <motion.div
    className="thanks-image"
    initial={{ opacity: 0, x: 80 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7 }}
  >
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
  </motion.div>
</main>
  );
}

export default Thanks;