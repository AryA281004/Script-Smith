require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter;

const setupTransporter = async () => {
  // Use real Gmail OAuth2 if configured, otherwise fall back to Ethereal test account
  if (process.env.EMAIL_USER && process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    console.log('✅ Configured Gmail transporter');
  } else {
    console.log('Gmail OAuth2 not fully configured — creating Ethereal test account for dev');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Ethereal account created. User:', testAccount.user);
  }

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error connecting to email server:', error);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
};

// Initialize transporter immediately
setupTransporter().catch(err => console.error('Failed to setup transporter:', err));

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    if (!transporter) {
      await setupTransporter();
    }

    const fromAddress = process.env.EMAIL_USER ? `"Script-Smith" <${process.env.EMAIL_USER}>` : '"Script-Smith" <no-reply@example.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('Preview URL: %s', preview);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // rethrow so callers can handle it
  }
};

//forgot password otp email
const sendOTPEmail = async (to, otp) => {
  try {
    await sendEmail(
      to,
      "🔐 Reset Your Password | Script-Smith",
      
      // Plain text (fallback)
      `Your OTP is ${otp}. It is valid for 10 minutes.`,
      
      // 🔥 BEAUTIFUL HTML EMAIL
      `
      <div style="
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #1e1b4b);
        padding: 40px 20px;
        color: #fff;
        text-align: center;
      ">
        
        <div style="
          max-width: 500px;
          margin: auto;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        ">

          <h1 style="
            font-size: 24px;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          ">
            Script-Smith 🔮
          </h1>

          <p style="font-size: 14px; color: rgba(255,255,255,0.7);">
            Secure Password Reset Request
          </p>

          <div style="
            margin: 30px 0;
            padding: 20px;
            border-radius: 16px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
          ">
            <p style="margin-bottom: 10px; font-size: 14px; color: #ccc;">
              Your One-Time Password
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #fff;
            ">
              ${otp}
            </div>
          </div>

          <p style="font-size: 13px; color: rgba(255,255,255,0.6);">
            This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
          </p>

          <p style="
            margin-top: 25px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
          ">
            If you didn’t request this, you can safely ignore this email.
          </p>

        </div>
      </div>
      `
    );

  } catch (error) {
    console.error("Error sending OTP email:", error);

    const err = new Error("Failed to send OTP email");
    err.status = 500;
    err.secondary = error;
    throw err;
  }
};

// Connect Gmail OTP email 
const sendConnectEmailOtp = async (to, otp) => {

  try {
    await sendEmail(
      to,
      "🔗 Connect Your Gmail | Script-Smith"

       // Plain text (fallback)
      `Your OTP is ${otp}. It is valid for 10 minutes.`,
      
      // 🔥 BEAUTIFUL HTML EMAIL
      `
      <div style="
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #1e1b4b);
        padding: 40px 20px;
        color: #fff;
        text-align: center;
      ">
        
        <div style="
          max-width: 500px;
          margin: auto;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        ">

          <h1 style="
            font-size: 24px;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          ">
            Script-Smith 🔮
          </h1>

          <p style="font-size: 14px; color: rgba(255,255,255,0.7);">
            Secure Connect email Request
          </p>

          <div style="
            margin: 30px 0;
            padding: 20px;
            border-radius: 16px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
          ">
            <p style="margin-bottom: 10px; font-size: 14px; color: #ccc;">
              Your One-Time Password
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #fff;
            ">
              ${otp}
            </div>
          </div>

          <p style="font-size: 13px; color: rgba(255,255,255,0.6);">
            This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
          </p>

          <p style="
            margin-top: 25px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
          ">
            If you didn’t request this, you can safely ignore this email.
          </p>

        </div>
      </div>
      `
      );
      } 
      catch (error) {
        console.error("Error sending Gmail connect OTP email:", error);

        const err = new Error("Failed to send Gmail connect OTP email");
        err.status = 500;
        err.secondary = error;
        throw err;
        
  }
};

