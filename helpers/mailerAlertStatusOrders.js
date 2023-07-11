const nodemailer = require('nodemailer');
const OrdenesModel = require('../models/ordenesModel');
require('dotenv').config();

function mailerAlertStatusOrders() {
    const MAILER_USER = process.env.MAILER_USER;
    const MAILER_PASS = process.env.MAILER_PASS;

    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., Gmail
        auth: {
            user: MAILER_USER,
            pass: MAILER_PASS,
        },
    });

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



    OrdenesModel.get((error, results) => {
        if (error) {
            res.status(500).json({
                estado: 'Error',
                message: error
            });
        } else {
            const weekAfter = new Date();
            weekAfter.setDate(weekAfter.getDate() + 7);
            for (let i = 0; i < results.length; i++) {
                if (results[i].id_estado === 2 && results[i].usuario_activo === 1 && results[i].fecha_entrega && results[i].fecha_entrega < weekAfter) {
                    console.log("La orden pendiente nro " + results[i].numero_ficha + " se entrega en menos de una semana" + (results[i].entrega < weekAfter))
                    const orderData = {
                        numero_ficha: results[i].numero_ficha,
                        fecha_entrega: formatDate(results[i].fecha_entrega),
                        fecha_envio: formatDate(results[i].fecha_envio),
                        nombre_trabajo: results[i].nombre_trabajo,
                        nombre_protesis: results[i].nombre_protesis,
                        nombre_completitud: results[i].nombre_completitud,
                        usuario_email: results[i].usuario_email,
                    };
                    const mailOptions = {
                        from: '"Laboratorio Fuentes" <MAILER_USER>',
                        to: orderData.usuario_email,
                        subject: 'Alerta de trabajo atrasado',
                        text: `La orde0n pendiente nro ${orderData.numero_ficha} se debe entregar en menos de una semana.`,
                    };
                    transporter.sendMail(mailOptions, (err) => {
                        transporter.sendMail(mailOptions, (err) => {
                            if (err) {
                                console.error(`Error al enviar el correo de alerta: ${err}`);
                            } else {
                                console.log(`Correo de alerta enviado a ${orderData.usuario_email}`);
                            }
                        });
                    });
                }
            }
        }
    });

}

module.exports = mailerAlertStatusOrders;