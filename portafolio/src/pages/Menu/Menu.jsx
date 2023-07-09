import { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faPowerOff,
  faNewspaper,
  faComputer,
  faHospital,
} from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";

function Menu() {
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  axios.defaults.withCredentials = true;

  const swalCreated = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const swalWillLogout = Swal.mixin({
    customClass: {
      confirmButton: "accept-button",
      cancelButton: "cancel-button",
    },
    buttonsStyling: false,
  });

  const logoutAlert = () => {
    swalWillLogout
      .fire({
        title: "¿Deseas cerrar sesión?",
        // html: "Se cerrará la sesión de" + `<h5>${user.nombre}</h5>`,
        icon: "question",
        iconColor: "#f8bb86",
        showCancelButton: true, // Display the cancel button
        confirmButtonText: "Sí", // Text for the confirm button
        cancelButtonText: "No", // Text for the cancel button
      })
      .then((result) => {
        if (result.isConfirmed) {
          // User clicked the confirm button
          handleLogout();
        }
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status !== "Success") {
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          swalCreated.fire({
            title: "Sesión expirada",
            text: "Debe volver a iniciar sesión",
            icon: "alert",
            confirmButtonText: "Cerrar",
          });
          navigate("/login");
        }
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/api/logout", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/login");
        }
      });
  };

  return (
    <div className="container-fluid d-flex flox-column">
      <div className="row flex-nowrap flex-grow-1">
        <div className="col-auto col-sm-4 col-md-3 custom-lg-col col-xl-2 px-sm-2 px-0 appBackgroundColor">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <div className="d-flex justify-content-center col-12 justify-content-center">
              <a
                href="/"
                className="d-flex align-items-center pb-3 text-white text-decoration-none"
              >
                <img
                  src="../../logolab_transparente.png"
                  alt="Logo"
                  width="40"
                  height="40"
                />
                <span
                  className="fs-5 d-none d-sm-inline"
                  style={{ marginLeft: "10px" }}
                >
                  {user.rol_id === 1 ? "Menu Admin" : "Menu Labo"}
                </span>
              </a>
            </div>
            <div className="d-flex col-12 profile-item justify-content-center justify-content-sm-start">
              <a
                href={user.rol_id === 1 ? `/viewUser/${user.id}` : "#"}
                className="nav-link px-0 align-middle text-white pb-3 pt-2 "
                id="dropdownUser1"
                aria-expanded="false"
              >
                <img
                  src={
                    user.imagen
                      ? `http://localhost:8081/images/${user.imagen}`
                      : "http://localhost:8081/images/default_picture.jpg"
                  }
                  alt="No se pudo cargar la imagen"
                  width="28"
                  height="28"
                  className="rounded-circle mb-1"
                />
                <span className="ms-1 d-none d-sm-inline"> {user.nombre}</span>
              </a>
            </div>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              {user.rol_id === 1 && (
                <li>
                  <Link
                    to="/"
                    className="nav-link px-0 align-middle text-white"
                  >
                    <FontAwesomeIcon className="fs-4" icon={faChartBar} />{" "}
                    <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/orders"
                  className="nav-link px-0 align-middle text-white"
                >
                  <FontAwesomeIcon className="fs-4" icon={faNewspaper} />{" "}
                  <span className="ms-1 d-none d-sm-inline">Ordenes</span>
                </Link>
              </li>
              {user.rol_id === 1 && (
                <li>
                  <Link
                    href="#collapsedItems"
                    className="nav-link px-0 align-middle text-white"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsedItems"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapsedItems"
                  >
                    <FontAwesomeIcon className="fs-5" icon={faUserGroup} />{" "}
                    <span className="ms-1 d-none d-sm-inline">Usuarios</span>
                  </Link>
                  <div
                    className={`collapse ${
                      path.includes("/users") || path.includes("/relatedUsers")
                        ? "show"
                        : ""
                    }`}
                    id="collapsedItems"
                  >
                    <div className="d-flex justify-content-center justify-content-sm-end menuWidth">
                      <ul className="nav flex-column">
                        <li>
                          <a
                            href="/users"
                            className="nav-link px-0 align-middle text-white"
                          >
                            <FontAwesomeIcon
                              className="fs-6"
                              icon={faComputer}
                            />{" "}
                            <span className="ms-1 d-none d-sm-inline">
                              Sistema
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/relatedUsers"
                            className="nav-link px-0 align-middle text-white"
                          >
                            <FontAwesomeIcon
                              className="fs-6"
                              icon={faHospital}
                            />{" "}
                            <span className="ms-1 d-none d-sm-inline">
                              Relacionados
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              )}
              <li>
                <div className="d-flex" onClick={logoutAlert}>
                  <a href="#" className="nav-link px-0 align-middle text-white">
                    <FontAwesomeIcon className="fs-4" icon={faPowerOff} />{" "}
                    <span className="ms-1 d-none d-sm-inline">
                      Cerrar sesión
                    </span>{" "}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-1">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>
              {user.rol_id === 1
                ? "Administrador del sistema"
                : "Laboratorista"}
            </h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Menu;
