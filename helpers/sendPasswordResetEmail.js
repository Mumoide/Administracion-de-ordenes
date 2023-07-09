const nodemailer = require('nodemailer');
require('dotenv').config();

function sendPasswordResetEmail(email, token) {
    const MAILER_USER = process.env.MAILER_USER;
    const MAILER_PASS = process.env.MAILER_PASS;

    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., Gmail
        auth: {
            user: MAILER_USER,
            pass: MAILER_PASS,
        },
    });

    const mailOptions = {
        from: '"Laboratorio Fuentes" <MAILER_USER>',
        to: email,
        subject: 'Restablecer contraseña',
        text: `Entra al siguiente link para restablecer tu contraseña: http://127.0.0.1:5173/resetPassword?email=${email}&token=${token}`,
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) throw err;
        console.log(`Password reset email sent to ${email}`);
    });
}

module.exports = sendPasswordResetEmail;