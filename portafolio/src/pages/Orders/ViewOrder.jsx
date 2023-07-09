import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DotSpinner } from "@uiball/loaders";

function ViewOrder() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState({
    creationDate: "",
    fileNumber: "",
    patientName: "",
    patientLastName: "",
    patientRut: "",
    patientBirthDate: "",
    medicalCenter: "",
    doctorName: "",
    doctorLastName: "",
    doctorRut: "",
    workType: "",
    prothesis: "",
    completitude: "",
    color: "",
    location: "",
    indications: "",
    billing: "",
    billingDate: "",
    licence: "",
    stage: "",
  });
  const [name, setName] = useState({ name: "" });
  const [parsedCreationDate, setParsedCreationDate] = useState("");
  const [parsedPatientBirthdate, setParsedPatientBirthdate] = useState("");
  const [parsedBillingDate, setParsedBillingDate] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/ordenes/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        setData({
          ...data,
          creationDate: res.data.fecha_creacion,
          fileNumber: res.data.numero_ficha,
          patientName: res.data.patient_name,
          patientLastName: res.data.patient_last_name,
          patientRut: res.data.rut_paciente,
          patientBirthDate: res.data.patient_birth_date,
          medicalCenter: res.data.centro,
          doctorName: res.data.doctor_name,
          doctorLastName: res.data.doctor_last_name,
          doctorRut: res.data.rut_doctor,
          workType: res.data.tipo_trabajo,
          prothesis: res.data.protesis,
          completitude: res.data.completitud,
          color: res.data.color,
          location: res.data.ubicacion,
          indications: res.data.indicaciones,
          billing: res.data.tipo_factura,
          billingDate: res.data.fecha_facturacion,
          licence: res.data.licencia,
          stage: res.data.etapa,
          nombre_centro: res.data.nombre_centro,
          nombre_color: res.data.nombre_color,
          nombre_completitud: res.data.nombre_completitud,
          nombre_licencia: res.data.nombre_licencia,
          nombre_protesis: res.data.nombre_protesis,
          nombre_terminacion: res.data.nombre_terminacion,
          nombre_tipo_factura: res.data.nombre_tipo,
          nombre_trabajo: res.data.nombre_trabajo,
          nombre_ubicaciones: res.data.nombre_ubicaciones,
        });
        setDataLoaded(true);
        setName({
          name: res.data.numero_ficha,
        });
      })
      .catch(() => {
        navigate("/OrdenNoEncontrada");
      });
  }, []);

  useEffect(() => {
    const creationDate = new Date(data.creationDate);
    const billingDate = new Date(data.billingDate);
    const patientDate = new Date(data.patientBirthDate);
    const creationDateFormatted =
      ("0" + creationDate.getDate()).slice(-2) +
      "-" +
      ("0" + (creationDate.getMonth() + 1)).slice(-2) +
      "-" +
      creationDate.getFullYear();
    const billingDateFormatted =
      ("0" + billingDate.getDate()).slice(-2) +
      "-" +
      ("0" + (billingDate.getMonth() + 1)).slice(-2) +
      "-" +
      billingDate.getFullYear();
    const patientDateFormatted =
      ("0" + patientDate.getDate()).slice(-2) +
      "-" +
      ("0" + (patientDate.getMonth() + 1)).slice(-2) +
      "-" +
      patientDate.getFullYear();
    setParsedCreationDate(creationDateFormatted);
    setParsedPatientBirthdate(patientDateFormatted);
    setParsedBillingDate(billingDateFormatted);
  }, [data.creationDate, data.billingDate, data.patientBirthDate]);

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column pt-2 mt-3 w-100">
      <div className="d-flex flex-column border col-12 col-xl-10 offset-xl-1">
        <div className="d-flex flex-row justify-content-center p-3">
          <h2>Orden Nro°{name.name}</h2>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="d-flex flex-row row col-12 col-md-12 p-4 border m-auto mb-2">
                <div className="d-flex flex-row justify-content-start userTitle">
                  Información de la orden:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de creación: {parsedCreationDate}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Centro médico: {data.nombre_centro}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Tipo de trabajo: {data.nombre_trabajo}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Protesis: {data.nombre_protesis}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Completitud: {data.nombre_completitud}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Color: {data.nombre_color}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Ubicacion: {data.nombre_ubicaciones}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Factura: {data.nombre_tipo_factura}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de facturación: {parsedBillingDate}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Licencia: {data.nombre_licencia}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Indicaciones:{" "}
                  {data.indications.length > 0
                    ? data.indications
                    : "Sin indicaciones"}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex flex-row row col-12 col-md-12 p-4 border m-auto">
                <div className="d-flex flex-row justify-content-start userTitle">
                  Información del paciente:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Nombre: {data.patientName}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Apellido: {data.patientLastName}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de nacimiento: {parsedPatientBirthdate}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Rut: {data.patientRut}
                </div>
              </div>
              <div className="d-flex flex-row row col-12 col-md-12 p-4 border m-auto mt-2">
                <div className="d-flex flex-row justify-content-start userTitle">
                  Información del doctor:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Nombre: {data.doctorName}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Apellido: {data.doctorLastName}
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Rut: {data.doctorRut}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 p-4">
        <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3  col-lg-4 offset-lg-4 col-xl-2 offset-xl-5">
          <button
            className="btn btn-danger w-100 btn-secondary"
            onClick={() => navigate("/orders")}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewOrder;

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
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
