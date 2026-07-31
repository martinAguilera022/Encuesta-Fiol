import { useEffect, useMemo, useState } from "react";

import "../styles/dashboard.css";

import SideBar from "../components/SideBar";

import { db, collection, getDocs, query, orderBy } from "../firebase/firestore";

import { AlertCircle, Heart, Search, ThumbsUp, UserRound } from "lucide-react";

const hasText = (value) => Boolean(value?.trim());

const formatDate = (createdAt) => {
  if (!createdAt?.toDate) return "-";

  return createdAt.toDate().toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Comments() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const getComments = async () => {
      try {
        const responsesRef = collection(db, "surveys");
        const commentsQuery = query(responsesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(commentsQuery);

        setResponses(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      } catch (error) {
        console.error("Error obteniendo comentarios:", error);
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, []);

  const responsesWithComments = useMemo(
    () =>
      responses.filter(
        (response) =>
          hasText(response.mostValued) || hasText(response.improvement),
      ),
    [responses],
  );

  const filteredResponses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return responsesWithComments.filter((response) => {
      const mostValued = response.mostValued?.trim() || "";
      const improvement = response.improvement?.trim() || "";
      const companyName = response.companyName?.trim() || "";

      const matchesSearch = [mostValued, improvement, companyName].some(
        (value) => value.toLowerCase().includes(searchText),
      );

      if (!matchesSearch) return false;
      if (filter === "valued") return mostValued.length > 0;
      if (filter === "improvement") return improvement.length > 0;

      return true;
    });
  }, [filter, responsesWithComments, search]);

  const countLabel =
    responsesWithComments.length === 1 ? "cliente dejó" : "clientes dejaron";

  return (
    <div className="dashboard">
      <SideBar />

      <main className="dashboard-content comments-page">
        <header className="comments-header">
          <div className="comments-heading">
            <h1>Comentarios</h1>
            <p>Opiniones y sugerencias de los clientes</p>
          </div>

          <label className="comments-search">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar comentario..."
              aria-label="Buscar comentario"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </header>

        <div className="comments-toolbar">
          <p className="comments-count">
            <strong>{responsesWithComments.length}</strong> {countLabel}{" "}
            comentarios
          </p>

          <div
            className="comments-filters"
            role="group"
            aria-label="Filtrar comentarios"
          >
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>

            <button
              type="button"
              className={filter === "valued" ? "active" : ""}
              aria-pressed={filter === "valued"}
              onClick={() => setFilter("valued")}
            >
              <ThumbsUp size={17} aria-hidden="true" />
              Lo que valoran
            </button>

            <button
              type="button"
              className={filter === "improvement" ? "active" : ""}
              aria-pressed={filter === "improvement"}
              onClick={() => setFilter("improvement")}
            >
              <AlertCircle size={17} aria-hidden="true" />
              Oportunidades de mejora
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Cargando comentarios...</div>
        ) : filteredResponses.length === 0 ? (
          <div className="empty-state">
            <MessageEmptyState search={search} />
          </div>
        ) : (
          <section className="comments-grid" aria-live="polite">
            {filteredResponses.map((response) => {
              const showValued =
                filter !== "improvement" && hasText(response.mostValued);
              const showImprovement =
                filter !== "valued" && hasText(response.improvement);

              return (
                <article className="comment-card" key={response.id}>
                  <header className="comment-card-header">
                    <div className="comment-user">
                      <div className="user-icon" aria-hidden="true">
                        <UserRound size={22} />
                      </div>

                      <div className="comment-user-data">
                        <strong>
                          {response.identityType === "anonymous"
                            ? "Anónimo"
                            : response.companyName || "Sin nombre"}
                        </strong>
                        <span>{formatDate(response.createdAt)}</span>
                      </div>
                    </div>
                  </header>

                  {showValued && (
                    <div className="comment-section valued">
                      <div className="comment-title">
                        <Heart
                          size={18}
                          className="comment-icon"
                          aria-hidden="true"
                        />
                        <strong>Lo que más valora</strong>
                      </div>
                      <p>“{response.mostValued.trim()}”</p>
                    </div>
                  )}

                  {showImprovement && (
                    <div className="comment-section improvement">
                      <div className="comment-title">
                        <AlertCircle
                          size={18}
                          className="comment-icon"
                          aria-hidden="true"
                        />
                        <strong>Oportunidad de mejora</strong>
                      </div>
                      <p>“{response.improvement.trim()}”</p>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function MessageEmptyState({ search }) {
  return search.trim()
    ? "No se encontraron comentarios para esa búsqueda."
    : "No se encontraron comentarios.";
}

export default Comments;