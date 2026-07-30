import { useEffect, useState } from "react";

import "../styles/dashboard.css";
import Loading from "../components/Loading";
import SideBar from "../components/SideBar";

import VeryBadIcon from "../assets/angry.png";
import BadIcon from "../assets/sad-face.png";
import NeutralIcon from "../assets/neutral-face.png";
import GoodIcon from "../assets/happy-face.png";
import ExcellentIcon from "../assets/happy.png";
import {
  ClipboardList,
  UserCheck,
  UserRound,
} from "lucide-react";
import {
  db,
  collection,
  getDocs,
} from "../firebase/firestore";



// ==================================================
// ÍCONOS SEGÚN VALORACIÓN
// ==================================================

const ratingIcons = {
  1: VeryBadIcon,
  2: BadIcon,
  3: NeutralIcon,
  4: GoodIcon,
  5: ExcellentIcon,
};


// ==================================================
// PREGUNTAS DE LA ENCUESTA
// ==================================================

const ratingQuestions = [
  {
    field: "commercialAttention",
    name: "Atención comercial",
  },
  {
    field: "deliveryTimes",
    name: "Cumplimiento de plazos de entrega",
  },
  {
    field: "productAvailability",
    name: "Disponibilidad y alternativa de productos",
  },
  {
    field: "technicalAdvice",
    name: "Asesoramiento técnico",
  },
  {
    field: "claimsResolution",
    name: "Resolución de reclamos",
  },
  {
    field: "repurchaseProbability",
    name: "Probabilidad de volver a elegirnos",
  },
  {
    field: "overallExperience",
    name: "Experiencia completa con Embragues Fiol",
  }
  
];


// ==================================================
// COLOR SEGÚN PROMEDIO
// ==================================================

const getRatingColor = (value) => {

  if (value < 2) {
    return "very-bad";
  }

  if (value < 3) {
    return "bad";
  }

  if (value < 4) {
    return "regular";
  }

  if (value < 5) {
    return "good";
  }

  return "excellent";

};


// ==================================================
// ÍCONO SEGÚN PROMEDIO
// ==================================================

const getRatingIcon = (value) => {

  if (value < 2) {
    return ratingIcons[1];
  }

  if (value < 3) {
    return ratingIcons[2];
  }

  if (value < 4) {
    return ratingIcons[3];
  }

  if (value < 5) {
    return ratingIcons[4];
  }

  return ratingIcons[5];

};


// ==================================================
// DISTRIBUCIÓN DE VALORACIONES
// ==================================================

const getRatingDistribution = (responses) => {

  const distribution = {
    excellent: 0,
    good: 0,
    regular: 0,
    bad: 0,
    veryBad: 0,
  };


  let totalRatings = 0;


  responses.forEach((response) => {

    ratingQuestions.forEach(({ field }) => {

      const rating = response[field];


      if (!rating) {
        return;
      }


      totalRatings++;


      if (rating === 5) {
        distribution.excellent++;
      }

      else if (rating === 4) {
        distribution.good++;
      }

      else if (rating === 3) {
        distribution.regular++;
      }

      else if (rating === 2) {
        distribution.bad++;
      }

      else if (rating === 1) {
        distribution.veryBad++;
      }

    });

  });


  if (totalRatings === 0) {

    return {
      excellent: 0,
      good: 0,
      regular: 0,
      bad: 0,
      veryBad: 0,
    };

  }


  return {

    excellent:
      (distribution.excellent / totalRatings) * 100,

    good:
      (distribution.good / totalRatings) * 100,

    regular:
      (distribution.regular / totalRatings) * 100,

    bad:
      (distribution.bad / totalRatings) * 100,

    veryBad:
      (distribution.veryBad / totalRatings) * 100,

  };

};


// ==================================================
// DASHBOARD
// ==================================================

