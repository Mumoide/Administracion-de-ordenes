import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  faMoon,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import PopoverComponent from "../../components/PopoverComponent";

function Stages() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [dataExists, setDataExists] = useState(false);
  const [firstRow, setFirstRow] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const columns = [
    {
      id: "id_etapa",
      name: "ID",
      selector: (row) => row.id_etapa,
      sortable: true,
      cellExport: (row) => row.id_etapa,
      hide: "lg",
      maxWidth: "50px",
    },
    {
      id: "fecha_inicio",
      name: "Fecha de inicio",
      selector: (row) => row.fecha_inicio_estado,
      sortable: true,
      cellExport: (row) => row.fecha_inicio_estado,
      hide: "md",
      maxWidth: "auto",
      format: (row) => {
        return formatDate(row.fecha_inicio_estado);
      },
    },
    {
      id: "etapa",
      name: "Etapa",
      selector: (row) => row.nombre_etapas,
      sortable: true,
      cellExport: (row) => row.nombre_etapas,
      maxWidth: "auto",
    },
    {
      id: "estado",
      name: "Estado",
      selector: (row) => row.nombre_estados,
      sortable: true,
      cellExport: (row) => row.nombre_estados,
      hide: "sm",
      maxWidth: "auto",
    },
    {
      id: "fecha_envio",
      name: "Fecha de envío",
      selector: (row) => row.fecha_envio,
      sortable: true,
      cellExport: (row) => row.fecha_envio,
      hide: "lg",
      maxWidth: "auto",
      format: (row) => {
        return formatDate(row.fecha_envio);
      },
    },
    {
      id: "fecha_entrega",
      name: "Fecha de entrega",
      selector: (row) => row.fecha_entrega,
      sortable: true,
      cellExport: (row) => row.fecha_entrega,
      hide: "md",
      maxWidth: "auto",
      format: (row) => {
        return formatDate(row.fecha_entrega);
      },
    },

    {
      id: "prioridad",
      name: "Prioridad",
      selector: (row) => {
        const currentDate = new Date();
        const deadline = new Date(row.fecha_entrega);
        const timeDifference = deadline.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

        if (row.fecha_entrega === null)
          return (
            <FontAwesomeIcon className="fs-5 appTextColor" icon={faMoon} />
          );
        if (currentDate > deadline) {
          return <i className="text-danger fs-4 bi bi-exclamation-diamond"></i>;
        } else if (daysDifference <= 7) {
          return <i className="text-danger fs-5 bi bi-hourglass-bottom"></i>;
        } else if (daysDifference <= 21) {
          return <i className="text-warning fs-5 bi bi-hourglass-split"></i>;
        } else {
          return <i className="text-primary fs-5 bi bi-hourglass-top"></i>;
        }
      },
      sortable: true,
      cellExport: (row) => {
        const priority = row.prioridad;
        // Map the priority value to the corresponding label for exporting
        if (priority === "Sin prioridad") {
          return "Sin prioridad";
        } else if (priority === "Delayed") {
          return "Delayed";
        } else if (priority === "High") {
          return "High";
        } else if (priority === "Medium") {
          return "Medium";
        } else {
          return "Low";
        }
      },
      hide: "sm",
      maxWidth: "auto",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              navigate(`/viewStage/${row.id}`);
            }}
            className="btn btn-outline-success btn-sm me-2"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              navigate(`/editStages/${row.id}`);
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          {user.rol_id === 1 && (
            <>
              <button
                onClick={() => {
                  deleteAlert(row.id, row.nombre_etapas);
                }}
                className="btn btn-outline-danger btn-sm"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </>
      ),
      ignoreRowClick: true,
      maxWidth: "auto",
      minWidth: "150px",
      center: true,
    },
  ];

  const columnsRecords = [
    {
      id: "id_etapa",
      name: "ID",
      selector: (row) => row.id_etapa,
      sortable: true,
      cellExport: (row) => row.id_etapa,
      hide: "lg",
      maxWidth: "auto",
    },
    {
      id: "fecha_inicio",
      name: "Fecha de inicio",
      selector: (row) => row.fecha_inicio_estado,
      sortable: true,
      cellExport: (row) => row.fecha_inicio_estado,
      hide: "md",
      maxWidth: "auto",
      format: (row) => {
        return formatDate(row.fecha_inicio_estado);
      },
    },
    {
      id: "etapa",
      name: "Etapa",
      selector: (row) => row.nombre_etapas,
      sortable: true,
      cellExport: (row) => row.nombre_etapas,
      maxWidth: "auto",
    },
    {
      id: "estado",
      name: "Estado",
      selector: (row) => row.nombre_estados,
      sortable: true,
      cellExport: (row) => row.nombre_estados,
      hide: "sm",
      maxWidth: "auto",
    },
    {
      id: "fecha_envio",
      name: "Fecha de envío",
      selector: (row) => row.fecha_envio,
      sortable: true,
      cellExport: (row) => row.fecha_envio,
      hide: "lg",
      maxWidth: "auto",
      format: (row) => {
        return formatDate(row.fecha_envio);
      },
    },
    {
      id: "fecha_entrega",
      name: "Fecha de entrega",
      selector: (row) => row.fecha_entrega,
      sortable: true,
      cellExport: (row) => row.fecha_entrega,
      hide: "md",
      maxWidth: "auto",
      format: (row) => {
        return formatDate(row.fecha_entrega);
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              navigate(`/viewStage/${row.id}`);
            }}
            className="btn btn-outline-success btn-sm me-2"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </>
      ),
      ignoreRowClick: true,
      maxWidth: "auto",
      minWidth: "150px",
      center: true,
    },
  ];

  const swalWillDelete = Swal.mixin({
    customClass: {
      confirmButton: "accept-button",
      cancelButton: "cancel-button",
    },
    buttonsStyling: false,
  });

  const deleteAlert = (id, nombre) => {
    swalWillDelete
      .fire({
        title: "¿Estás seguro?",
        html:
          "Una vez eliminado, no podrás recuperar la etapa <h4>" +
          nombre +
          "</h4>",
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

  const exportStages = (id, nro_ficha) => {
    axios
      .get("http://localhost:8081/api/exportStages/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        responseType: "arraybuffer", // Specify the response type as arraybuffer
      })
      .then((res) => {
        console.log(res);
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Etapas de la orden ${nro_ficha}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.log(err);
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

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/etapas/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.data[1].length > 0) {
          setData(
            res.data.data[1].map((order) => {
              return {
                id_etapa: order.id,
                id: order.id,
                fecha_inicio_estado: order.fecha_inicio_estado,
                nro_ficha: order.nro_ficha,
                nombre_etapas: order.nombre_etapas,
                nombre_estados: order.nombre_estados,
                fecha_envio: order.fecha_envio,
                fecha_entrega: order.fecha_entrega,
              };
            })
          );
          setDataExists(true);
        } else {
          setDataExists(false);
        }
        if (res.data.data[0].length > 0) {
          setFirstRow(
            res.data.data[0].map((order) => {
              return {
                id_etapa: order.id,
                id: order.id,
                fecha_inicio_estado: order.fecha_inicio_estado,
                nro_ficha: order.nro_ficha,
                nombre_etapas: order.nombre_etapas,
                nombre_estados: order.nombre_estados,
                fecha_envio: order.fecha_envio,
                fecha_entrega: order.fecha_entrega,
              };
            })
          );
        }
        setDataLoaded(true);
      })
      .catch(() => {
        navigate("/EtapasDeOrdenNoEncontrada");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (creationDate) => {
    if (creationDate === null) {
      return null;
    }
    const date = new Date(creationDate);
    const creationDateFormatted =
      ("0" + date.getDate()).slice(-2) +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      date.getFullYear();
    return creationDateFormatted;
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:8081/api/etapa/" + id).then((res) => {
      if (res.data.Status === "Success") {
        if (data.length > 1) {
          let timerInterval;
          swalDeleted.fire({
            title: "Etapa eliminada",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              window.location.reload(true);
            },
          });
        } else {
          let timerInterval;
          swalDeleted.fire({
            title: "Ultima etapa eliminada",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              navigate(`/orders/`);
            },
          });
        }
      } else {
        alert("Error");
      }
    });
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
        <h3>
          Etapas y estados de la órden Nro°
          {firstRow.length > 0 ? firstRow[0].nro_ficha : ""}
        </h3>
      </div>
      {dataLoaded && (
        <div>
          <div className="mb-4">
            <div className="border">
              <DataTable
                columns={columns}
                data={firstRow}
                print={false}
                title="Etapa actual"
                defaultSortFieldId="fecha_inicio"
                defaultSortAsc={false}
                pagination={false}
                highlightOnHover
                paginationComponentOptions={{
                  rowsPerPageText: "Filas por página:",
                  rangeSeparatorText: "de",
                  noRowsPerPage: false,
                  selectAllRowsItem: false,
                  selectAllRowsItemText: "Todos",
                }}
              />
            </div>
            <div
              className={
                user.rol_id === 1
                  ? "row g-3 p-4 d-flex align-items-center"
                  : "d-flex justify-content-center row g-3 p-4 align-items-center"
              }
            >
              {user.rol_id === 1 && (
                <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3 align-items-center">
                  {dataLoaded &&
                    (firstRow[0].nombre_estados === "Terminado" ? (
                      <Link
                        to={`/createStage/${id}/${firstRow[0].nro_ficha}`}
                        className="btn btn-success w-100 h-100 justify-content-center align-items-center"
                        style={styles.panel}
                      >
                        Cambiar
                      </Link>
                    ) : (
                      <PopoverComponent />
                    ))}
                </div>
              )}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 align-items-center">
                <button
                  className="btn btn-danger w-100 h-100 justify-content-center align-items-center"
                  onClick={() => navigate("/orders")}
                  style={styles.panel}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
          {dataExists > 0 && (
            <div className="border">
              <DataTableExtensions
                columns={columnsRecords}
                data={data}
                filterPlaceholder="Buscar"
                print={false}
                fileName={`Listado de etapas de la orden numero ${data[0].nro_ficha}`}
                filterDigit={0}
                export={false}
              >
                <DataTable
                  title="Historial de etapas"
                  defaultSortFieldId="fecha_inicio"
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
              <div className="d-flex justify-content-center py-2">
                <div className="col-12 offset-4 col-sm-2 col-md-2 offset-md-5 col-lg-1 offset-lg-1 align-items-center d-flex justify-content-center">
                  <Link
                    onClick={() => exportStages(id, firstRow[0].nro_ficha)}
                    className="excel-button w-25 h-100 d-flex justify-content-center align-items-center"
                    style={styles.panel}
                  >
                    <FontAwesomeIcon className="fs-2" icon={faFileArrowDown} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Stages;

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
