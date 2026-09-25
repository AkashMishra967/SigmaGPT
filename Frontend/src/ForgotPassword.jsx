import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./config.js";
import "./login.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (response.ok) {
                // Reset page pe bhejo, email ko saath le jao
                navigate("/reset-password", { state: { email } });
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="parent">
            <div className="authCard">
                <div className="logoCircle">S</div>
                <h1 className="head1">Forgot Password</h1>
                <p className="subText">Enter your email to receive an OTP</p>

                <input
                    className="inp1"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  autoComplete="new-password"
                      name="email-field-random123"
                />

                {message && <p className="errorMsg">{message}</p>}

                <button className="btn1" onClick={handleSendOtp} disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;