function Dashboard() {


  // ==================================================
  // ESTADOS
  // ==================================================

  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==================================================
  // OBTENER DATOS DE FIREBASE
  // ==================================================

  useEffect(() => {

    const getResponses = async () => {

      try {

        const responsesRef = collection(
          db,
          "surveys"
        );


        const snapshot = await getDocs(
          responsesRef
        );


        const data = snapshot.docs.map(
          (doc) => ({

            id: doc.id,

            ...doc.data(),

          })
        );


        setResponses(data);


      } catch (error) {

        console.error(
          "Error obteniendo respuestas:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    getResponses();

  }, []);


  // ==================================================
  // ESTADÍSTICAS
  // ==================================================

  const totalResponses =
    responses.length;


  const identifiedResponses =
    responses.filter(
      (response) =>
        response.identityType === "company"
    ).length;


  const anonymousResponses =
    responses.filter(
      (response) =>
        response.identityType === "anonymous"
    ).length;


  // ==================================================
  // DISTRIBUCIÓN
  // ==================================================

  const distribution =
    getRatingDistribution(
      responses
    );


  // ==================================================
  // PROMEDIO POR PREGUNTA
  // ==================================================

  const questionsAverage =
    ratingQuestions.map(
      (question) => {

        const values = responses

          .map(
            (response) =>
              response[question.field]
          )

          .filter(
            (value) =>
              typeof value === "number"
          );


        const average =
          values.length > 0

            ? values.reduce(
                (total, value) =>
                  total + value,
                0
              ) / values.length

            : 0;


        return {

          name: question.name,

          value: Number(
            average.toFixed(1)
          ),

          color:
            getRatingColor(
              average
            ),

        };

      }
    );

if (loading) {
  return <Loading />;
}
  return (

    <div className="dashboard">


      {/* ========================================== */}
      {/* SIDEBAR */}
      {/* ========================================== */}

      <SideBar />


      {/* ========================================== */}
      {/* CONTENIDO */}
      {/* ========================================== */}

      <main className="dashboard-content">


        {/* ========================================== */}
        {/* ESTADÍSTICAS */}
        {/* ========================================== */}

        <section className="stats">

  {/* TOTAL DE RESPUESTAS */}

  <div className="card">

    

    <div className="card-info">
<div className="card-icon total-icon">
      <ClipboardList size={26} strokeWidth={2} />
    </div>
      <span>
        Total de Respuestas
      </span>

    

    </div>
  <strong className="yellow-text">
        {loading
          ? "..."
          : totalResponses
        }
      </strong>
  </div>


  {/* RESPUESTAS IDENTIFICADAS */}

  <div className="card">

    
    <div className="card-info">
<div className="card-icon identified-icon">
      <UserCheck size={26} strokeWidth={2} />
    </div>
      <span>
        Respuestas Identificadas
      </span>

     

    </div>
 <strong>
        {loading
          ? "..."
          : identifiedResponses
        }
      </strong>
  </div>


  {/* RESPUESTAS ANÓNIMAS */}

  <div className="card">

    
    <div className="card-info">
<div className="card-icon anonymous-icon">
      <UserRound size={26} strokeWidth={2} />
    </div>

      <span>
        Respuestas Anónimas
      </span>

      

    </div>
<strong>
        {loading
          ? "..."
          : anonymousResponses
        }
      </strong>
  </div>

</section>


        {/* ========================================== */}
        {/* ANALYTICS */}
        {/* ========================================== */}

        <section className="analytics">


          {/* ======================================== */}
          {/* DISTRIBUCIÓN */}
          {/* ======================================== */}

          <div className="panel">


            <h2>
              Distribución de respuestas
            </h2>


            <div className="chart-container">


              {/* DONUT */}

              <div
                className="donut"
                style={{
                  background: `
                    conic-gradient(
                      #8bdc3c 0%
                      ${distribution.excellent}%,

                      #a8e63d
                      ${distribution.excellent}%
                      ${distribution.excellent + distribution.good}%,

                      #ffd21c
                      ${distribution.excellent + distribution.good}%
                      ${distribution.excellent + distribution.good + distribution.regular}%,

                      #ff8c00
                      ${distribution.excellent + distribution.good + distribution.regular}%
                      ${distribution.excellent + distribution.good + distribution.regular + distribution.bad}%,

                      #ef3038
                      ${distribution.excellent + distribution.good + distribution.regular + distribution.bad}%
                      100%
                    )
                  `,
                }}
              />


              {/* LEYENDA */}

              <div className="legend">


                <p>

                  <span className="legend-icon excellent">

                    <img
                      src={ExcellentIcon}
                      alt="Excelente"
                    />

                  </span>

                  <span>
                    Excelente
                  </span>

                  <b>
                    {distribution.excellent.toFixed(0)}%
                  </b>

                </p>


                <p>

                  <span className="legend-icon good">

                    <img
                      src={GoodIcon}
                      alt="Bueno"
                    />

                  </span>

                  <span>
                    Bueno
                  </span>

                  <b>
                    {distribution.good.toFixed(0)}%
                  </b>

                </p>


                <p>

                  <span className="legend-icon regular">

                    <img
                      src={NeutralIcon}
                      alt="Regular"
                    />

                  </span>

                  <span>
                    Regular
                  </span>

                  <b>
                    {distribution.regular.toFixed(0)}%
                  </b>

                </p>


                <p>

                  <span className="legend-icon bad">

                    <img
                      src={BadIcon}
                      alt="Malo"
                    />

                  </span>

                  <span>
                    Malo
                  </span>

                  <b>
                    {distribution.bad.toFixed(0)}%
                  </b>

                </p>


                <p>

                  <span className="legend-icon very-bad">

                    <img
                      src={VeryBadIcon}
                      alt="Muy malo"
                    />

                  </span>

                  <span>
                    Muy malo
                  </span>

                  <b>
                    {distribution.veryBad.toFixed(0)}%
                  </b>

                </p>


              </div>


            </div>


          </div>


          {/* ======================================== */}
          {/* PROMEDIOS */}
          {/* ======================================== */}

          <div className="panel">


            <h2>
              Promedio por pregunta
            </h2>


            {questionsAverage.map(
              (item, index) => (

                <div
                  className="average"
                  key={index}
                >


                  <span>
                    {index + 1}. {item.name}
                  </span>


                  <strong
                    className={item.color}
                  >
                    {item.value}
                  </strong>


                  <img
                    src={getRatingIcon(
                      item.value
                    )}
                    alt={`Valoración ${item.value}`}
                    className="average-icon"
                  />


                </div>

              )
            )}


          </div>


        </section>


      </main>


    </div>

  );

}


export default Dashboard;