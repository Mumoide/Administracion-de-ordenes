import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DateComponent from "../../components/DateComponent";
import { DotSpinner } from "@uiball/loaders";
import AlertComponent from "../../components/AlertComponent";
import Swal from "sweetalert2";

function EditStages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedDeliveryDate, setSelecteDeliveryDate] = useState(null);
  const [formattedDeliveryDate, setFormattedDeliveryDate] = useState(null);
  const [selectedDeadlineDate, setSelecteDeadlineDate] = useState(null);
  const [formattedDeadineDate, setFormattedDeadineDate] = useState(null);
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
  //ANCHOR - data
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
  });

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  const swalEdited = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/etapa/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        const creationDate = new Date(res.data.data.fecha_inicio_estado);
        creationDate.setDate(creationDate.getDate() + 1);
        const creationDateFormatted =
          creationDate.getFullYear() +
          "-" +
          ("0" + (creationDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + creationDate.getDate()).slice(-2);
        console.log(res);
        setData({
          ...data,
          descripcion: res.data.data.descripcion,
          fecha_entrega: res.data.data.fecha_entrega,
          fecha_envio: res.data.data.fecha_envio,
          fecha_inicio_estado: creationDateFormatted,
          id: res.data.data.id,
          id_estado: res.data.data.id_estado,
          id_etapa: res.data.data.id_etapa,
          id_orden: res.data.data.id_orden,
          nro_ficha: res.data.data.nro_ficha,
        });

        setSelecteDeliveryDate(
          res.data.data.fecha_envio
            ? new Date(res.data.data.fecha_envio)
            : new Date()
        );

        setSelecteDeadlineDate(
          res.data.data.fecha_entrega
            ? new Date(res.data.data.fecha_entrega)
            : new Date()
        );
        setDataLoaded(true);
      })
      .catch(() => {
        navigate("/EtapaNoEncontrada");
      });
  }, []);

  useEffect(() => {
    if (selectedDeliveryDate && !isNaN(selectedDeliveryDate)) {
      console.log(selectedDeliveryDate);
      const formattedDelivery = selectedDeliveryDate
        .toISOString()
        .split("T")[0];
      setFormattedDeliveryDate(formattedDelivery);
      setData({ ...data, fecha_envio: formattedDelivery });
    }
  }, [selectedDeliveryDate]);

  useEffect(() => {
    if (selectedDeadlineDate && !isNaN(selectedDeadlineDate)) {
      console.log(selectedDeadlineDate);
      const formattedDeadline = selectedDeadlineDate
        .toISOString()
        .split("T")[0];
      setFormattedDeadineDate(formattedDeadline);
      setData({ ...data, fecha_entrega: formattedDeadline });
    }
  }, [selectedDeadlineDate]);

  const handleDeliveryDateChange = (newDate) => {
    setSelecteDeliveryDate(newDate);
  };

  const handleDeadlineDateChange = (newDate) => {
    setSelecteDeadlineDate(newDate);
  };

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
    const maxShippingDate = currentDateForMaxShipping.setMonth(
      currentDateForMaxShipping.getMonth() + 12
    );
    const minShippingDate = new Date("2017-01-01");
    if (
      selectedDeliveryDate < minShippingDate ||
      selectedDeliveryDate > maxShippingDate ||
      data.fecha_envio === ""
    ) {
      setShippingDateErrorMessage(true);
      if (selectedDeliveryDate < minShippingDate) {
        console.log(selectedDeliveryDate);
        setDeliveryMessage("Fecha minima 2017");
      }
      if (selectedDeliveryDate > maxShippingDate) {
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
      console.log(selectedDeadlineDate);
      setDeadlineErrorMessage(false);
    }
    // Validate description
    if (data.descripcion) {
      if (data.descripcion.length > 255) {
        setDescriptionErrorMessage(true);
        setDescriptionMessage("Indicación muy larga");
        if (data.descripcion === "") {
          setDescriptionMessage("");
        }
        hasError = true;
      }
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
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }

    const requestData = {
      ...data,
      fecha_entrega: formattedDeadineDate,
      fecha_envio: formattedDeliveryDate,
    };

    if (requestData.fecha_entrega) {
      requestData.fecha_entrega = new Date(requestData.fecha_entrega)
        .toISOString()
        .split("T")[0];
    }
    if (requestData.fecha_envio) {
      requestData.fecha_envio = new Date(requestData.fecha_envio)
        .toISOString()
        .split("T")[0];
    }
    if (user.rol_id === 1) {
      axios
        .put("http://localhost:8081/api/etapa/" + id, requestData, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            let timerInterval;
            swalEdited.fire({
              title: "Etapa modificada",
              timer: 3000,
              timerProgressBar: true,
              confirmButtonText: "Cerrar",
              willClose: () => {
                clearInterval(timerInterval);
                navigate("/stages/" + data.id_orden);
              },
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .put("http://localhost:8081/api/etapaLabo/" + id, requestData, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            let timerInterval;
            swalEdited.fire({
              title: "Etapa modificada",
              timer: 3000,
              timerProgressBar: true,
              confirmButtonText: "Cerrar",
              willClose: () => {
                clearInterval(timerInterval);
                navigate("/stages/" + data.id_orden);
              },
            });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border  w-75">
      <h2>Edición etapa de orden N°{data.nro_ficha}</h2>
      <div className="col-12">
        {emptyFieldsMessage && (
          <AlertComponent
            emptyFieldsMessage={emptyFieldsMessage}
            handleCloseEmpty={handleCloseEmpty}
          />
        )}
      </div>
      {dataLoaded && (
        <form className="row g-3 p-4" onSubmit={handleSubmit}>
          <div className="col-12 col-md-6">
            <label htmlFor="inputStage" className="form-label">
              Etapa
            </label>
            <select
              className="form-select"
              onChange={(e) => setData({ ...data, id_etapa: e.target.value })}
              value={data.id_etapa}
              disabled={user.rol_id === 1 ? false : true}
            >
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
              className="form-select"
              onChange={(e) => setData({ ...data, id_estado: e.target.value })}
              value={data.id_estado}
            >
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
          <div className="col-12 col-md-6">
            <DateComponent
              fecha={formattedDeliveryDate}
              title="Fecha de envío"
              onDateChange={handleDeliveryDateChange}
              col="col-12"
              name="idDeliveryDate"
              disabled={user.rol_id === 1 ? false : true}
            />
            {shippingDateErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{deliveryMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <DateComponent
              fecha={formattedDeadineDate}
              title="Fecha de entrega"
              onDateChange={handleDeadlineDateChange}
              col="col-12"
              name="idDeadline"
              disabled={user.rol_id === 1 ? false : true}
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
              Descripción
            </label>
            <textarea
              className="form-control"
              id="inputDescription"
              placeholder="Modifique descripción"
              autoComplete="off"
              style={styles.customInput}
              onChange={(e) =>
                setData({ ...data, descripcion: e.target.value })
              }
              value={data?.descripcion ? data?.descripcion : ""}
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
              Editar
            </button>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div>
              <Link
                onClick={() => navigate(-1)}
                className="btn btn-danger w-100 btn-secondary"
              >
                Volver
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditStages;

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
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
