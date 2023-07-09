import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [getError, setGetError] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    let hasError = false;
    // validate email
    if (
      values.email === "" ||
      values.email.length > 100 ||
      values.email.length < 5
    ) {
      hasError = true;
      setEmailErrorMessage(true);
      if (values.email.length > 100) {
        setEmailMessage("Máximo 100 caracteres");
      }
      if (values.email.length < 5) {
        setEmailMessage("Mínimo 5 caracteres");
      }
      if (!values.email) {
        setEmailMessage("Se requiere correo electrónico");
      }
    } else {
      setEmailErrorMessage(false);
    }
    // validate password
    if (values.password.length < 8) {
      hasError = true;
      setPasswordErrorMessage(true);
      if (values.password.length < 8 || values.password.length > 50) {
        setPasswordMessage("Mínimo 8 caracteres");
      }
      if (values.password === "") {
        setPasswordMessage("Se requiere contraseña");
      }
      if (values.password > 50) {
        setPasswordMessage("Máximo 50 caracteres");
      }
    } else {
      setPasswordErrorMessage(false);
    }
    if (hasError) {
      setGetError(false);
      return;
    }
    axios
      .post("http://localhost:8081/api/login", values)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token); // Save the token in local storage
          navigate("/");
        } else {
          setGetError(false);
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          setGetError(true);
          setError(err.response.data.message);
        }
      });
  };

  return (
    <div className="d-flex justify-content-start align-items-center vh-100 loginPage flex-column">
      <div className="row p-3 rounded col-8 col-md-7 col-lg-6 col-xl-5 mb-5">
        <div className="col-12 d-flex justify-content-center mt-5">
          <img
            src="../../logolab_transparente_texto.png"
            alt="Logo"
            height="125"
          />
        </div>
      </div>
      <div className="row p-3 rounded border loginForm col-8 col-md-7 col-lg-6 col-xl-5">
        <h2>Ingresar</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Ingresar correo"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          {emailErrorMessage && (
            <div className="col-12 mb-2">
              <div className="error">
                <span>{emailMessage}</span>
              </div>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Contraseña</strong>
            </label>
            <input
              type="password"
              placeholder="Ingresar contraseña"
              name="password"
              className="form-control rounded-0"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          {passwordErrorMessage && (
            <div className="col-12 mb-3">
              <div className="error">
                <span>{passwordMessage}</span>
              </div>
            </div>
          )}
          {getError && <div className="error">{error && error}</div>}
          <div className="d-flex flex-column mx-auto align-items-center">
            <div className="col-12">
              <div className="row  d-flex justify-content-center">
                <div className="col-8 col-md-6">
                  <button
                    type="submit"
                    className="btn btn-success rounded-0 w-100"
                  >
                    Entrar
                  </button>
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mt-3 mt-md-0">
                  <a href="/forgotPassword" className="text-white">
                    Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
