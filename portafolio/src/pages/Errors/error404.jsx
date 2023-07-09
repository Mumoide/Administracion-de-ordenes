function error404() {
  return (
    <div className="d-flex flex-column mt-3 px-4 py-2">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4" style={styles.heading}>
            Ups! Esta página no existe.
          </h2>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <img
            src="http://localhost:8081/images/404.png"
            alt="404"
            className="img-fluid"
            style={styles.maxHeight}
          />
        </div>
      </div>
    </div>
  );
}

export default error404;

const styles = {
  heading: {
    fontSize: "1 rem",
    color: "#333",
    fontFamily: "Montserrat",
    fontWeight: "600",
    letterSpacing: "2px",
    marginBottom: "2rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  },
  maxHeight: {
    maxHeight: "75vh",
    maxWidth: "auto",
  },
};
