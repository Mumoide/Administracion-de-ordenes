import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertComponent";
import ChileanRutify from "chilean-rutify";
import Swal from "sweetalert2";

function CreateOrder() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const refClearDoctorName = useRef(null);
  const refClearDoctorLastName = useRef(null);
  const refDoctorName = useRef("");
  const refDoctorLastName = useRef("");
  const refClearPatientName = useRef(null);
  const refClearPatientLastName = useRef(null);
  const refPatientName = useRef("");
  const refPatientLastName = useRef("");
  const refBirthDate = useRef("");
  const [creationDateErrorMessage, setCreationDateErrorMessage] =
    useState(false);
  const [creationDateMessage, setCreationDateMessage] = useState("");
  const [fileNumberErrorMessage, setFileNumberErrorMessage] = useState(false);
  const [fileNumberMessage, setFileNumberMessage] = useState("");
  const [patientNameErrorMessage, setPatientNameErrorMessage] = useState(false);
  const [patientNameMessage, setPatientNameMessage] = useState("");
  const [patientLastNameErrorMessage, setPatientLastNameErrorMessage] =
    useState(false);
  const [patientLastNameMessage, setPatientLastNameMessage] = useState(false);
  const [patientRutErrorMessage, setPatientRutErrorMessage] = useState(false);
  const [patientRutMessage, setPatientRutMessage] = useState(false);
  const [patientBirthDateErrorMessage, setPatientBirthDateErrorMessage] =
    useState(false);
  const [patientBirthDateMessage, setPatientBirthDateMessage] = useState("");
  const [medicalCenterErrorMessage, setMedicalCenterErrorMessage] =
    useState(false);
  const [doctorNameErrorMessage, setDoctorNameErrorMessage] = useState(false);
  const [doctorNameMessage, setDoctorNameMessage] = useState("");
  const [doctorLastNameErrorMessage, setDoctorLastNameErrorMessage] =
    useState(false);
  const [doctorLastNameMessage, setDoctorLastNameMessage] = useState("");
  const [doctorRutErrorMessage, setDoctorRutErrorMessage] = useState(false);
  const [doctorRutMessage, setDoctorRutMessage] = useState(false);
  const [workTypeErrorMessage, setWorkTypeErrorMessage] = useState(false);
  const [prothesisErrorMessage, setProthesisErrorMessage] = useState(false);
  const [completitudeErrorMessage, setCompletitudeErrorMessage] =
    useState(false);
  const [stageErrorMessage, setStageErrorMessage] = useState(false);
  const [colorErrorMessage, setColorErrorMessage] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState(false);
  const [indicationsErrorMessage, setIndicationsErrorMessage] = useState(false);
  const [indicationsMessage, setIndicationsMessage] = useState(false);
  const [billingErrorMessage, setBillingErrorMessage] = useState(false);
  const [billingDateErrorMessage, setBillingDateErrorMessage] = useState(false);
  const [billingDateMessage, setBillingDateMessage] = useState("");
  const [licenceErrorMessage, setLicenceErrorMessage] = useState(false);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
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
    stage: "",
    color: "",
    location: "",
    indications: "",
    billing: "",
    billingDate: "",
    licence: "",
  });
  const [doctorExists, setDoctorExists] = useState(false);
  const [doctorData, setDoctorData] = useState({
    nombre: "",
    apellido: "",
  });
  const [patientExists, setPatientExists] = useState(false);
  const [patientData, setPatientData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
  });

  const handleBirthDate = () => {
    const inputValue = refBirthDate.value;
    setData({ ...data, patientBirthDate: inputValue });
  };

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
    // Validate creationDate
    const currentDate = new Date();
    const selectedDate = new Date(data.creationDate);
    const minDate = new Date("2017-01-01");
    if (
      selectedDate < minDate ||
      selectedDate > currentDate ||
      isNaN(selectedDate)
    ) {
      setCreationDateErrorMessage(true);
      setCreationDateMessage("Debe ser del 2017 hasta hoy");
      if (isNaN(selectedDate)) {
        setCreationDateMessage("Se requiere fecha");
      }
      hasError = true;
    } else {
      setCreationDateErrorMessage(false);
    }
    // Validate filenumber
    const fileNumber = /^[0-9]*$/;
    if (
      !fileNumber.test(data.fileNumber) ||
      data.fileNumber.length > 8 ||
      data.fileNumber.length < 1
    ) {
      setFileNumberErrorMessage(true);
      if (data.fileNumber === "") {
        setFileNumberMessage("Se requiere n° de ficha");
      }
      if (data.fileNumber.length > 8) {
        setFileNumberMessage("Máximo 8 dígitos");
      }
      if (!fileNumber.test(data.fileNumber)) {
        setFileNumberMessage("Sólo se permiten números");
      }
      hasError = true;
    } else {
      setFileNumberErrorMessage(false);
    }
    // Validate patientName
    const spaceCount = (string) => string.split(" ").length - 1;
    const nameRegex = /^[A-Za-zÀ-ÿ]*(?:\s[A-Za-zÀ-ÿ]*){0,2}$/;
    if (
      !nameRegex.test(data.patientName) ||
      data.patientName.length > 25 ||
      data.patientName.length < 2
    ) {
      setPatientNameErrorMessage(true);
      setPatientNameMessage("Sólo se permiten letras");
      if (spaceCount(data.patientName) > 2) {
        setPatientNameMessage("Máximo 2 espacios");
      }
      if (data.patientName.length < 2 && data.patientName.length > 0) {
        setPatientNameMessage("Mínimo 2 caracteres");
      }

      if (data.patientName === "") {
        setPatientNameMessage("Se requiere nombre");
      }
      if (data.patientName.length > 25) {
        setPatientNameMessage("Máximo 25 caracteres");
      }
      hasError = true;
    } else {
      setPatientNameErrorMessage(false);
    }
    // Validate patientLastName
    if (
      !nameRegex.test(data.patientLastName) ||
      data.patientLastName.length > 25 ||
      data.patientLastName.length < 2
    ) {
      setPatientLastNameErrorMessage(true);
      setPatientLastNameMessage("Sólo se permiten letras");
      if (spaceCount(data.patientLastName) > 2) {
        setPatientLastNameMessage("Máximo 2 espacios");
      }
      if (data.patientLastName.length < 2 && data.patientLastName.length > 0) {
        setPatientLastNameMessage("Mínimo 2 caracteres");
      }

      if (data.patientLastName === "") {
        setPatientLastNameMessage("Se requiere apellido");
      }
      if (data.patientLastName.length > 25) {
        setPatientLastNameMessage("Máximo 25 caracteres");
      }
      hasError = true;
    } else {
      setPatientLastNameErrorMessage(false);
    }
    // Validate patient rut
    const validateRut = (rut) => {
      const rutRegex = /^\d{1,8}-[\dk]$/;
      return rutRegex.test(rut);
    };
    if (
      !validateRut(data.patientRut) ||
      !ChileanRutify.validRut(data.patientRut) ||
      data.patientRut.length > 10 ||
      data.patientRut.length < 7
    ) {
      setPatientRutErrorMessage(true);
      if (data.patientRut.length > 10) {
        setPatientRutMessage("Máximo 10 caracteres");
      }
      if (!ChileanRutify.validRut(data.patientRut)) {
        setPatientRutMessage("Rut inválido");
      }
      const hasDot = data.patientRut.includes(".");
      const hasHyphen = data.patientRut.includes("-");
      if (hasDot || !hasHyphen) {
        setPatientRutMessage("Rut debe ser sin puntos y con guión");
      }
      if (data.patientRut.length < 7 && data.patientRut.length > 0) {
        setPatientRutMessage("Mínimo 7 caracteres");
      }
      if (data.patientRut === "") {
        setPatientRutMessage("Se requiere rut");
      }
      hasError = true;
    } else {
      setPatientRutErrorMessage(false);
    }
    // Validate patient birthdate
    const selectedBirthDate = Date(data.patientBirthDate);
    const minBirthDate = new Date("1990-01-01");
    if (
      selectedBirthDate < minBirthDate ||
      selectedBirthDate > currentDate ||
      data.patientBirthDate === ""
    ) {
      if (data.patientBirthDate === "") {
        setPatientBirthDateMessage("Fecha de nacimiento requerida");
      }
      if (selectedBirthDate < minBirthDate) {
        setPatientBirthDateMessage("Sólo fechas desde 1900");
      }
      if (selectedBirthDate > currentDate) {
        setPatientBirthDateMessage("Sólo fechas hasta hoy");
      }
      setPatientBirthDateErrorMessage(true);
      hasError = true;
    } else {
      setPatientBirthDateErrorMessage(false);
    }
    // Validate medical center
    if (
      data.medicalCenter !== 1 &&
      data.medicalCenter !== 2 &&
      data.medicalCenter !== 3 &&
      data.medicalCenter !== "1" &&
      data.medicalCenter !== "2" &&
      data.medicalCenter !== "3"
    ) {
      setMedicalCenterErrorMessage(true);
      hasError = true;
    } else {
      setMedicalCenterErrorMessage(false);
    }
    // Validate doctorName
    if (
      !nameRegex.test(data.doctorName) ||
      data.doctorName.length > 25 ||
      data.doctorName.length < 2
    ) {
      setDoctorNameErrorMessage(true);
      hasError = true;
      setDoctorNameMessage("Sólo se permiten letras");
      if (spaceCount(data.doctorName) > 2) {
        setDoctorNameMessage("Máximo 2 espacios");
      }
      if (data.doctorName.length < 2 && data.doctorName.length > 0) {
        setDoctorNameMessage("Mínimo 2 caracteres");
      }

      if (data.doctorName === "") {
        setDoctorNameMessage("Se requiere nombre");
      }
      if (data.doctorName.length > 25) {
        setDoctorNameMessage("Máximo 25 caracteres");
      }
    } else {
      setDoctorNameErrorMessage(false);
    }
    // Validate lastNameDoctor
    if (
      !nameRegex.test(data.doctorLastName) ||
      data.doctorLastName.length > 25 ||
      data.doctorLastName.length < 2
    ) {
      setDoctorLastNameErrorMessage(true);
      setDoctorLastNameMessage("Sólo se permiten letras");
      if (spaceCount(data.doctorLastName) > 2) {
        setDoctorLastNameMessage("Máximo 2 espacios");
      }
      if (data.doctorLastName.length < 2 && data.doctorLastName.length > 0) {
        setDoctorLastNameMessage("Mínimo 2 caracteres");
      }

      if (data.doctorLastName === "") {
        setDoctorLastNameMessage("Se requiere apellido");
      }
      if (data.doctorLastName.length > 25) {
        setDoctorLastNameMessage("Máximo 25 caracteres");
      }
      hasError = true;
    } else {
      setDoctorLastNameErrorMessage(false);
    }
    // Validate doctor rut
    if (
      !validateRut(data.doctorRut) ||
      !ChileanRutify.validRut(data.doctorRut) ||
      data.doctorRut.length > 10 ||
      data.doctorRut.length < 7
    ) {
      setDoctorRutErrorMessage(true);
      if (data.patientRut.length > 10) {
        setDoctorRutMessage("Máximo 10 caracteres");
      }

      if (!ChileanRutify.validRut(data.patientRut)) {
        setDoctorRutMessage("Rut inválido");
      }
      const hasDot = data.doctorRut.includes(".");
      const hasHyphen = data.doctorRut.includes("-");
      if (hasDot || !hasHyphen) {
        setDoctorRutMessage("Rut debe ser sin puntos y con guión");
      }
      if (data.patientRut.length < 7 && data.patientRut.length > 0) {
        setDoctorRutMessage("Mínimo 7 caracteres");
      }
      if (data.doctorRut === "") {
        setDoctorRutMessage("Se requiere rut");
      }
      hasError = true;
    } else {
      setDoctorRutErrorMessage(false);
    }
    // Validate workType
    if (
      data.workType !== 1 &&
      data.workType !== 2 &&
      data.workType !== 3 &&
      data.workType !== 4 &&
      data.workType !== 5 &&
      data.workType !== "1" &&
      data.workType !== "2" &&
      data.workType !== "3" &&
      data.workType !== "4" &&
      data.workType !== "5"
    ) {
      setWorkTypeErrorMessage(true);
      hasError = true;
    } else {
      setWorkTypeErrorMessage(false);
    }
    // Validate prothesis
    if (
      data.prothesis !== 1 &&
      data.prothesis !== 2 &&
      data.prothesis !== 3 &&
      data.prothesis !== "1" &&
      data.prothesis !== "2" &&
      data.prothesis !== "3"
    ) {
      setProthesisErrorMessage(true);
      hasError = true;
    } else {
      setProthesisErrorMessage(false);
    }
    // Validate completitude
    if (
      data.completitude !== 1 &&
      data.completitude !== 2 &&
      data.completitude !== "1" &&
      data.completitude !== "2"
    ) {
      setCompletitudeErrorMessage(true);
      hasError = true;
    } else {
      setCompletitudeErrorMessage(false);
    }
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

    if (!validStages.includes(data.stage)) {
      setStageErrorMessage(true);
      hasError = true;
    } else {
      setStageErrorMessage(false);
    }
    // Validate colors
    const validColors = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ];

    if (!validColors.includes(data.color)) {
      setColorErrorMessage(true);
      hasError = true;
    } else {
      setColorErrorMessage(false);
    }
    // Validate location
    const validLocations = [1, 2, "1", "2"];

    if (!validLocations.includes(data.location)) {
      setLocationErrorMessage(true);
      hasError = true;
    } else {
      setLocationErrorMessage(false);
    }
    // Validate indications
    if (data.indications.length > 255) {
      setIndicationsErrorMessage(true);
      setIndicationsMessage("Indicación muy larga");
      hasError = true;
    } else {
      setIndicationsErrorMessage(false);
    }
    // Validate billings
    const validBillings = [1, 2, "1", "2"];

    if (!validBillings.includes(data.billing)) {
      setBillingErrorMessage(true);
      hasError = true;
    } else {
      setBillingErrorMessage(false);
    }
    // Validate billingDate
    const selectedBillingDate = new Date(data.billingDate);
    const minBillingDate = new Date("2017-01-01");
    const maxDate = new Date();
    const maxBillingDate = maxDate.setMonth(maxDate.getMonth() + 6);
    if (
      selectedBillingDate < minBillingDate ||
      selectedBillingDate > maxBillingDate ||
      data.billingDate === ""
    ) {
      if (data.billingDate === "") {
        setBillingDateMessage("Fecha de facturación requerida");
      } else {
        setBillingDateMessage(
          "Debe ser del 2017 hasta hasta los próximos 6 meses"
        );
      }
      setBillingDateErrorMessage(true);
      hasError = true;
    } else {
      setBillingDateErrorMessage(false);
    }
    // Validate licence
    const validLicences = [1, "1"];

    if (!validLicences.includes(data.licence)) {
      setLicenceErrorMessage(true);
      hasError = true;
    } else {
      setLicenceErrorMessage(false);
    }
    // Check if any required fields are empty
    if (
      data.creationDate === "" ||
      data.fileNumber === "" ||
      data.patientName === "" ||
      data.patientLastName === "" ||
      data.patientRut === "" ||
      data.patientBirthDate === "" ||
      data.medicalCenter === "" ||
      data.doctorName === "" ||
      data.doctorLastName === "" ||
      data.doctorRut === "" ||
      data.workType === "" ||
      data.prothesis === "" ||
      data.completitude === "" ||
      data.stage === "" ||
      data.color === "" ||
      data.location === "" ||
      data.billing === "" ||
      data.billingDate === "" ||
      data.licence === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }
    axios
      .post("http://localhost:8081/api/ordenes/", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then(() => {
        let timerInterval;
        swalCreated.fire({
          title: "Orden creada",
          timer: 3000,
          timerProgressBar: true,
          confirmButtonText: "Cerrar",
          willClose: () => {
            clearInterval(timerInterval);
            navigate("/orders");
          },
        });
      })
      .catch((error) => {
        if (error.response.data.message.error === "orden existente") {
          swalCreated.fire({
            title: "Error",
            text: error.response.data.message.message,
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        } else {
          swalCreated.fire({
            title: "Error",
            text: "Error al crear la orden",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }
      });
  };

  const handleDoctor = () => {
    refClearDoctorName.current.value = "";
    refClearDoctorLastName.current.value = "";
    refDoctorLastName.value = doctorData.apellido;
    refDoctorName.value = doctorData.nombre;
  };

  useEffect(() => {
    const validateRut = (rut) => {
      const rutRegex = /^\d{1,8}-[\dk]$/;
      return rutRegex.test(rut);
    };
    if (
      !validateRut(data.doctorRut) ||
      !ChileanRutify.validRut(data.doctorRut) ||
      data.doctorRut.length > 10 ||
      data.doctorRut.length < 7
    ) {
      setDoctorExists(false);
      setDoctorData({
        ...data,
        nombre: "",
        apellido: "",
      });
    } else {
      axios
        .get(`http://localhost:8081/api/relatedUserDoctor/${data.doctorRut}`)
        .then((response) => {
          setDoctorExists(true);
          setDoctorData({
            ...data,
            nombre: response.data.data.name,
            apellido: response.data.data.lastName,
          });
          setData({
            ...data,
            doctorName: "",
            doctorLastName: "",
          });
          handleDoctor();
        })
        .catch(() => {
          return;
        });
    }
  }, [data.doctorRut]);

  const handlePatient = () => {
    refClearPatientName.current.value = "";
    refClearPatientLastName.current.value = "";
    refPatientLastName.value = patientData.apellido;
    refPatientName.value = patientData.nombre;
  };

  useEffect(() => {
    const validateRut = (rut) => {
      const rutRegex = /^\d{1,8}-[\dk]$/;
      return rutRegex.test(rut);
    };
    if (
      !validateRut(data.patientRut) ||
      !ChileanRutify.validRut(data.patientRut) ||
      data.patientRut.length > 10 ||
      data.patientRut.length < 7
    ) {
      setPatientExists(false);
      setPatientData({
        ...data,
        nombre: "",
        apellido: "",
      });
    } else {
      axios
        .get(`http://localhost:8081/api/relatedUserPatient/${data.patientRut}`)
        .then((response) => {
          setPatientExists(true);
          setPatientData({
            ...data,
            nombre: response.data.data.name,
            apellido: response.data.data.lastName,
            fecha_nacimiento: response.data.data.birthDate
              ? response.data.data.birthDate.split("T")[0]
              : new Date(),
          });
          setData({
            ...data,
            patientName: response.data.data.name,
            patientLastName: response.data.data.lastName,
            patientBirthDate: "",
          });
          handlePatient();
          handleBirthDate();
        })
        .catch(() => {
          return;
        });
    }
  }, [data.patientRut]);

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border w-75">
      <h2>Crear nueva orden</h2>
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
          <label htmlFor="inputCreationDate" className="form-label">
            Fecha de creación *
          </label>
          <input
            type="date"
            className="form-control"
            id="inputCreationDate"
            autoComplete="off"
            onChange={(e) => setData({ ...data, creationDate: e.target.value })}
          />
          {creationDateErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{creationDateMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputFileNumber" className="form-label">
            Número de ficha *
          </label>
          <input
            type="text"
            className="form-control"
            id="inputFileNumber"
            placeholder="Ingrese número de ficha"
            autoComplete="off"
            onChange={(e) => setData({ ...data, fileNumber: e.target.value })}
          />
          {fileNumberErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{fileNumberMessage}</span>
              </div>
            </div>
          )}
        </div>
        {patientExists ? (
          <>
            <div className="col-12 col-md-6">
              <label htmlFor="inputPatientName" className="form-label">
                Nombre del paciente *
              </label>
              <input
                ref={refPatientName}
                type="text"
                className="form-control"
                id="inputPatientNameExists"
                autoComplete="off"
                disabled
                placeholder={patientData.nombre}
              />
              {patientNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{patientNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="inputPatientLastName" className="form-label">
                Apellido del paciente *
              </label>
              <input
                ref={refPatientLastName}
                type="text"
                className="form-control"
                id="inputPatientLastNameExists"
                autoComplete="off"
                disabled
                placeholder={patientData.apellido}
              />
              {patientLastNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{patientLastNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="col-12 col-md-6">
              <label htmlFor="inputPatientName" className="form-label">
                Nombre del paciente *
              </label>
              <input
                ref={refClearPatientName}
                type="text"
                className="form-control"
                id="inputPatientName"
                placeholder="Ingrese nombre"
                autoComplete="off"
                onChange={(e) =>
                  setData({ ...data, patientName: e.target.value })
                }
              />
              {patientNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{patientNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="inputPatientLastName" className="form-label">
                Apellido del paciente *
              </label>
              <input
                ref={refClearPatientLastName}
                type="text"
                className="form-control"
                id="inputPatientLastName"
                placeholder="Ingrese apellido"
                autoComplete="off"
                onChange={(e) =>
                  setData({ ...data, patientLastName: e.target.value })
                }
              />
              {patientLastNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{patientLastNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="col-12 col-md-6">
          <label htmlFor="inputPatientRut" className="form-label">
            Rut Paciente *
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            placeholder="Ingrese rut"
            autoComplete="off"
            onChange={(e) =>
              setData({
                ...data,
                patientRut: e.target.value,
              })
            }
          />
          {patientRutErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{patientRutMessage}</span>
              </div>
            </div>
          )}
        </div>
        {patientExists ? (
          <div className="col-12 col-md-6">
            <label htmlFor="inputBirthDatePatient" className="form-label">
              Fecha nacimiento Paciente *
            </label>
            <input
              type="date"
              className="form-control"
              id="inputBirthDatePatient"
              placeholder="Ingresar fecha de nacimiento"
              autoComplete="off"
              value={patientData.fecha_nacimiento || ""}
              onChange={(e) =>
                setPatientData({
                  ...patientData,
                  fecha_nacimiento: e.target.value,
                })
              }
              disabled // Set the input as readOnly instead of disabled
            />
            {patientBirthDateErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{patientBirthDateMessage}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="col-12 col-md-6">
            <label htmlFor="inputBirthDatePatient" className="form-label">
              Fecha nacimiento Paciente *
            </label>
            <input
              type="date"
              className="form-control"
              id="inputBirthDatePatient"
              placeholder="Ingresar fecha de nacimiento"
              autoComplete="off"
              value={data.patientBirthDate || ""}
              onChange={(e) =>
                setData({ ...data, patientBirthDate: e.target.value })
              }
            />
            {patientBirthDateErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{patientBirthDateMessage}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {doctorExists ? (
          <>
            <div className="col-12 col-md-6">
              <label htmlFor="inputNameDoctor" className="form-label">
                Nombre Doctor *
              </label>
              <input
                ref={refDoctorName}
                type="text"
                className="form-control"
                id="inputNameDoctorExists"
                autoComplete="off"
                disabled
                placeholder={doctorData.nombre}
              />
              {doctorNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{doctorNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="inputLastNameDoctor" className="form-label">
                Apellido Doctor *
              </label>
              <input
                ref={refDoctorLastName}
                type="text"
                className="form-control"
                id="inputLastNameDoctorExists"
                placeholder={doctorData.apellido}
                autoComplete="off"
                disabled
              />
              {doctorLastNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{doctorLastNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="col-12 col-md-6">
              <label htmlFor="inputNameDoctor" className="form-label">
                Nombre Doctor *
              </label>
              <input
                ref={refClearDoctorName}
                type="text"
                className="form-control"
                id="inputNameDoctorNotExists"
                placeholder="Ingrese Nombre"
                autoComplete="off"
                onChange={(e) =>
                  setData({ ...data, doctorName: e.target.value })
                }
              />
              {doctorNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{doctorNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="inputLastNameDoctor" className="form-label">
                Apellido Doctor *
              </label>
              <input
                ref={refClearDoctorLastName}
                type="text"
                className="form-control"
                id="inputLastNameDoctorNotExists"
                placeholder="Ingrese Apellido"
                autoComplete="off"
                onChange={(e) =>
                  setData({ ...data, doctorLastName: e.target.value })
                }
              />
              {doctorLastNameErrorMessage && (
                <div className="col-12">
                  <div className="error">
                    <span>{doctorLastNameMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <div className="col-12 col-md-6">
          <label htmlFor="inputRutDoctor" className="form-label">
            Rut Doctor *
          </label>
          <input
            type="text"
            className="form-control"
            id="inputRutDoctor"
            placeholder="11111111-1"
            autoComplete="off"
            onChange={(e) => setData({ ...data, doctorRut: e.target.value })}
          />
          {doctorRutErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{doctorRutMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputMedicalCenter" className="form-label">
            Centro Médico *
          </label>
          <select
            className="form-select "
            onChange={(e) =>
              setData({ ...data, medicalCenter: e.target.value })
            }
          >
            <option value=""></option>
            <option value="1">Hospital Barros Luco</option>
            <option value="2">Hospital Del Salvador</option>
            <option value="3">Hospital Metropolitano</option>
          </select>
          {medicalCenterErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione un centro médico válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputWorkType" className="form-label">
            Tipo de trabajo *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, workType: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Acrilica</option>
            <option value="2">Metálica</option>
            <option value="3">Reparación</option>
            <option value="4">Antagonista</option>
            <option value="5">Repetición</option>
          </select>
          {workTypeErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione un trabajo válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputProthesis" className="form-label">
            Protesis *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, prothesis: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Superior</option>
            <option value="2">Inferior</option>
            <option value="3">Ambas</option>
          </select>
          {prothesisErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione una protesis válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputCompletitude" className="form-label">
            Completitud *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, completitude: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Total</option>
            <option value="2">Parcial</option>
          </select>
          {completitudeErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione una completitud válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputStage" className="form-label">
            Etapa inicial *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, stage: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Cubeta</option>
            <option value="2">Modelo</option>
            <option value="3">Placa Relación</option>
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
          <label htmlFor="inputColor" className="form-label">
            Color *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, color: e.target.value })}
          >
            <option value=""></option>
            <option value="1">A1</option>
            <option value="2">A2</option>
            <option value="3">A3</option>
            <option value="4">A3.5</option>
            <option value="5">A4</option>
            <option value="6">B1</option>
            <option value="7">B2</option>
            <option value="8">B3</option>
            <option value="9">B4</option>
            <option value="10">C1</option>
            <option value="11">C2</option>
            <option value="12">C3</option>
            <option value="13">C4</option>
            <option value="14">D2</option>
            <option value="15">D3</option>
            <option value="16">D4</option>
          </select>
          {colorErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione un color válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLocation" className="form-label">
            Ubicacion *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, location: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Laboratorio</option>
            <option value="2">Hospital</option>
          </select>
          {locationErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione una ubicación válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputIndications" className="form-label">
            Indicaciones
          </label>
          <input
            type="text"
            className="form-control"
            id="inputIndications"
            placeholder="Ingresar indicaciones"
            autoComplete="off"
            onChange={(e) => setData({ ...data, indications: e.target.value })}
          />
          {indicationsErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{indicationsMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputBill" className="form-label">
            Factura *
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, billing: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Exenta</option>
            <option value="2">Electronica Exenta</option>
          </select>
          {billingErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione una factura válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputBillingDate" className="form-label">
            Fecha de facturación *
          </label>
          <input
            type="date"
            className="form-control"
            id="inputBillingDate"
            autoComplete="off"
            onChange={(e) => setData({ ...data, billingDate: e.target.value })}
          />
          {billingDateErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>{billingDateMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLicence" className="form-label">
            Licencia *
          </label>
          <select
            className="form-select"
            onChange={(e) => setData({ ...data, licence: e.target.value })}
          >
            <option value=""></option>
            <option value="1">2069-67-LP18</option>
          </select>
          {licenceErrorMessage && (
            <div className="col-12">
              <div className="error">
                <span>Seleccione una licencia válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3">
          <button type="submit" className="btn btn-success w-100">
            Crear orden
          </button>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <button
            className="btn btn-danger w-100 btn-secondary"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;
