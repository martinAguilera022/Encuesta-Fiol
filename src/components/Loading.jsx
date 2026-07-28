import "../styles/loading.css";
function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>

        <p>Cargando...</p>
      </div>
    </div>
  );
}

export default Loading;
