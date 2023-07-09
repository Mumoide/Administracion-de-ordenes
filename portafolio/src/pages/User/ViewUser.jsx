import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { DotSpinner } from "@uiball/loaders";

function ViewUser() {
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
  const [parsedDate, setParsedDate] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

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
          address: res.data.data.adress,
          role: res.data.data.nombre_rol,
          phone: res.data.data.phone,
          imagen: res.data.data.imagen,
        });
        setName({
          name: res.data.data.name,
          lastName: res.data.data.lastName,
        });
        setDataLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        navigate("/UsuarioNoEncontrado");
      });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const inputDate = new Date(data.birthDate);
    inputDate.setDate(inputDate.getDate() + 1);
    const MyDateStringFormatted =
      ("0" + inputDate.getDate()).slice(-2) +
      "-" +
      ("0" + (inputDate.getMonth() + 1)).slice(-2) +
      "-" +
      inputDate.getFullYear();
    console.log(MyDateStringFormatted);
    setParsedDate(MyDateStringFormatted);
  }, [data.birthDate]);

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column mx-auto pt-2 mt-3 border w-75">
      {dataLoaded && (
        <div>
          <div className="d-flex flex-row row">
            <div className="d-flex flex-column align-items-center col-12">
              <img
                src={
                  data.imagen
                    ? `http://localhost:8081/images/${data.imagen}`
                    : "http://localhost:8081/images/default_picture.jpg"
                }
                alt=""
                className="viewUserImage"
              />
            </div>
            <div className="mt-3 d-flex col-12 justify-content-center title">
              <h2>
                {name.name} {name.lastName}
              </h2>
            </div>
          </div>
          <div className="d-flex flex-row row p-4">
            <div className="d-flex flex-row justify-content-center userTitle">
              Información del usuario:
            </div>
            <div className="d-flex m-2 col-12 justify-content-center userDetails">
              Rol:{" "}
              {data.role
                ? data.role === 1
                  ? "Administrador"
                  : "Laboratorista"
                : "Otro"}
            </div>
            <div className="d-flex m-2 col-12 justify-content-center userDetails">
              Email: {data.email}
            </div>
            <div className="d-flex m-2 col-12 justify-content-center userDetails">
              Número telefónico: {data.phone}
            </div>
            <div className="d-flex m-2 col-12 justify-content-center userDetails">
              Rut: {data.rut}
            </div>
            <div className="d-flex m-2 col-12 justify-content-center userDetails">
              Dirección: {data.address}
            </div>
            <div className="d-flex m-2 col-12 justify-content-center userDetails">
              Fecha de nacimiento: {parsedDate}
            </div>
          </div>

          <div className="row g-3 p-4">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3  col-lg-4 offset-lg-4 col-xl-2 offset-xl-5">
              <button
                className="btn btn-danger w-100 btn-secondary"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewUser;

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
