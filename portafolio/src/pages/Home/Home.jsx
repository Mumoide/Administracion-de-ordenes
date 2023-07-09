import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faFlask,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
} from "recharts";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hideChart, setHideChart] = useState(false);
  const [hidePieChart, setHidePieChart] = useState(false);
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8081/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status !== "Success") {
          navigate("/login");
        } else {
          setData(res.data.responseData);
          let allStatesValid = true;
          if (res.data.responseData.EtapasType === 0) {
            allStatesValid = false;
          }
          if (allStatesValid) {
            const dataChart = [];
            for (let i = 0; i < res.data.responseData.etapas.length; i++) {
              const etapa = res.data.responseData.etapas[i];
              if (etapa.totales) {
                const chartItem = {
                  name: etapa.nombre_etapas,
                  value: etapa.totales,
                  color: colors[i % colors.length],
                };
                dataChart.push(chartItem);
              }
            }
            setDataChart(dataChart);
          } else {
            setHideChart(true);
          }
          let allStagesValid = true;
          if (res.data.responseData.EstadosType === 0) {
            allStatesValid = false;
          }
          if (allStagesValid) {
            const dataChart = [];
            for (let i = 0; i < res.data.responseData.estados.length; i++) {
              const estado = res.data.responseData.estados[i];
              if (estado.totales) {
                const chartItem = {
                  name: estado.nombre_estados,
                  value: estado.totales,
                  color: colors[i % colors.length],
                };
                dataChart.push(chartItem);
              }
            }
            setDataPieChart(dataChart);
          } else {
            setHidePieChart(true);
          }
          setDataLoaded(true);
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return (
    <div className="d-flex flex-column mx-auto pt-2 mt-3 border w-100 container">
      {dataLoaded && (
        <div>
          <div className="row maxHeight">
            <div className="d-flex flex-row justify-content-center">
              <h2>Dashboard</h2>
            </div>
          </div>
          <div className="row">
            <div className="p-3 d-flex justify-content-around align-items-center mt-3 col-12">
              <div
                className="px 3 p-3 border shadow-sm w-25"
                onClick={() => navigate("/users")}
                style={styles.hoverCard}
              >
                <div className="row justify-content-center">
                  <div
                    className="d-flex flex-column align-items-center justify-content-center col-4"
                    style={styles.adminCard}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="d-flex flex-column align-self-center justify-content-center col-8">
                    <div className="d-flex justify-content-center text-center pb-1">
                      <h4>Admins</h4>
                    </div>
                    <div className="d-flex justify-content-center">
                      <h5>{data.admins}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="px 3 p-3 border shadow-sm w-25"
                onClick={() => navigate("/users")}
                style={styles.hoverCard}
              >
                <div className="row justify-content-center">
                  <div
                    className="d-flex flex-column align-items-center justify-content-center col-4"
                    style={styles.laboCard}
                  >
                    <FontAwesomeIcon icon={faFlask} />
                  </div>
                  <div className="d-flex flex-column align-self-center justify-content-center col-8">
                    <div className="d-flex justify-content-center text-center pb-1">
                      <h4>Labos</h4>
                    </div>
                    <div className="d-flex justify-content-center">
                      <h5>{data.labos}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="px 3 p-3 border shadow-sm w-25"
                onClick={() => navigate("/orders")}
                style={styles.hoverCard}
              >
                <div className="row justify-content-center">
                  <div
                    className="d-flex flex-column align-items-center justify-content-center col-4"
                    style={styles.orderCard}
                  >
                    <FontAwesomeIcon icon={faNewspaper} />
                  </div>
                  <div className="d-flex flex-column align-self-center justify-content-center col-8">
                    <div className="d-flex justify-content-center text-center pb-1">
                      <h4>Ordenes</h4>
                    </div>
                    <div className="d-flex justify-content-center">
                      <h5>{data.orders}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="row">
              {!hideChart ? (
                <div className="col-12 col-md-7 border">
                  <div className="d-flex flex-row justify-content-center mt-2">
                    <h4>Etapas</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      barCategoryGap="10%"
                      barGap={10}
                      width={900}
                      height={300}
                      data={dataChart}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis
                        height={90}
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis allowDecimals={false} />
                      <Bar
                        isAnimationActive={false}
                        dataKey="value"
                        label={{ position: "top" }}
                      >
                        {dataChart.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % 20]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <h4>No se encontraron etapas</h4>
              )}

              {!hidePieChart ? (
                <div className="col-12 col-md-5 border">
                  <div className="d-flex flex-row justify-content-center mt-2">
                    <h4>Estados</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={dataPieChart}
                        cx="50%"
                        cy="50%"
                        label={renderCustomizedLabel}
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataPieChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <h4> No se encontraron estados</h4>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

const styles = {
  adminCard: {
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    marginTop: "9px",
    backgroundColor: "#bb23234e",
  },
  laboCard: {
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    marginTop: "9px",
    backgroundColor: "#235dbb4e",
  },
  orderCard: {
    borderRadius: "50%",
    height: "50px",
    width: "50px",
    marginTop: "9px",
    backgroundColor: "#23bb4647",
  },
  hoverCard: {
    fontSize: "25px",
    cursor: "pointer",
  },
};
