const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const { firstName, surname, email, availableMonths } = req.body;

  // Validate input
  if (
    !firstName ||
    !surname ||
    !email ||
    !availableMonths ||
    !availableMonths.length
  ) {
    return res.status(400).send("Missing required fields");
  }
  // HTML content with images and styling
  const htmlContent = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .content {
      padding: 10px;
      font-size: 16px;
    }
    .content img {
      display: block;
      width: 200px;     
      height: 200px;    
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .footer {
      margin-top: 40px;
      padding: 10px;
      background-color: #333;
      color: white;
      text-align: center;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .footer img {
      height: 30px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <h1 class="header">You're in!</h1>
  <div class="content">
    <p>Hi ${firstName} ${surname},</p>
    <p>You selected the following months: ${availableMonths.join(", ")}.\n We will send you upcoming events for these months, stay tuned.</p>
    <img src="cid:musicImage" alt="Music Image" />
  </div>
  <div class="footer">
    <img src="cid:footerLogo" alt="TicketLord Logo" />
    <span>TicketLord™</span>
  </div>
</body>
</html>
`;

  const mailOptions = {
    from: '"TicketLord" <96mcknight@gmail.com>',
    to: email,
    subject: "Welcome to the movement!",
    html: htmlContent,
    attachments: [
      {
        filename: "TicketLordConfirmation.jpg",
        path: "./public/images/email_confirmation.jpg",
        cid: "musicImage",
      },
      {
        filename: "lord.png",
        path: "./public/images/lord.png",
        cid: "footerLogo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
