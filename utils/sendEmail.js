const nodemailer = require("nodemailer");

const sendBookingEmail = async (to, fullName, date, time) => {
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

module.exports = sendBookingEmail;