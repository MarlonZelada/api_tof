import nodemailer from 'nodemailer';
require('dotenv').config();

const user = process.env.USER_GMAIL;
const pass = process.env.USER_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user,
        pass
    },
});



export const email = {
    transporter
}



