const nodemailer = require("nodemailer");

// Gmail transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email 1: After successful booking
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
      <p>Thank you for using Look Booker.</p>
    `
  });
};

// Email 2: After successful payment
const sendPaymentConfirmationEmail = async (to, fullName, salonName, services, date, time) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Payment Confirmation: Look Booker",
    html: `
      <h2>Hello ${fullName},</h2>
      <p>Your payment has been processed successfully!</p>
      <p><strong>Salon:</strong> ${salonName || 'Hair Salon'}</p>
      <p><strong>Services:</strong> ${services || 'Appointment'}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <br>
      <p>Thank you for using Look Booker.</p>
    `
  });
};

module.exports = {sendBookingEmail,sendPaymentConfirmationEmail};