import { useEffect, useState } from "react";

import "../styles/dashboard.css";

import Sidebar from "../components/Sidebar";

import {
  db,
  collection,
  getDocs,
  query,
  orderBy,
} from "../firebase/firestore";

import {
  Heart,
  MessageCircle,
  Search,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";


function Comments() {

  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");


  // ==========================================
  // OBTENER RESPUESTAS
  // ==========================================

  useEffect(() => {

    const getComments = async () => {

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


        const data = snapshot.docs.map(
          (doc) => ({

            id: doc.id,

            ...doc.data(),

          })
        );


        setResponses(data);


      } catch (error) {

        console.error(
          "Error obteniendo comentarios:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    getComments();

  }, []);


  // ==========================================
  // FILTRAR COMENTARIOS
  // ==========================================

  const filteredResponses = responses.filter(
    (response) => {


      // Buscar texto

      const searchText = search.toLowerCase();


      const matchesSearch =

        response.mostValued
          ?.toLowerCase()
          .includes(searchText)

        ||

        response.improvement
          ?.toLowerCase()
          .includes(searchText)

        ||

        response.companyName
          ?.toLowerCase()
          .includes(searchText);


      // Filtro

      if (filter === "valued") {

        return (
          response.mostValued &&
          matchesSearch
        );

      }


      if (filter === "improvement") {

        return (
          response.improvement &&
          matchesSearch
        );

      }


      return matchesSearch;

    }
  );


  return (

    <div className="dashboard">


      {/* SIDEBAR */}

      <Sidebar />


      {/* CONTENIDO */}

      <main className="dashboard-content comments-page">


        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <header className="comments-header">


          <div>

            <h1>
              Comentarios
            </h1>

            <p>
              Opiniones y sugerencias de los clientes.
            </p>

          </div>


          {/* BÚSQUEDA */}

          <div className="comments-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar comentario..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


        </header>


        {/* ====================================== */}
        {/* FILTROS */}
        {/* ====================================== */}

        <div className="comments-filters">


          <button
            className={
              filter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("all")
            }
          >
            Todos
          </button>


          <button
            className={
              filter === "valued"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("valued")
            }
          >
            <ThumbsUp size={16} />

            Lo que valoran

          </button>


          <button
            className={
              filter === "improvement"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("improvement")
            }
          >
            <AlertCircle size={16} />

            Mejoras

          </button>


        </div>


        {/* ====================================== */}
        {/* CONTENIDO */}
        {/* ====================================== */}

        {loading ? (

          <div className="empty-state">

            Cargando comentarios...

          </div>

        ) : filteredResponses.length === 0 ? (

          <div className="empty-state">

            No se encontraron comentarios.

          </div>

        ) : (


          <section className="comments-grid">


            {filteredResponses.map(
              (response) => (


                <article
                  className="comment-card"
                  key={response.id}
                >


                  {/* HEADER */}

                  <div className="comment-card-header">


                    <div className="comment-user">


                      <div className="user-icon">

                        <MessageCircle
                          size={18}
                        />

                      </div>


                      <div>

                        <strong>

                          {response.identityType ===
                          "anonymous"

                            ? "Anónimo"

                            : response.companyName ||
                              "Sin nombre"

                          }

                        </strong>


                        <span>

                          {response.createdAt?.toDate

                            ? response.createdAt
                                .toDate()
                                .toLocaleDateString(
                                  "es-AR"
                                )

                            : "-"

                          }

                        </span>

                      </div>


                    </div>


                  </div>


                  {/* LO QUE VALORA */}

                  {response.mostValued && (

                    <div className="comment-section valued">


                      <div className="comment-title">

                        <div className="comment-icon">

                          <Heart
                            size={18}
                          />

                        </div>

                        <strong>
                          Lo que más valora
                        </strong>

                      </div>


                      <p>

                        "{response.mostValued}"

                      </p>


                    </div>

                  )}


                  {/* MEJORA */}

                  {response.improvement && (

                    <div className="comment-section improvement">


                      <div className="comment-title">

                        <div className="comment-icon">

                          <AlertCircle
                            size={18}
                          />

                        </div>

                        <strong>
                          Oportunidad de mejora
                        </strong>

                      </div>


                      <p>

                        "{response.improvement}"

                      </p>


                    </div>

                  )}


                </article>


              )
            )}


          </section>

        )}


      </main>

    </div>

  );

}


export default Comments;