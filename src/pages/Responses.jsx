import { useEffect, useState } from "react";

import "../styles/dashboard.css";

import SideBar from "../components/SideBar";

import VeryBadIcon from "../assets/angry.png";
import BadIcon from "../assets/sad-face.png";
import NeutralIcon from "../assets/neutral-face.png";
import GoodIcon from "../assets/happy-face.png";
import ExcellentIcon from "../assets/happy.png";

import {
  db,
  collection,
  getDocs,
  query,
  orderBy,
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
// COLORES SEGÚN VALORACIÓN
// ==================================================

const ratingColors = {
  1: "very-bad",
  2: "bad",
  3: "regular",
  4: "good",
  5: "excellent",
};


// ==================================================
// CAMPOS DE LAS 7 PREGUNTAS
// ==================================================

const ratingFields = [
  "commercialAttention",
  "deliveryTimes",
  "productAvailability",
  "technicalAdvice",
  "claimsResolution",
  "overallExperience",
  "repurchaseProbability",
];


function Responses() {

  // ==================================================
  // ESTADOS
  // ==================================================

  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);
const ITEMS_PER_PAGE = 7;

const [currentPage, setCurrentPage] = useState(1);
  // Mostrar u ocultar menú de filtros
  const [showFilters, setShowFilters] = useState(false);

  // Filtro seleccionado
  const [filter, setFilter] = useState("all");


  // ==================================================
  // OBTENER RESPUESTAS DE FIREBASE
  // ==================================================

  useEffect(() => {

    const getResponses = async () => {

      try {

        const responsesRef = collection(
          db,
          "surveys"
        );


        const q = query(
          responsesRef,
          orderBy("createdAt", "desc")
        );


        const snapshot = await getDocs(q);


        const data = snapshot.docs.map((doc) => ({

          id: doc.id,

          ...doc.data(),

        }));


        setResponses(data);


      } catch (error) {

        console.error(
          "Error obteniendo las respuestas:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    getResponses();

  }, []);


  // ==================================================
  // FILTRAR RESPUESTAS
  // ==================================================

  const filteredResponses = responses.filter((response) => {

    // Mostrar todas
    if (filter === "all") {
      return true;
    }


    // Mostrar solo anónimas
    if (filter === "anonymous") {
      return response.identityType === "anonymous";
    }


    // Mostrar solo identificadas
    if (filter === "identified") {
      return response.identityType === "company";
    }


    return true;

  });
  const totalPages = Math.ceil(
  filteredResponses.length / ITEMS_PER_PAGE
);

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;

const paginatedResponses = filteredResponses.slice(
  startIndex,
  endIndex
);


  // ==================================================
  // CAMBIAR FILTRO
  // ==================================================

const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  setCurrentPage(1);
  setShowFilters(false);
};


  return (
    <div className="dashboard">


      {/* ========================================== */}
      {/* SIDEBAR */}
      {/* ========================================== */}

      <SideBar />


      {/* ========================================== */}
      {/* CONTENIDO */}
      {/* ========================================== */}

      <main className="dashboard-content responses-page">


        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <header className="responses-header">

          <div>

            <h1>
              Respuestas
            </h1>

            <p>
              Consulta todas las respuestas de la encuesta.
            </p>

          </div>


          {/* ========================================== */}
          {/* FILTRO */}
          {/* ========================================== */}

          <div className="filter-container">


            {/* BOTÓN FILTRO */}

            <button
              className="filter-button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
            >

              Filtro

              <span
                className={
                  showFilters
                    ? "arrow open"
                    : "arrow"
                }
              >
                ▼
              </span>

            </button>


            {/* OPCIONES */}

            {showFilters && (

              <div className="filter-options">


                {/* TODAS */}

                <button
                  className={
                    filter === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleFilterChange("all")
                  }
                >
                  Todas
                </button>


                {/* ANÓNIMAS */}

                <button
                  className={
                    filter === "anonymous"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleFilterChange("anonymous")
                  }
                >
                  Anónimas
                </button>


                {/* IDENTIFICADAS */}

                <button
                  className={
                    filter === "identified"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleFilterChange("identified")
                  }
                >
                  Identificadas
                </button>


              </div>

            )}

          </div>

        </header>


        {/* ========================================== */}
        {/* TABLA */}
        {/* ========================================== */}

        <section className="responses-table">


          {/* ========================================== */}
          {/* CABECERA */}
          {/* ========================================== */}

          <div className="responses-row responses-head">

            <span>
              #
            </span>

            <span>
              Usuario/Anónimo
            </span>

            <span>
              Fecha
            </span>


            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>


            <span>
              8
            </span>

            <span>
              9
            </span>

          </div>


          {/* ========================================== */}
          {/* CARGANDO */}
          {/* ========================================== */}

          {loading && (

            <div className="empty-state">

              Cargando respuestas...

            </div>

          )}


          {/* ========================================== */}
          {/* SIN RESPUESTAS */}
          {/* ========================================== */}

          {!loading &&
            filteredResponses.length === 0 && (

              <div className="empty-state">

                No hay respuestas para este filtro.

              </div>

          )}


          {/* ========================================== */}
          {/* RESPUESTAS */}
          {/* ========================================== */}

          {!loading &&
          paginatedResponses.map(
              (response, index) => (

                <div
                  className="responses-row response-item"
                  key={response.id}
                >


                  {/* NÚMERO */}

                 <span>
  {startIndex + index + 1}
</span>


                  {/* EMPRESA */}

                  <span>

                    {response.identityType ===
                    "anonymous"

                      ? "Anónimo"

                      : response.companyName ||
                        "Sin nombre"

                    }

                  </span>


                  {/* FECHA */}

                  <span className="date">

                    {response.createdAt?.toDate

                      ? response.createdAt
                          .toDate()
                          .toLocaleString("es-AR")

                      : "-"

                    }

                  </span>


                  {/* ====================================== */}
                  {/* PREGUNTAS 1 A 7 */}
                  {/* ====================================== */}

                  {ratingFields.map((field) => {

                    const rating =
                      response[field];


                    return (

                      <span
                        className={
                          `answer ${
                            ratingColors[rating]
                          }`
                        }
                        key={field}
                      >

                        <img
                          src={
                            ratingIcons[rating]
                          }
                          alt={
                            `Valoración ${rating}`
                          }
                        />

                      </span>

                    );

                  })}


                  {/* ====================================== */}
                  {/* PREGUNTA 8 */}
                  {/* ====================================== */}

                  <span
  className="text-answer"
  title={response.mostValued || ""}
>
  {response.mostValued || "-"}
</span>


                  {/* ====================================== */}
                  {/* PREGUNTA 9 */}
                  {/* ====================================== */}

                  <span className="text-answer">

                    {response.improvement || "-"}

                  </span>
        


                </div>

              )

            )}

        </section>


        {/* ========================================== */}
        {/* PAGINACIÓN */}
        {/* ========================================== */}

        <div className="pagination">

          <span>
Mostrando{" "}
{filteredResponses.length === 0
  ? 0
  : startIndex + 1}
-
{Math.min(endIndex, filteredResponses.length)} de{" "}
{filteredResponses.length} respuestas
          </span>


          <div className="pagination-buttons">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
  >
    ‹ Anterior
  </button>

  {Array.from({ length: totalPages }).map((_, index) => (
    <button
      key={index}
      className={
        currentPage === index + 1 ? "selected" : ""
      }
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages || totalPages === 0}
    onClick={() => setCurrentPage((p) => p + 1)}
  >
    Siguiente ›
  </button>

</div>

        </div>


      </main>

    </div>
  );
}


export default Responses;