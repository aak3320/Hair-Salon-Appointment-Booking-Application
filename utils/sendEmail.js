const nodemailer = require("nodemailer");

// Transporter setup
const createTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Email 1 After successful booking
const sendBookingEmail = async (to, fullName, date, time) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Salon Appointment Confirmation",
        html: `
            <h2>Hello ${fullName},</h2>
            <p>Your salon appointment has been booked successfully.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Thank you for using our Hair Salon Booking System.</p>
        `
    });
};

// Email 2 After successful payment
const sendPaymentConfirmationEmail = async (to, fullName, date, time) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Payment Confirmation - Hair Salon",
        html: `
            <h2>Hello ${fullName},</h2>
            <p>Your payment has been processed successfully!</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <br>
            <p>Thank you for using Hair Salon Booking System.</p>
        `
    });
};

module.exports = { sendBookingEmail, sendPaymentConfirmationEmail };