require("dotenv").config(); // Load environment variables from .env file

const nodemailer = require("nodemailer");

// Log to check if environment variables are loaded
console.log("EMAIL_USER:", process.env.EMAIL); // should log your email
console.log("EMAIL_PASS:", process.env.EMAIL_PASSWORD); // should log your password

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
});

/**
 * Send an email using the specified options.
 * @param {Object} mailOptions - The mail options.
 * @param {string} mailOptions.from - The sender's email address.
 * @param {string} mailOptions.to - The recipient's email address.
 * @param {string} mailOptions.subject - The email subject.
 * @param {string} mailOptions.html - The email body HTML content.
 */
async function sendEmail(mailOptions) {
	try {
		let info = await transporter.sendMail(mailOptions);
		console.log("Email sent: " + info.response);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

// Define mail options
const mailOptions = {
	from: process.env.EMAIL_USER,
	to: "auomidesalami@gmail.com",
	subject: "Sending Email using Node.js",
	html: "<h1>Welcome</h1><p>That was easy!</p>",
};

// Send the email
sendEmail(mailOptions);
