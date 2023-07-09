import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DotSpinner } from "@uiball/loaders";

function ViewStages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [parsedInitialDate, setParsedInitialDate] = useState("");
  const [parsedDeliveryDate, setParsedDeliveryDate] = useState("");
  const [parsedDeadlineDate, setParsedDeadlineDate] = useState("");
  const [data, setData] = useState({
    descripcion: "",
    fecha_entrega: "",
    fecha_envio: "",
    fecha_inicio_estado: "",
    id: "",
    id_estado: "",
    id_etapa: "",
    id_orden: "",
    nro_ficha: "",
    nombre_estados: "",
    nombre_etapas: "",
  });
  const formatDate = (date) => {
    if (date) {
      date = new Date(date);
    } else {
      return "No se encontró fecha";
    }
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const dateFormatted = `${day}-${month}-${year}`;

    return dateFormatted;
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/etapa/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        console.log(res);
        const creationDate = new Date(res.data.data.fecha_inicio_estado);
        creationDate.setDate(creationDate.getDate() + 1);
        setData({
          ...data,
          descripcion: res.data.data.descripcion,
          fecha_entrega: formatDate(res.data.data.fecha_entrega),
          fecha_envio: formatDate(res.data.data.fecha_envio),
          fecha_inicio_estado: formatDate(res.data.data.fecha_inicio_estado),
          id: res.data.data.id,
          id_estado: res.data.data.id_estado,
          id_etapa: res.data.data.id_etapa,
          id_orden: res.data.data.id_orden,
          nro_ficha: res.data.data.nro_ficha,
          nombre_estados: res.data.data.nombre_estados,
          nombre_etapas: res.data.data.nombre_etapas,
        });
        // setSelecteDeliveryDate(
        //   res.data.data.fecha_envio
        //     ? new Date(res.data.data.fecha_envio)
        //     : new Date()
        // );

        // setSelecteDeadlineDate(
        //   res.data.data.fecha_entrega
        //     ? new Date(res.data.data.fecha_entrega)
        //     : new Date()
        // );
        setDataLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        navigate("/EtapaNoEncontrada");
      });
  }, []);

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-column pt-2 mt-3 w-100">
        <div className="d-flex flex-column border col-12 col-xl-10 offset-xl-1">
          <div className="d-flex flex-row justify-content-center p-3">
            <h2>
              Etapa de {data.nombre_etapas} de orden N°{data.nro_ficha}
            </h2>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-row row col-12 col-md-12 p-4 border m-auto mb-2">
                  <div className="d-flex flex-row justify-content-center mb-3 userTitle">
                    Información
                  </div>
                  <div className="d-flex m-2 col-12 justify-content-center userDetails">
                    Fecha de inicio: {data.fecha_inicio_estado}
                  </div>
                  <div className="d-flex m-2 col-12 justify-content-center userDetails">
                    Estado: {data.nombre_estados}
                  </div>
                  <div className="d-flex m-2 col-12 justify-content-center userDetails">
                    Fecha de envio: {data.fecha_envio}
                  </div>
                  <div className="d-flex m-2 col-12 justify-content-center userDetails">
                    Fecha de entrega: {data.fecha_entrega}
                  </div>
                  <div className="d-flex m-2 col-12 justify-content-center userDetails">
                    Descripcion:{" "}
                    {data?.descripcion
                      ? data?.descripcion
                      : "No hay descripción"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-3 p-4">
          <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3  col-lg-4 offset-lg-4 col-xl-2 offset-xl-5">
            <Link
              to={`/stages/${data.id_orden}`}
              className="btn btn-danger w-100 btn-secondary"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStages;

const styles = {
  errorMessage: {
    height: 0,
    overflow: "hidden",
    transition: "height 0.3s",
  },
  errorMessageShow: {
    height: "20px" /* Adjust the height as needed */,
  },
  // style for window error message (alert)
  alert: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    zIndex: "100",
  },
  alertMessage: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInput: {
    height: "120px",
  },
  customInput: {
    backgrondColor: "#fff",
    overflow: "scroll",
    resize: "vertical",
    overflowX: "auto",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
