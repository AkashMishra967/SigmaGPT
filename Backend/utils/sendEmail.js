import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (toEmail, otp) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",   // Resend ka free testing sender
        to: toEmail,
        subject: "Your Password Reset OTP - SigmaGPT",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 5px;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
            </div>
        `
    });
};