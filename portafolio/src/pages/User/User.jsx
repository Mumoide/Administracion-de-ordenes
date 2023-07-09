import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { DotSpinner } from "@uiball/loaders";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";

function User() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/persona", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data);
          setData(res.data.data);
        } else {
          alert("Error");
        }
      });
  }, []);

  const swalWillDelete = Swal.mixin({
    customClass: {
      confirmButton: "accept-button",
      cancelButton: "cancel-button",
    },
    buttonsStyling: false,
  });

  const deleteAlert = (rut, nombre, apellido) => {
    const message = "Una vez eliminado, no podrás recuperar al usuario";
    swalWillDelete
      .fire({
        title: "¿Estás seguro?",
        html: message + `<h5>${nombre} ${apellido}</h5>`,
        icon: "warning",
        showCancelButton: true, // Display the cancel button
        confirmButtonText: "Eliminar", // Text for the confirm button
        cancelButtonText: "Cancelar", // Text for the cancel button
      })
      .then((result) => {
        if (result.isConfirmed) {
          // User clicked the confirm button
          handleDelete(rut);
        }
      });
  };

  const swalDeleted = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const exportUsers = () => {
    axios
      .get("http://localhost:8081/api/exportUsers", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        responseType: "arraybuffer", // Specify the response type as arraybuffer
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Usuarios.xlsx";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((err) => {
        if (
          err.response.status === 401 &&
          err.response.data.message === "No se proporcionó un token"
        ) {
          swalDeleted.fire({
            title: "Sesión expirada",
            text: "Debe volver a iniciar sesión",
            timer: 10000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              window.location.href = "/";
            },
          });
        }
      });
  };

  const handleDelete = (rut) => {
    axios
      .delete("http://localhost:8081/api/persona/" + rut, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          let timerInterval;
          swalDeleted.fire({
            title: "Usuario eliminado",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              window.location.reload(true);
            },
          });
        } else {
          alert("Error");
        }
      });
  };

  const columns = [
    {
      name: "Foto perfil",
      cell: (row) => (
        <img
          src={
            row.imagen
              ? `http://localhost:8081/images/${row.imagen}`
              : "http://localhost:8081/images/default_picture.jpg"
          }
          alt=""
          className="userImage"
        />
      ),
      excludeExport: true,
      maxWidth: "100px",
      minWidth: "100px",
      hide: "sm",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre + " " + row.apellido,
      sortable: true,
      cellExport: (row) => row.nombre + " " + row.apellido,
      maxWidth: "auto",
    },
    {
      name: "Rol",
      selector: (row) => row.nombre_rol,
      sortable: true,
      cellExport: (row) => row.nombre_rol,
      maxWidth: "auto",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cellExport: (row) => row.email,
      maxWidth: "auto",
      hide: "md",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              window.location.href = `/viewUser/${row.id}`;
            }}
            className="btn btn-outline-success btn-sm me-2"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              window.location.href = `/userEdit/${row.id}`;
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            onClick={() => deleteAlert(row.rut, row.nombre, row.apellido)}
            className="btn btn-outline-danger btn-sm"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      ),
      ignoreExport: true,
      hide: "md",
      minWidth: "150px",
      maxWidth: "auto",
    },
  ];
  if (data.length === 0) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column mt-3 border px-4 py-2">
      <div className="d-flex justify-content-center">
        <h3>Lista de usuarios</h3>
      </div>
      <DataTableExtensions
        columns={columns}
        data={data}
        filterPlaceholder="Buscar"
        print={false}
        fileName="Lista de usuarios"
        filterDigit={0}
        export={false}
      >
        <DataTable
          title="Usuarios"
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
          paginationComponentOptions={{
            rowsPerPageText: "Filas por página:",
            rangeSeparatorText: "de",
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "Todos",
          }}
        />
      </DataTableExtensions>
      <div className="row g-3 p-4">
        <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3 align-items-center">
          <Link
            to="/createuser"
            className="btn btn-success w-100 h-100 d-flex justify-content-center align-items-center"
            style={styles.panel}
          >
            Crear usuario
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 align-items-center">
          <Link
            to={"/"}
            className="btn btn-danger w-100 h-100 d-flex justify-content-center align-items-center"
            style={styles.panel}
          >
            Volver al inicio
          </Link>
        </div>
        <div className="col-12 offset-4 col-sm-2 col-md-2 offset-md-5 col-lg-1 offset-lg-1 align-items-center">
          <Link
            onClick={exportUsers}
            className="excel-button w-25 h-100 d-flex justify-content-center align-items-center"
            style={styles.panel}
          >
            <FontAwesomeIcon className="fs-2" icon={faFileArrowDown} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default User;

const styles = {
  panel: {
    height: "50%",
    maxHeight: "5rem",
    display: "flex",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
