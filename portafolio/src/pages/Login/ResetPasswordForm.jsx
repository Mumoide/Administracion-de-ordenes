import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertComponent";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPasswordForm() {
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [passErrorMessage, setPassErrorMessage] = useState(false);
  const [passMessage, setPassMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassErrorMessage, setConfirmPassErrorMessage] = useState(false);
  const [confirmPassMessage, setConfirmPassMessage] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const navigate = useNavigate();

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

  const notifyError = (mensaje) =>
    toast.warn(mensaje, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Error handler
    let hasError = false;

    if (
      password.length < 8 ||
      password !== confirmPassword ||
      password.length > 50
    ) {
      setPassErrorMessage(true);

      if (password.length < 8) {
        setPassMessage("Mínimo 8 caracteres");
      }

      if (password.length > 50) {
        setPassMessage("Máximo 50 caracteres");
      }
      if (password === "") {
        setPassMessage("Se requiere contraseña");
      }
      if (password !== confirmPassword) {
        setPassMessage("Contraseñas no coinciden");
        hasError = true;
      }
      hasError = true;
    } else {
      setPassErrorMessage(false);
    }

    // Validate confirmPassword

    if (
      confirmPassword.length < 8 ||
      password !== confirmPassword ||
      confirmPassword.length > 50
    ) {
      setConfirmPassErrorMessage(true);
      hasError = true;
      if (confirmPassword.length < 8) {
        setConfirmPassMessage("Mínimo 8 caracteres");
      }
      if (confirmPassword.length > 50) {
        setConfirmPassMessage("Máximo 50 caracteres");
      }
      if (confirmPassword === "") {
        setConfirmPassMessage("Se requiere confirmar");
      }
      if (password !== confirmPassword) {
        setConfirmPassMessage("Contraseñas no coinciden");
      }
    } else {
      setConfirmPassErrorMessage(false);
    }

    // Check if any required fields are empty
    if (password === "" || confirmPassword === "") {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/resetPassword/",
        {
          email,
          token,
          password,
        }
      );
      let timerInterval;
      swalCreated.fire({
        title: response.data.message,
        timer: 5000,
        timerProgressBar: true,
        confirmButtonText: "Cerrar",
        width: "40rem",
        padding: "3rem",
        willClose: () => {
          clearInterval(timerInterval);
          navigate("/Login");
        },
      });
    } catch (error) {
      notifyError(error.response.data.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 recoveryPage">
      <div className="row p-3 border col-8 col-md-7 col-lg-5 col-xl-4 resetPassCard">
        <div className="col-12 d-flex justify-content-center mb-4">
          <img src="../../logolab_original_texto.png" alt="Logo" height="115" />
        </div>
        <div className="col-12 d-flex justify-content-center mb-4">
          <h2>Cambiar contraseña</h2>
          {emptyFieldsMessage && (
            <AlertComponent
              emptyFieldsMessage={emptyFieldsMessage}
              handleCloseEmpty={handleCloseEmpty}
            />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="col-12">
            <div className="d-flex justify-content-center">
              <div className="col-10 col-md-6 col-lg-7">
                <label htmlFor="inputPass" className="form-label recoveryLabel">
                  Nueva contraseña
                </label>
                <input
                  className="form-control mb-2"
                  type="password"
                  placeholder="Ingrese la nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passErrorMessage && (
                  <div className="col-12">
                    <div className="error">
                      <span>{passMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-10 col-md-6 col-lg-7">
                <label
                  htmlFor="inpuConfirmPass"
                  className="form-label recoveryLabel"
                >
                  Confirmar nueva contraseña
                </label>
                <input
                  className="form-control mb-2"
                  type="password"
                  placeholder="Confirme la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassErrorMessage && (
                  <div className="col-12">
                    <div className="error">
                      <span>{confirmPassMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-10 col-md-6 col-lg-7">
                <button type="submit" className="recoveryButton w-100">
                  Cambiar contraseña
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-10 col-md-6 col-lg-7 justify-content-center d-flex">
                <text
                  onClick={() => navigate("/Login")}
                  className="recoveryBackButton"
                >
                  Volver al inicio
                </text>
              </div>
            </div>
          </div>
        </form>
      </div>
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
        theme="light"
        toastStyle={{ color: "black" }}
      />
    </div>
  );
}

export default ResetPasswordForm;
