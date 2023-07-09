import axios from "axios";
import jwt_decode from "jwt-decode";
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

function Order() {
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const handleUserSelect = async (event, row) => {
    const selectedUser = event.target.value;
    const orderId = findOrder(data, "numero_ficha", row.fileNumber).id;
    console.log(selectedUser);

    try {
      await Promise.all([
        axios.put(
          `http://localhost:8081/api/assignUser/${orderId}/${selectedUser}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        ),
        new Promise((resolve) => {
          const updatedDataTable = dataTable.map((item) => {
            if (item.fileNumber === row.fileNumber) {
              return {
                ...item,
                assignedUser: selectedUser,
              };
            }
            return item;
          });
          setDataTable(updatedDataTable);
          resolve();
        }),
      ]);

      console.log("Usuario asignado");
    } catch (error) {
      console.log(error);
    }
  };

  const findOrder = (array, property, value) =>
    array.find((obj) => obj[property] === value);

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/ordenes", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log("Data", res);
          setData(res.data.Results);
          setDataTable(
            res.data.Results.map((order) => {
              return {
                creationDate: formatDate(order.fecha_creacion),
                fileNumber: order.numero_ficha,
                medicalCenter: order.nombre_centro,
                stage:
                  order.etapa_activa === 1 ? order.nombre_etapas : "Sin etapa",
                assignedUser:
                  order.usuario_activo === 1
                    ? order.rut_usuario_asignado
                    : "Sin asignar",
              };
            })
          );
        } else {
          alert("Error");
        }
      })
      .then(
        axios
          .get("http://localhost:8081/api/persona", {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((res) => {
            if (res.data.Status === "Success") {
              setUsers(() => [
                {
                  nombre: "Sin",
                  apellido: "asignar",
                  correo: "Sin asignar",
                },
                ...res.data.data.map((user) => ({
                  nombre: user.nombre,
                  apellido: user.apellido,
                  rut: user.rut,
                })),
              ]);
              setDataLoaded(true);
            } else {
              alert("Error");
            }
          })
      );
  }, []);

  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);

  const columns = [
    {
      name: "Nro Ficha",
      selector: (row) => row.fileNumber,
      sortable: true,
      cellExport: (row) => row.fileNumber,
      maxWidth: "10%",
    },
    {
      name: "Fecha creación",
      selector: (row) => row.creationDate,
      sortable: true,
      cellExport: (row) => row.creationDate,
      hide: "lg",
      maxWidth: "15%",
    },
    {
      name: "Etapa",
      selector: (row) => (
        <>
          {dataLoaded && (
            <button
              onClick={() => {
                row.stage === "Sin etapa"
                  ? (window.location.href = `/createStage/${
                      findOrder(data, "numero_ficha", row.fileNumber).id
                    }/${row.fileNumber}`)
                  : (window.location.href = `/stages/${
                      findOrder(data, "numero_ficha", row.fileNumber).id
                    }`);
              }}
              className="btn btn-outline-success btn-sm me-2"
              style={{ minWidth: "100px" }}
            >
              {row.stage}
            </button>
          )}
        </>
      ),
      sortable: true,
      cellExport: (row) => row.nombre_etapas,
      maxWidth: "auto",
      minWidth: "100px",
    },

    {
      name: "Usuario asignado",
      selector: (row) => (
        <>
          {dataLoaded && (
            <div>
              <select
                className="form-select"
                value={row.assignedUser || ""}
                onChange={(event) => handleUserSelect(event, row)}
              >
                {users.map((user) => (
                  <option
                    key={user.nombre + user.apellido + user.correo}
                    value={user.rut}
                  >
                    {user.nombre + " " + user.apellido}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      ),
      sortable: true,
      cellExport: (row) => row.assignedUser,
      maxWidth: "auto",
      hide: "md",
      minWidth: "200px",
    },
    {
      name: "Centro",
      selector: (row) => row.medicalCenter,
      sortable: true,
      cellExport: (row) => row.medicalCenter,
      hide: "md",
      maxWidth: "auto",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <div>
            <button
              onClick={() => {
                // Redirect to the userEdit page
                window.location.href = `/ViewOrder/${
                  findOrder(data, "numero_ficha", row.fileNumber).id
                }`;
              }}
              className="btn btn-outline-success btn-sm me-2"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            {user.rol_id === 1 && (
              <>
                <button
                  onClick={() => {
                    // Redirect to the userEdit page
                    window.location.href = `/orderEdit/${
                      findOrder(data, "numero_ficha", row.fileNumber).id
                    }`;
                  }}
                  className="btn btn-outline-primary btn-sm me-2"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  onClick={() =>
                    deleteAlert(
                      findOrder(data, "numero_ficha", row.fileNumber).id,
                      row.fileNumber
                    )
                  }
                  className="btn btn-outline-danger btn-sm"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </>
            )}
          </div>
        </>
      ),
      ignoreRowClick: true,
      maxWidth: "auto",
      minWidth: "150px",
    },
  ];

  const swalWillDelete = Swal.mixin({
    customClass: {
      confirmButton: "accept-button",
      cancelButton: "cancel-button",
    },
    buttonsStyling: false,
  });

  const deleteAlert = (id, nro) => {
    swalWillDelete
      .fire({
        title: "¿Estás seguro?",
        html:
          "Una vez eliminado, no podrás recuperar la orden numero" +
          "<br>" +
          `<h5>${nro}</h5>`,
        icon: "warning",
        showCancelButton: true, // Display the cancel button
        confirmButtonText: "Eliminar", // Text for the confirm button
        cancelButtonText: "Cancelar", // Text for the cancel button
      })
      .then((result) => {
        if (result.isConfirmed) {
          // User clicked the confirm button
          handleDelete(id);
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

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8081/api/ordenes/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          let timerInterval;
          swalDeleted.fire({
            title: "Orden eliminada",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              window.location.reload(true);
            },
          });
        } else {
          alert(id);
        }
      });
  };

  const exportOrders = () => {
    axios
      .get("http://localhost:8081/api/exportOrders", {
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
        a.download = "Ordenes_de_trabajo.xlsx";
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

  const formatDate = (creationDate) => {
    const date = new Date(creationDate);
    const creationDateFormatted =
      ("0" + date.getDate()).slice(-2) +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      date.getFullYear();
    return creationDateFormatted;
  };

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column mt-3 border px-4 py-2">
      <div className="d-flex justify-content-center">
        <h3>Lista de ordenes</h3>
      </div>
      {dataLoaded && (
        <div>
          <DataTableExtensions
            columns={columns}
            data={dataTable}
            filterPlaceholder="Buscar"
            print={false}
            fileName="Lista de órdenes de trabajo"
            filterDigit={0}
            export={false}
          >
            <DataTable
              title="Órdenes de trabajo"
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
          <div className="row d-flex align-items-center">
            {user.rol_id === 1 && (
              <>
                <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3 align-items-center">
                  <Link
                    to="/createorder"
                    className="btn btn-success w-100 h-75 d-flex justify-content-center align-items-center"
                    style={styles.panel}
                  >
                    Crear orden
                  </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 align-items-center py-2">
                  <Link
                    to="/"
                    className="btn btn-danger w-100 h-75 d-flex justify-content-center align-items-center"
                    style={styles.panel}
                  >
                    Volver al inicio
                  </Link>
                </div>
                <div className="col-12 offset-4 col-sm-2 col-md-2 offset-md-5 col-lg-1 offset-lg-1 align-items-center py-2">
                  <Link
                    onClick={exportOrders}
                    className="excel-button w-25 h-100 d-flex justify-content-center align-items-center"
                    style={styles.panel}
                  >
                    <FontAwesomeIcon className="fs-2" icon={faFileArrowDown} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;

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