const sendConnectSuccessfully = async (to) => {
  try {
    await sendEmail(
      to,
      "✅ Gmail Connected Successfully | Script-Smith",

      // Plain text fallback
      `Your Gmail has been successfully connected to Script-Smith. If this wasn't you, please secure your account immediately.`,

      // 🔥 BEAUTIFUL HTML EMAIL (MATCHED DESIGN)
      `
      <div style="
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #1e1b4b);
        padding: 40px 20px;
        color: #fff;
        text-align: center;
      ">
        
        <div style="
          max-width: 500px;
          margin: auto;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        ">

          <h1 style="
            font-size: 24px;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #22c55e, #4ade80);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          ">
            Script-Smith 🔮
          </h1>

          <p style="font-size: 14px; color: rgba(255,255,255,0.7);">
            Gmail Connection Successful
          </p>

          <div style="
            margin: 30px 0;
            padding: 20px;
            border-radius: 16px;
            background: rgba(34,197,94,0.1);
            border: 1px solid rgba(34,197,94,0.3);
          ">
            <p style="margin-bottom: 10px; font-size: 14px; color: #bbf7d0;">
              🎉 Your Gmail is now connected!
            </p>

            <div style="
              font-size: 18px;
              font-weight: 600;
              color: #4ade80;
            ">
              You're all set to use Gmail features 🚀
            </div>
          </div>

          <p style="font-size: 13px; color: rgba(255,255,255,0.6);">
            You can now send OTPs, notifications, and emails seamlessly using your connected Gmail.
          </p>

          <p style="
            margin-top: 25px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
          ">
            If this wasn’t you, please secure your account immediately.
          </p>

        </div>
      </div>
      `
    );
  } catch (error) {
    console.error("Error sending Gmail success email:", error);

    const err = new Error("Failed to send Gmail success email");
    err.status = 500;
    err.secondary = error;
    throw err;
  }
};

const sendPasswordResetSuccessfully = async (to) => {
  try {
    await sendEmail(
      to,
      "🔐 Password Reset Successful | Script-Smith",

      // Plain text fallback
      `Your password has been successfully reset. If you did not perform this action, please secure your account immediately.`,

      // 🔥 BEAUTIFUL HTML EMAIL (CONSISTENT DESIGN)
      `
      <div style="
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f172a, #1e1b4b);
        padding: 40px 20px;
        color: #fff;
        text-align: center;
      ">
        
        <div style="
          max-width: 500px;
          margin: auto;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        ">

          <h1 style="
            font-size: 24px;
            margin-bottom: 10px;
            background: linear-gradient(90deg, #22c55e, #4ade80);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          ">
            Script-Smith 🔮
          </h1>

          <p style="font-size: 14px; color: rgba(255,255,255,0.7);">
            Password Reset Successful
          </p>

          <div style="
            margin: 30px 0;
            padding: 20px;
            border-radius: 16px;
            background: rgba(34,197,94,0.1);
            border: 1px solid rgba(34,197,94,0.3);
          ">
            <p style="margin-bottom: 10px; font-size: 14px; color: #bbf7d0;">
              ✅ Your password has been updated
            </p>

            <div style="
              font-size: 18px;
              font-weight: 600;
              color: #4ade80;
            ">
              Your account is now secure 🔒
            </div>
          </div>

          <p style="font-size: 13px; color: rgba(255,255,255,0.6);">
            You can now log in using your new password. For extra security, make sure your password is strong and unique.
          </p>

          <p style="
            margin-top: 25px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
          ">
            If you did not perform this action, please reset your password immediately and contact support.
          </p>

        </div>
      </div>
      `
    );
  } catch (error) {
    console.error("Error sending password reset success email:", error);

    const err = new Error("Failed to send password reset success email");
    err.status = 500;
    err.secondary = error;
    throw err;
  }
};



// Verify the connection configuration
// (transporter.verify is called during setupTransporter)

module.exports = 
{
    sendOTPEmail,
    sendConnectEmailOtp,
    sendConnectSuccessfully,
    sendPasswordResetSuccessfully 
};