import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserSecret, FaUser, FaRegClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
} from "../firebase/firestore";

import logoFiol from "../assets/LogoFiol.png";
import fondoEmbrague from "../assets/Embrague-fondo.png";

import BadIcon from "../assets/sad-face.png";
import NeutralIcon from "../assets/neutral-face.png";
import GoodIcon from "../assets/happy-face.png";
import ExcellentIcon from "../assets/happy.png";
import VeryBadIcon from "../assets/angry.png";
import "../styles/survey.css";
const questions = [
  {
    id: "commercialAttention",
    question: "¿Cómo calificarías nuestra Atención comercial?",
    type: "rating",
    required: true,
  },
  {
    id: "deliveryTimes",
    question:
      "¿Qué tan conforme estás con el cumplimiento de plazos de entrega?",
    type: "rating",
    required: true,
  },
  {
    id: "productAvailability",
    question:
      "¿Qué tan conforme estás con la disponibilidad y alternativa de productos?",
    type: "rating",
    required: true,
  },
  {
    id: "technicalAdvice",
    question: "¿Cómo calificarías el Asesoramiento técnico recibido?",
    type: "rating",
    required: true,
  },
  {
    id: "claimsResolution",
    question:
      "¿Cuán conforme estás con relación a la resolución de reclamos?",
    type: "rating",
    required: true,
  },
  {
    id: "overallExperience",
    question:
      "¿Cómo calificarías tu experiencia completa con Embragues Fiol?",
    type: "rating",
    required: true,
  },
  {
    id: "repurchaseProbability",
    question:
      "Pensando en tu próxima compra de repuestos ¿qué tan probable es que vuelvas a elegirnos?",
    type: "rating",
    required: true,
  },
  {
    id: "mostValued",
    question: "¿Qué es lo que más valoras de Embragues Fiol?",
    type: "text",
    required: false,
  },
  {
    id: "improvement",
    question: "¿Hay algo que podamos mejorar?",
    type: "text",
    required: false,
  },
];

const ratingOptions = [
  {
    value: 1,
    icon: VeryBadIcon,
    label: "Muy malo",
  },
 {
    value: 2,
    icon: BadIcon,
    label: "Malo",
  },
  {
    value: 3,
    icon: NeutralIcon,
    label: "Regular",
  },
  {
    value: 4,
    icon: GoodIcon,
    label: "Bueno",
  },
  {
  
  value: 5,
  icon: ExcellentIcon,
  label: "Excelente",

  },
];
const pageVariants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};
function Survey() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(-1);
  const [identityType, setIdentityType] = useState(null);
  const [companyName, setCompanyName] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({
  commercialAttention: null,
  deliveryTimes: null,
  productAvailability: null,
  technicalAdvice: null,
  claimsResolution: null,
  overallExperience: null,
  repurchaseProbability: null,
  mostValued: "",
  improvement: "",
});
const saveSurvey = async () => {
  try {
   await addDoc(collection(db, "surveys"), {
  identityType,

  companyName:
    identityType === "company"
      ? companyName
      : null,

  commercialAttention: answers.commercialAttention,
  deliveryTimes: answers.deliveryTimes,
  productAvailability: answers.productAvailability,
  technicalAdvice: answers.technicalAdvice,
  claimsResolution: answers.claimsResolution,
  overallExperience: answers.overallExperience,
  repurchaseProbability: answers.repurchaseProbability,

  mostValued: answers.mostValued,
  improvement: answers.improvement,

  createdAt: serverTimestamp(),
});
    console.log("Encuesta guardada");
  } catch (error) {
    console.error(error);
  }
};

  const [selectedRating, setSelectedRating] = useState(null);

  const currentQuestion = questions[currentStep];

  const handleStart = () => {
    setCurrentStep(-2);
  };

  const handleIdentitySelection = (type) => {
    setIdentityType(type);
  };

  const handleIdentityContinue = () => {
    if (!identityType) return;

    setCurrentStep(0);
  };

  const handleRatingSelect = (value) => {
    setSelectedRating(value);
  };

  const handleTextChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

const handleNext = async () => {
    if (currentStep === -2) {
      handleIdentityContinue();
      return;
    }

    if (currentQuestion.type === "rating") {
      if (!selectedRating) return;

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedRating,
      }));

      setSelectedRating(null);
    }

    if (currentStep < questions.length - 1) {
  setCurrentStep((prev) => prev + 1);
} else {
 setIsSubmitting(true);

await saveSurvey();

navigate("/gracias");
}
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setSelectedRating(null);
    } else if (currentStep === 0) {
      setCurrentStep(-2);
    }
  };
if (isSubmitting) {
  return (
    <main className="survey-screen">
      <div className="loading-screen">
        <img
          src={logoFiol}
          alt="Embragues Fiol"
          className="loading-logo"
        />

        <div className="loading-spinner" />

        <h2>Enviando respuestas...</h2>

        <p>
          Estamos guardando tu encuesta.
          <br />
          Esto tomará solo unos segundos.
        </p>
      </div>
    </main>
  );
}
  if (currentStep === -1) {
    return (
     
<main className="survey-screen">
  <AnimatePresence mode="wait">

        <motion.section
            key="welcome"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="survey-welcome"
        >
    <section className="survey-welcome">

        {/* Imagen inferior */}
        <img
            src={fondoEmbrague}
            alt=""
            className="background-clutch"
        />

        {/* Degradado */}
        <div className="background-overlay" />

        <div className="survey-content">

            <img
                src={logoFiol}
                alt="Embragues Fiol"
                className="brand-logo"
                id="brand"
            />

            <div className="survey-header">

                <h1>
                    Tu opinión
                    <span>nos impulsa</span>
                </h1>

                <p className="survey-description">
                    Tu opinión nos ayuda a seguir mejorando cada día para
                    brindarte el mejor servicio.
                </p>

            </div>

            <div className="survey-footer">

                <div className="survey-time">
                    <FaRegClock />

                    <span>
                        La encuesta toma menos de
                        <br />
                        <strong>1 minuto.</strong>
                    </span>

                </div>

                <button
                    className="primary-button"
                    onClick={handleStart}
                >
                    Comenzar encuesta.
                </button>

            </div>

        </div>

    </section>
       </motion.section>
    </AnimatePresence>
</main>
    );
  }
