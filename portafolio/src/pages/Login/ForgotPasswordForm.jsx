import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertComponent from "../../components/AlertComponent";

const ForgotPasswordForm = () => {
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const swalCreated = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const notifyError = (mensaje) =>
    toast.warn(mensaje, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // error handler
      let hasError = false;
      // Validate email
      if (email.length > 100 || email === "") {
        setEmailErrorMessage(true);
        if (email === "") {
          setEmailMessage("Se requiere email");
        } else {
          setEmailMessage("Máximo 100 caracteres");
        }
        hasError = true;
      } else {
        setEmailErrorMessage(false);
      }
      // Check if any required fields are empty
      if (email === "") {
        setEmptyFieldsMessage(true);
        return;
      }
      setEmptyFieldsMessage(false);
      if (hasError) {
        return;
      }

      const response = await axios.post(
        "http://localhost:8081/api/forgotPassword",
        { email }
      );
      let timerInterval;
      swalCreated.fire({
        title: response.data.message,
        text: "Revise su correo electrónico para restablecer su contraseña.",
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
      <div className="row p-3 border col-8 col-md-7 col-lg-5 col-xl-4 recoveryCard">
        <div className="col-12 d-flex justify-content-center mb-4">
          <img src="../../logolab_original_texto.png" alt="Logo" height="115" />
        </div>
        <div className="col-12 d-flex justify-content-center mb-4">
          <h2>Restablecer contraseña</h2>
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
              <div className="col-10 col-md-6 col-lg-7 mb-3">
                <label
                  htmlFor="inputDescription"
                  className="form-label recoveryLabel mb-3"
                >
                  Ingrese su email
                </label>
                <input
                  className="form-control mb-3"
                  type="email"
                  placeholder="nombre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailErrorMessage && (
                  <div className="col-12">
                    <div className="error">
                      <span>{emailMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-10 col-md-6 col-lg-7">
                <button type="submit" className="recoveryButton w-100">
                  Restablecer contraseña
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
};

export default ForgotPasswordForm;
