import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChileanRutify from "chilean-rutify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertComponent from "../../components/AlertComponent";
import { DotSpinner } from "@uiball/loaders";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faKey,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

function EditUser() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    lastName: "",
    rut: "",
    email: "",
    birthDate: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
    image: "",
    phone: "",
  });
  const [name, setName] = useState({ name: "", lastName: "" });
  const [nameMessage, setNameMessage] = useState("");
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [rutMessage, setRutMessage] = useState("");
  const [passErrorMessage, setPassErrorMessage] = useState(false);
  const [passMessage, setPassMessage] = useState("");
  const [confirmPassErrorMessage, setConfirmPassErrorMessage] = useState(false);
  const [confirmPassMessage, setConfirmPassMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [parsedDate, setParsedDate] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(false);
  const [lastNameMessage, setLastNameMessage] = useState("");
  const [birthDateErrorMessage, setBirthDateErrorErrorMessage] =
    useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [roleErrorMessage, setRoleErrorMessage] = useState(false);
  const [rutErrorMessage, setRutErrorMessage] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");

  const notify = () =>
    toast.warn(
      "Archivo invalido, debe seleccionar una imagen de formato JPG, PNG o JPEG.",
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );

  const notifyError = (mensaje) =>
    toast.error(mensaje, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: { backgroundColor: "#ACACAC", color: "#7C0000" },
    });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleInputPasswordVisibility = () => {
    setShowPasswordInputs(!showPasswordInputs);
  };

  const swalEdited = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/persona/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        const retrievedDate = new Date(res.data.data.birthDate);
        retrievedDate.setDate(retrievedDate.getDate() - 1);
        setData({
          ...data,
          name: res.data.data.name,
          lastName: res.data.data.lastName,
          rut: res.data.data.rut,
          email: res.data.data.email,
          birthDate: retrievedDate,
          address: res.data.data.adress ? res.data.data.adress : "",
          role: res.data.data.nombre_rol,
          phone: res.data.data.phone
            ? res.data.data.phone.replace("+56", "")
            : "",
        });
        setName({
          name: res.data.data.name,
          lastName: res.data.data.lastName,
        });
        setDataLoaded(true);
      })
      .catch(() => {
        navigate("/UsuarioNoEncontrado");
      });
  }, []);

  useEffect(() => {
    const inputDate = new Date(data.birthDate);
    inputDate.setDate(inputDate.getDate() + 1);
    const MyDateStringFormatted =
      inputDate.getFullYear() +
      "-" +
      ("0" + (inputDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + inputDate.getDate()).slice(-2);
    setParsedDate(MyDateStringFormatted);
  }, [data.birthDate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Error handler
    let hasError = false;
    // Validate Name
    const spaceCount = (string) => string.split(" ").length - 1;
    const nameRegex = /^[A-Za-zÀ-ÿ]*(?:\s[A-Za-zÀ-ÿ]*){0,2}$/;
    if (
      !nameRegex.test(data.name) ||
      data.name.length > 25 ||
      data.name === "" ||
      data.name.length < 2
    ) {
      setNameErrorMessage(true);
      setNameMessage("Sólo se permiten letras");
      if (spaceCount(data.name) > 1) {
        setNameMessage("Máximo 1 espacio");
      }
      if (data.name.length < 2) {
        setNameMessage("Mínimo 2 carácteres");
      }
      if (data.name === "") {
        setNameMessage("Se requiere nombre");
      }
      if (data.name.length > 25) {
        setNameMessage("Máximo 25 carácteres");
      }
      hasError = true;
    } else {
      setNameErrorMessage(false); // Reset the error state to false
    }
    // Validate lastName
    if (
      !nameRegex.test(data.lastName) ||
      data.lastName.length > 25 ||
      data.lastName === "" ||
      data.lastName.length < 2
    ) {
      setLastNameErrorMessage(true);
      setLastNameMessage("Sólo se permiten letras");
      if (spaceCount(data.lastName) > 1) {
        setLastNameMessage("Máximo 1 espacio");
      }
      if (data.lastName.length < 2) {
        setLastNameMessage("Mínimo 2 carácteres");
      }
      if (data.lastName === "") {
        setLastNameMessage("Se requiere nombre");
      }
      if (data.lastName.length > 25) {
        setLastNameMessage("Máximo 25 carácteres");
      }
      hasError = true;
    } else {
      setLastNameErrorMessage(false);
    }
    // Validate rut
    const validateRut = (rut) => {
      const rutRegex = /^\d{1,8}-[\dk]$/;
      return rutRegex.test(rut);
    };
    if (!validateRut(data.rut) || !ChileanRutify.validRut(data.rut)) {
      setRutErrorMessage(true);
      setRutMessage("Rut invalido");
      const hasDot = data.rut.includes(".");
      const hasHyphen = data.rut.includes("-");
      if (hasDot || !hasHyphen) {
        setRutMessage("Rut debe ser sin puntos y con guión");
      }
      if (data.rut === "") {
        setRutMessage("");
      }
      hasError = true;
    } else {
      setRutErrorMessage(false);
    }
    // Validate email
    if (data.email.length > 100 || data.email === "") {
      setEmailErrorMessage(true);
      if (data.email === "") {
        setEmailMessage("Se requiere email");
      } else {
        setEmailMessage("Máximo 100 caracteres");
      }
      hasError = true;
    } else {
      setEmailErrorMessage(false);
    }
    // Validate address
    if (data.address.length > 100) {
      setAddressErrorMessage(true);
      setAddressMessage("Máximo 100 caracteres");
      hasError = true;
    } else {
      setAddressErrorMessage(false);
    }
    // Validate birth date
    const currentDate = new Date();
    const selectedDate = new Date(data.birthDate);
    const minDate = new Date("1900-01-01");
    if (selectedDate < minDate || selectedDate > currentDate) {
      setBirthDateErrorErrorMessage(true);
      hasError = true;
    } else {
      setBirthDateErrorErrorMessage(false);
    }
    // Validate passwords
    if (showPasswordInputs) {
      if (
        data.password.length < 8 ||
        data.password !== data.confirmPassword ||
        data.password.length > 50
      ) {
        setPassErrorMessage(true);
        hasError = true;
        if (data.password === "") {
          setPassMessage("Se requiere contraseña");
        }
        if (data.password.length < 8) {
          setPassMessage("Mínimo 8 caracteres");
        }
        if (data.password.length > 50) {
          setPassMessage("Máximo 50 caracteres");
        }
        if (data.password !== data.confirmPassword) {
          setPassMessage("Contraseñas no coinciden");
        }
        hasError = true;
      } else {
        setPassErrorMessage(false);
      }
    } else {
      setPassErrorMessage(false);
    }

    // Validate confirmPassword
    if (showPasswordInputs) {
      if (
        data.confirmPassword.length < 8 ||
        data.password !== data.confirmPassword ||
        data.confirmPassword.length > 50
      ) {
        setConfirmPassErrorMessage(true);
        hasError = true;
        if (data.confirmPassword === "") {
          setConfirmPassMessage("Se requiere confirmar");
        }
        if (data.confirmPassword.length < 8) {
          setConfirmPassMessage("Mínimo 8 caracteres");
        }
        if (data.confirmPassword.length > 50) {
          setConfirmPassMessage("Máximo 50 caracteres");
        }
        if (data.password !== data.confirmPassword) {
          setConfirmPassMessage("Contraseñas no coinciden");
        }
      } else {
        setConfirmPassErrorMessage(false);
      }
    } else {
      setConfirmPassErrorMessage(false);
    }

    // Validate role
    if (
      data.role !== "1" &&
      data.role !== "2" &&
      data.role !== 1 &&
      data.role !== 2
    ) {
      setRoleErrorMessage(true);
      hasError = true;
    } else {
      setRoleErrorMessage(false);
    }
    // Validate phone
    const phoneRegex = /^[0-9]*$/;
    const phoneRegexFormat = /^(?:[29][0-9]+)?$/;
    if (
      data.phone.length > 9 ||
      (data.phone.length < 9 && data.phone.length > 0) ||
      !phoneRegex.test(data.phone) ||
      !phoneRegexFormat.test(data.phone)
    ) {
      setPhoneErrorMessage(true);
      if (!phoneRegexFormat.test(data.phone)) {
        setPhoneMessage("Debe comenzar con 2 o 9");
      }
      if (data.phone.length > 9) {
        setPhoneMessage("Deben ser 9 dígitos");
      } else if (data.phone.length < 9) {
        setPhoneMessage("Deben ser 9 dígitos");
      }
      if (!phoneRegex.test(data.phone)) {
        setPhoneMessage("Sólo se permiten números");
      }
      hasError = true;
    } else {
      setPhoneErrorMessage(false);
    }
    // Check if any required fields are empty
    if (
      data.name === "" ||
      data.lastName === "" ||
      data.rut === "" ||
      data.email === "" ||
      data.role === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }
    if (typeof data.birthDate === "object") {
      const inputDate = new Date(data.birthDate);
      inputDate.setDate(inputDate.getDate() + 1);
      const date = new Date(inputDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      // Update the data object with the formatted birthDate
      const updatedData = {
        ...data,
        birthDate: formattedDate,
      };
      const formdata = new FormData();
      formdata.append("name", updatedData.name);
      formdata.append("lastName", updatedData.lastName);
      formdata.append("rut", updatedData.rut);
      formdata.append("email", updatedData.email);
      formdata.append("birthDate", updatedData.birthDate);
      formdata.append("address", updatedData.address);
      formdata.append("phone", data.phone ? `+56${data.phone}` : "");
      formdata.append("password", updatedData.password);
      formdata.append("confirmPassword", updatedData.confirmPassword);
      formdata.append("role", updatedData.role);
      formdata.append("image", updatedData.image);
      // Make the axios.put request with the updatedData
      if (showPasswordInputs) {
        axios
          .put("http://localhost:8081/api/persona/" + id, formdata, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((res) => {
            if (res.data.Status === "Success") {
              let timerInterval;
              swalEdited.fire({
                title: "Usuario modificado",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonText: "Cerrar",
                willClose: () => {
                  clearInterval(timerInterval);
                  navigate("/users");
                },
              });
            }
          })
          .catch((err) => {
            if (
              err.response.data.error === "El email proporcionado ya existe."
            ) {
              notifyError(
                `Ya existe el correo ${data.email}, debe ingresar un correo distinto.`
              );
            }
            if (
              err.response.status === 400 &&
              err.response.data.error ===
                "Only JPEG, JPG, and PNG files are allowed"
            ) {
              notify();
            }
          });
      } else {
        axios
          .put("http://localhost:8081/api/personaNoPass/" + id, formdata, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((res) => {
            if (res.data.Status === "Success") {
              let timerInterval;
              swalEdited.fire({
                title: "Usuario modificado",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonText: "Cerrar",
                willClose: () => {
                  clearInterval(timerInterval);
                  navigate("/users");
                },
              });
            }
          })
          .catch((err) => {
            if (
              err.response.data.error === "El email proporcionado ya existe."
            ) {
              notifyError(
                `Ya existe el correo ${data.email}, debe ingresar un correo distinto.`
              );
            }
            if (
              err.response.status === 400 &&
              err.response.data.error ===
                "Only JPEG, JPG, and PNG files are allowed"
            ) {
              notify();
            } else {
              console.log(err.response);
            }
          });
      }
    } else {
      // If the birthDate is not an object, make the axios.put request with the original data
      const formdata = new FormData();
      formdata.append("name", data.name);
      formdata.append("lastName", data.lastName);
      formdata.append("rut", data.rut);
      formdata.append("email", data.email);
      formdata.append("birthDate", data.birthDate);
      formdata.append("address", data.address);
      formdata.append("phone", data.phone ? `+56${data.phone}` : "");
      formdata.append("password", data.password);
      formdata.append("confirmPassword", data.confirmPassword);
      formdata.append("role", data.role);
      formdata.append("image", data.image);
      if (showPasswordInputs) {
        axios
          .put("http://localhost:8081/api/persona/" + id, formdata, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((res) => {
            if (res.data.Status === "Success") {
              let timerInterval;
              swalEdited.fire({
                title: "Usuario modificado",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonText: "Cerrar",
                willClose: () => {
                  clearInterval(timerInterval);
                  navigate("/users");
                },
              });
            }
          })
          .catch((err) => {
            if (
              err.response.data.error === "El email proporcionado ya existe."
            ) {
              notifyError(
                `Ya existe el correo ${data.email}, debe ingresar un correo distinto.`
              );
            }
            if (
              err.response.status === 400 &&
              err.response.data.error ===
                "Only JPEG, JPG, and PNG files are allowed"
            ) {
              notify();
            } else {
              console.log(err.response);
            }
          });
      } else {
        axios
          .put("http://localhost:8081/api/personaNoPass/" + id, formdata, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((res) => {
            if (res.data.Status === "Success") {
              let timerInterval;
              swalEdited.fire({
                title: "Usuario modificado",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonText: "Cerrar",
                willClose: () => {
                  clearInterval(timerInterval);
                  navigate("/users");
                },
              });
            }
          })
          .catch((err) => {
            if (
              err.response.data.error === "El email proporcionado ya existe."
            ) {
              notifyError(
                `Ya existe el correo ${data.email}, debe ingresar un correo distinto.`
              );
            }
            if (
              err.response.status === 400 &&
              err.response.data.error ===
                "Only JPEG, JPG, and PNG files are allowed"
            ) {
              notify();
            }
          });
      }
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
      <h2>
        Edición de usuario: {name.name} {name.lastName}
      </h2>
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
            <label htmlFor="inputName" className="form-label">
              Nombre *
            </label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Juan"
              autoComplete="off"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              value={data.name}
            />
            {nameErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{nameMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputLastName" className="form-label">
              Apellido *
            </label>
            <input
              type="text"
              className="form-control"
              id="inputLastName"
              placeholder="Perez"
              autoComplete="off"
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              value={data.lastName}
            />
            {lastNameErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{lastNameMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputRut" className="form-label">
              Rut *
            </label>
            <input
              type="text"
              className="form-control"
              id="inputRut"
              placeholder="11.111.111-1"
              autoComplete="off"
              value={data.rut}
              disabled
            />
            {rutErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{rutMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputEmail" className="form-label">
              Email *
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              placeholder="correo@gmail.com"
              autoComplete="off"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              value={data.email}
            />
            {emailErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{emailMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputBirthDate" className="form-label">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className="form-control"
              id="inputBirthDate"
              placeholder="Ingresar fecha de nacimiento"
              autoComplete="off"
              onChange={(e) => setData({ ...data, birthDate: e.target.value })}
              value={parsedDate}
            />
            {birthDateErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>Fecha inválida </span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputAddress" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="Ingresar dirección"
              autoComplete="off"
              onChange={(e) => setData({ ...data, address: e.target.value })}
              value={data.address}
            />
            {addressErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{addressMessage}</span>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary mt-3 col-12 col-md-6"
            onClick={toggleInputPasswordVisibility}
            style={{ minWidth: "120px" }}
          >
            {showPasswordInputs ? "Cancelar cambio" : "Cambiar contraseña"}{" "}
            <FontAwesomeIcon icon={showPasswordInputs ? faLock : faKey} />
          </button>
          <div className="col-0 col-md-6"></div>
          {showPasswordInputs && (
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label htmlFor="inputPassword" className="form-label">
                    Contraseña *
                  </label>
                  <div className="row">
                    <div className="col-12">
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="inputPassword"
                          placeholder="Ingresar contraseña"
                          autoComplete="off"
                          onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                          }
                        />
                        <span
                          className="input-group-text show-button"
                          onClick={togglePasswordVisibility}
                          id="basic-addon1"
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  {passErrorMessage && (
                    <div className="col-12">
                      <div className="error">
                        <span>{passMessage}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="inputConfirmPassword" className="form-label">
                    Confirmar Contraseña *
                  </label>
                  <div className="row">
                    <div className="col-12">
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="inputConfirmPassword"
                          placeholder="Re-ingresar contraseña"
                          autoComplete="off"
                          onChange={(e) =>
                            setData({
                              ...data,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <span
                          className="input-group-text show-button"
                          onClick={togglePasswordVisibility}
                          id="basic-addon1"
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  {confirmPassErrorMessage && (
                    <div className="col-12">
                      <div className="error">
                        <span>{confirmPassMessage}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="col-12 col-md-6">
            <label htmlFor="inputRole" className="form-label">
              Rol *
            </label>
            <select
              className="form-select mb-3"
              onChange={(e) => setData({ ...data, role: e.target.value })}
              value={data.role}
            >
              <option value="1">Administrador</option>
              <option value="2">Laboratorista</option>
            </select>
            {roleErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>Debe seleccionar un rol</span>
                </div>
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="inputPhone" className="form-label">
              Número telefónico
            </label>
            <div className="row">
              <div className="col-12">
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">
                    +56
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPhone"
                    placeholder="Ingresar número"
                    autoComplete="off"
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                    value={data.phone}
                  />
                </div>
              </div>
            </div>
            {phoneErrorMessage && (
              <div className="col-12">
                <div className="error">
                  <span>{phoneMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 offset-0 col-md-8 offset-md-2">
            <label htmlFor="inputFile" className="form-label">
              Foto de perfil
            </label>
            <input
              type="file"
              className="form-control"
              id="inputFile"
              onChange={(e) => setData({ ...data, image: e.target.files[0] })}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3">
            <button type="submit" className="btn btn-success w-100">
              Editar
            </button>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <button
              className="btn btn-danger w-100 btn-secondary"
              onClick={() => navigate("/users")}
            >
              Volver
            </button>
          </div>
        </form>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{ color: "black" }}
      />
    </div>
  );
}

export default EditUser;

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
  inputCode: {
    width: "60px",
  },
};
