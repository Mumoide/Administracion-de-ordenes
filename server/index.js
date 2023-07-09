const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cron = require('cron');
const CronJob = cron.CronJob;
const cors = require('cors')
// librerias de seguridad
const rateLimit = require("express-rate-limit");
const xss = require('xss-clean')
const helmet = require('helmet')
const hpp = require('hpp')

const routesLogin = require('./routes/Login.routes');
const routesUser = require('./routes/user.routes');
const routesOrder = require('./routes/Ordenes.routes');
const routesDashboard = require('./routes/Dashboard.routes');
const routesEtapas = require('./routes/Etapas.routes');
const routesUserRelated = require('./routes/userRelated.routes');
const routesExport = require('./routes/Export.routes');

const mailerAlertStatusOrders = require('./helpers/mailerAlertStatusOrders');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: "http://127.0.0.1:5173",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true // Allow including cookies with requests
}));

// Sanitizar los datos contra ataques XSS (Cross-Site Scripting)
app.use(xss());
// Proteger las solicitudes HTTP (seguridad HTTP)
app.use(helmet());
// Proteger contra la contaminación de parámetros
app.use(hpp());
// Limitar nuestras solicitudes
const limiter = rateLimit({
  max: 1000, // Número máximo de solicitudes permitidas(100)
  windowMs: 60 * 60 * 1000, // Período de tiempo en milisegundos (en este caso, 1 hora)
  message: 'Demasiadas solicitudes desde esta IP, por favor inténtalo nuevamente en una hora.'
});

app.use(limiter);
//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function mailer() {
  mailerAlertStatusOrders();
  console.log('Enviando correos')
}

// Create a cron job that runs every day at 9:00 AM
// every 10 seconds --> '*/10 * * * * *'
// every day at 9:00 AM --> '0 9 * * *'
const job = new CronJob('0 9 * * *', mailer, null, true, 'America/Santiago');

// Start the cron job
job.start();


app.use('/api',
  routesLogin,
  routesUser,
  routesOrder,
  routesDashboard,
  routesEtapas,
  routesUserRelated,
  routesExport
);

app.listen(8081, () => {
  console.log('Servidor escuchando en el puerto 8081');
});