if (currentStep === -2) {
  return (
    <main className="survey-screen survey-questions-screen">
      <div className="survey-background-image" />

      <div className="survey-container">
        <SurveyTopBar/>

        <ProgressBar
          current={1}
          total={questions.length}
          currentStep={currentStep}
        />
<AnimatePresence mode="wait">

        <motion.div
            key="identity"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          
        >

        <div className="survey-question-header">
          <h1>
            ¿Cómo te gustaría
            <br />
            responder?
          </h1>

          <p>
            Puedes hacerlo de forma anónima o dejarnos tus datos si deseas que
            podamos contactarte.
          </p>
        </div>

        <div className="identity-options">
          <button
            type="button"
            className={`identity-card ${
              identityType === "anonymous" ? "selected" : ""
            }`}
            onClick={() => handleIdentitySelection("anonymous")}
          >
            <div className="identity-icon">
              <FaUserSecret />
            </div>

            <div className="identity-content">
              <h3>De forma anónima</h3>

              <p>
                Tus respuestas serán confidenciales y no se asociarán a tus
                datos.
              </p>
            </div>
          </button>

          <button
            type="button"
            className={`identity-card ${
              identityType === "company" ? "selected" : ""
            }`}
            onClick={() => handleIdentitySelection("company")}
          >
            <div className="identity-icon">
              <FaUser />
            </div>

            <div className="identity-content">
              <h3>
                Dejando mis datos
                <br />
                (opcional)
              </h3>

              <p>
                Podremos contactarte si es necesario para ayudarte.
              </p>
            </div>
          </button>
        </div>

        {identityType === "company" && (
          <input
            className="company-input"
            type="text"
            placeholder="Nombre de tu empresa o negocio"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
        )}
</motion.div>

</AnimatePresence>
        <SurveyNavigation
          onNext={handleNext}
          showBack={false}
          
           disabled={
    !identityType ||
    (identityType === "company" && companyName.trim() === "")
  }
        />
      </div>
    </main>
  );
}
  return (
    <main className="survey-screen">
      <div className="survey-container">
        <SurveyTopBar />

        <ProgressBar
  current={currentStep + 2}
  total={questions.length }
/>
<AnimatePresence mode="wait">

        <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="survey-container"
        >
        <div className="survey-question-header">
          <h1>{currentQuestion.question}</h1>

          {currentQuestion.type === "rating" && (
            <p>Desde muy mala a hasta exelente.</p>
          )}
          {currentQuestion.type === "text" && (
            <p>Cuéntanos tu experiencia o sugerencias (opcional)</p>
          )}
        </div>

        {currentQuestion.type === "rating" && (
  <div className="rating-wrapper">
    <div className="rating-options">
      {ratingOptions.map((option) => (
        <button
          key={option.value}
          className={`rating-option ${
            selectedRating === option.value ? "selected" : ""
          }`}
          onClick={() => handleRatingSelect(option.value)}
        >
          {option.icon ? (
  <img
    src={option.icon}
    alt={option.label}
    className="rating-icon"
  />
) : (
  <span className="rating-emoji">{option.emoji}</span>
)}
        </button>
      ))}
    </div>

    <div className="rating-scale">
      <span>Muy mala</span>
      <span>Excelente</span>
    </div>
  </div>
)}

        {currentQuestion.type === "text" && (
          <div className="textarea-wrapper">
            <textarea
              value={answers[currentQuestion.id]}
              onChange={(event) => handleTextChange(event.target.value)}
              placeholder="Escribí tu respuesta..."
              maxLength={500}
            />

            <span>
              {answers[currentQuestion.id].length}/500
            </span>
          </div>
        )}

    <SurveyNavigation
  onNext={handleNext}
  onBack={handleBack}
  showBack={true}
  disabled={
    currentQuestion.required &&
    (
      currentQuestion.type === "rating"
        ? !selectedRating
        : !answers[currentQuestion.id].trim()
    )
  }
/>
    </motion.div>
</AnimatePresence>
      </div>
  
    
    </main>
  );
}

function SurveyTopBar() {
  return (
    <div >
       <img
                src={logoFiol}
                alt="Embragues Fiol"
                className="brand-logo"
                id="brand"
            />
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="progress-wrapper">
      <div className="progress-segments">
        {Array.from({ length: total + 1 }).map((_, index) => (
          <div
            key={index}
            className={`progress-segment ${
              index +1 < current ? "active" : ""
            }`}
          />
        ))}
      </div>

     <span className="progress-number">
  <span className="current-number">{current-1}</span>
  /{total + 1}
</span>
    </div>
  );
}

function SurveyNavigation({
  onNext,
  onBack,
  showBack = true,
  disabled = false,
}) {
  return (
    <div className="survey-navigation">
      {showBack ? (
        <button className="secondary-button" onClick={onBack}>
          Atrás
        </button>
      ) : (
        <div />
      )}

      <button
        className="primary-button"
        onClick={onNext}
        disabled={disabled}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Survey;