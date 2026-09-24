import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Your Password Reset OTP - SigmaGPT",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 5px;">${otp}</h1>
                <p>This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};