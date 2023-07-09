import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertComponent from "../../components/AlertComponent";
import Swal from "sweetalert2";

function CreateStage() {
  const navigate = useNavigate();
  const { id, number } = useParams();
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    id_orden: id,
    nro_ficha: number,
    id_etapa: "",
    id_estado: "",
    fecha_envio: "",
    fecha_entrega: "",
    descripcion: "",
  });
  const [verifyStage, setVerifyStage] = useState(false);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [stageErrorMessage, setStageErrorMessage] = useState(false);
  const [stateErrorMessage, setStateErrorMessage] = useState(false);
  const [shippingDateErrorMessage, setShippingDateErrorMessage] =
    useState(false);
  const [deadlineErrorMessage, setDeadlineErrorMessage] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deadlineMessage, setDeadlineMessage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/etapas/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        console.log(res.data.data[0].length);
        if (res.data.data[0].length > 0) {
          setVerifyStage(true);
          setDataLoaded(true);
        }
        console.log(res);
      })
      .catch((err) => {
        axios
          .get("http://localhost:8081/api/ordenes/" + id, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((orden) => {
            if (orden.data.numero_ficha != number) {
              navigate("/OrdenNoEncontrada");
            }
          })
          .catch(() => {
            navigate("/OrdenNoEncontrada");
          });
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message === "No se encontraron etapas"
        ) {
          setVerifyStage(false);
          setDataLoaded(true);
        }
      });
  }, []);

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  const swalCreated = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Error handler
    let hasError = false;
    // Validate stage
    const validStages = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
    ];

    if (!validStages.includes(data.id_etapa)) {
      setStageErrorMessage(true);
      hasError = true;
    } else {
      setStageErrorMessage(false);
    }
    setEmptyFieldsMessage(false);
    // Validate state
    const validStates = [1, 2, 3, 4, "1", "2", "3", "4"];

    if (!validStates.includes(data.id_estado)) {
      setStateErrorMessage(true);
      hasError = true;
    } else {
      setStateErrorMessage(false);
    }
    // Validate shippingDate
    const currentDateForMaxShipping = new Date();
    const selectedShippingDate = new Date(data.fecha_envio);
    const maxShippingDate = currentDateForMaxShipping.setMonth(
      currentDateForMaxShipping.getMonth() + 12
    );
    const minShippingDate = new Date("2017-01-01");
    if (
      selectedShippingDate < minShippingDate ||
      selectedShippingDate > maxShippingDate ||
      data.fecha_envio === ""
    ) {
      setShippingDateErrorMessage(true);
      if (selectedShippingDate < minShippingDate) {
        setDeliveryMessage("Fecha minima 2017");
      }
      if (selectedShippingDate > maxShippingDate) {
        setDeliveryMessage("Fecha maxima 12 meses a futuro");
      }
      if (data.fecha_envio === "") {
        setDeliveryMessage("Se requiere fecha");
      }
      hasError = true;
    } else {
      setShippingDateErrorMessage(false);
    }
    // Validate deadline
    const currentDateForMaxDeadline = new Date();
    const selectedDeadlineDate = new Date(data.fecha_entrega);
    const maxDeadlineDate = currentDateForMaxDeadline.setMonth(
      currentDateForMaxDeadline.getMonth() + 14
    );
    const minDeadlineDate = new Date("2017-01-01");
    if (
      selectedDeadlineDate < minDeadlineDate ||
      selectedDeadlineDate > maxDeadlineDate ||
      data.fecha_entrega === ""
    ) {
      if (selectedDeadlineDate < minDeadlineDate) {
        setDeadlineMessage("Fecha minima 2017");
      }
      if (selectedDeadlineDate > maxDeadlineDate) {
        setDeadlineMessage("Fecha maxima 14 meses a futuro");
      }
      setDeadlineErrorMessage(true);
      if (data.fecha_entrega === "") {
        setDeadlineMessage("Se requiere fecha");
      }
      hasError = true;
    } else {
      setDeadlineErrorMessage(false);
    }
    // Validate description
    if (data.descripcion.length > 255) {
      setDescriptionErrorMessage(true);
      setDescriptionMessage("Descripción muy larga");
      if (data.descripcion === "") {
        setDescriptionMessage("");
      }
      hasError = true;
    } else {
      setDescriptionErrorMessage(false);
    }
    // Check if any required fields are empty
    if (
      data.id_etapa === "" ||
      data.id_estado === "" ||
      data.fecha_envio === "" ||
      data.fecha_entrega === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }
    axios
      .post(`http://localhost:8081/api/etapas/${id}/${number}`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then(() => {
        let timerInterval;
        swalCreated.fire({
          title: "Etapa creada",
          timer: 3000,
          timerProgressBar: true,
          confirmButtonText: "Cerrar",
          willClose: () => {
            clearInterval(timerInterval);
            navigate(`/stages/${id}`);
          },
        });
      })
      .catch((err) => {
        console.log(data), console.log(err);
      });
  };

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border w-75">
      {verifyStage ? (
        <h2>Cambio de etapa de orden Nro° {number}</h2>
      ) : (
        <h2>Crear primera etapa de orden Nro° {number}</h2>
      )}
      <div className="col-12">
        {emptyFieldsMessage && (
          <AlertComponent
            emptyFieldsMessage={emptyFieldsMessage}
            handleCloseEmpty={handleCloseEmpty}
          />
        )}
      </div>
      <form className="row g-3 p-4" onSubmit={handleSubmit}>
        <div className="col-12 col-md-6">
          <label htmlFor="inputStage" className="form-label">
            Etapa
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, id_etapa: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Cubeta</option>
            <option value="2">Modelo</option>
            <option value="3">Placa relación</option>
            <option value="4">Base Metálica</option>
            <option value="5">Articulación</option>
            <option value="6">Terminación</option>
            <option value="7">Reparación</option>
          </select>
          {stageErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione una etapa válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputStage" className="form-label">
            Estado
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, id_estado: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Cancelado</option>
            <option value="2">Pendiente</option>
            <option value="3">En proceso</option>
            <option value="4">Terminado</option>
          </select>
          {stateErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione un estado válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6 mt-2">
          <label htmlFor="inputBirthDate" className="form-label">
            Fecha de envio
          </label>
          <input
            type="date"
            className="form-control"
            id="inputShippingDate"
            placeholder="Ingresar fecha de nacimiento"
            autoComplete="off"
            onChange={(e) => setData({ ...data, fecha_envio: e.target.value })}
          />
          {shippingDateErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{deliveryMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6 mt-2">
          <label htmlFor="inputBirthDate" className="form-label">
            Fecha de entrega
          </label>
          <input
            type="date"
            className="form-control"
            id="inputDeadline"
            placeholder="Ingresar fecha de nacimiento"
            autoComplete="off"
            onChange={(e) =>
              setData({ ...data, fecha_entrega: e.target.value })
            }
          />
          {deadlineErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{deadlineMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 h-100">
          <label htmlFor="inputDescription" className="form-label">
            Descripcion
          </label>
          <textarea
            className="form-control"
            id="inputDescription"
            placeholder="Ingrese descripción"
            autoComplete="off"
            style={styles.customInput}
            onChange={(e) => setData({ ...data, descripcion: e.target.value })}
          />
          {descriptionErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{descriptionMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3">
          <button type="submit" className="btn btn-success w-100">
            {verifyStage ? "Cambiar" : "Crear"}
          </button>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div>
            <Link
              to={verifyStage ? `/stages/${id}` : `/orders/`}
              className="btn btn-danger w-100 btn-secondary"
            >
              Volver
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateStage;

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
  customInput: {
    backgrondColor: "#fff",
    overflow: "scroll",
    resize: "vertical",
    overflowX: "auto",
    height: "100px",
  },
};
