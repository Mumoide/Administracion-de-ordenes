import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function RelatedUser() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);
  useEffect(() => {
    console.log(user);
    axios
      .get("http://localhost:8081/api/relatedUser", {
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

  const deleteAlert = (rut, rol_id, nombre, apellido) => {
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
          handleDelete(rut, rol_id);
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

  const handleDelete = (rut, rol_id) => {
    axios
      .delete("http://localhost:8081/api/relatedUser/" + rut + "/" + rol_id, {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      id: "rut_" + user.rol_id,
      name: "Rut",
      selector: (row) => row.rut,
      sortable: true,
      cellExport: (row) => row.rut,
      maxWidth: "auto",
    },
    {
      id: "nombre_" + user.rut,
      name: "Nombre",
      selector: (row) => row.nombre + " " + row.apellido,
      sortable: true,
      cellExport: (row) => row.nombre + " " + row.apellido,
      maxWidth: "auto",
    },
    {
      id: "rol" + user.rut,
      name: "Rol",
      selector: (row) => row.nombre_rol,
      sortable: true,
      cellExport: (row) => row.nombre_rol,
      maxWidth: "auto",
    },
    {
      id: "email" + user.rut,
      name: "Email",
      selector: (row) => {
        if (row.email) {
          return row.email;
        } else return "Sin registro";
      },
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
              window.location.href = `/viewRelatedUser/${row.id}`;
            }}
            className="btn btn-outline-success btn-sm me-2"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              window.location.href = `/relatedUserEdit/${row.id}`;
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            onClick={() =>
              deleteAlert(row.rut, row.rol_id, row.nombre, row.apellido)
            }
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

  const exportRelatedUsers = () => {
    axios
      .get("http://localhost:8081/api/exportRelatedUsers", {
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
        a.download = "Doctores_y_pacientes.xlsx";
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
        <h3>Lista de usuarios relacionados</h3>
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
          defaultSortFieldId="nombre"
          defaultSortAsc={true}
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
      <div className="row g-3 p-4 d-flex justify-content-center">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 align-items-center d-flex">
          <Link
            to="/"
            className="btn btn-danger w-100 h-100 d-flex justify-content-center align-items-center"
            style={styles.panel}
          >
            Volver al inicio
          </Link>
        </div>
        <div className="col-12 offset-1 col-sm-2 col-md-2 offset-md-1 col-lg-1 offset-lg-1 align-items-center justify-content-center d-flex">
          <Link
            onClick={exportRelatedUsers}
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

export default RelatedUser;

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
