import sgMail from "@sendgrid/mail";

// Set apikey
sgMail.setApiKey(process.env.SENDGRIDMAIL_KEY);

export default async function sendVerificationEmail(recipientEmail, token) {
  // Message content - sender, recipient, content etc.
  const message = {
    to: recipientEmail,
    from: process.env.SENDER_EMAIL,
    subject: "Please, verify your email with teamCompanion.",
    text: "Thank you for registering with teamCompanion. Please click link to verify your email.",
    html: `<h2>Please, click on the button to verify your e-mail address with teamCompanion.Please, click on the button to verify your e-mail address with teamCompanion.</h2></hr><a href="${process.env.BASE_URL}/auth/account/verification?token=${token}">Click here to verify your account!</a>`,
  };
  // Send e-mail
  await sgMail.send(message);
}

export default sendVerificationEmail;

