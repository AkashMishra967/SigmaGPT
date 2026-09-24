import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./config.js";
import "./login.css";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await response.json();
            if (response.ok) {
                navigate("/login");
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
                <h1 className="head1">Reset Password</h1>
                <p className="subText">Enter the OTP sent to {email}</p>

                <input
                    className="inp1"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <input
                    className="inp1"
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {message && <p className="errorMsg">{message}</p>}

                <button className="btn1" onClick={handleReset} disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;