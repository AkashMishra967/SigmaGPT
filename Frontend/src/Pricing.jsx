import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./config.js";
import "./Pricing.css";
import { MyContext } from "./MyContext.jsx";
import "./pricing.css";

function Pricing() {
    const navigate = useNavigate();
    const { user, setuser } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const isPremium = user?.isPremium || success;

    const handlePay = async () => {
        setLoading(true);
        setMessage("");
        try {
            const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
                method: "POST",
                credentials: "include"
            });
            const order = await orderResponse.json();

            if (!orderResponse.ok) {
                setMessage(order.message || "Could not start payment");
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "SigmaGPT",
                description: "Upgrade to Premium",
                order_id: order.id,
                prefill: {
                    name: user?.username || "",
                    email: user?.email || "",
                    contact: ""
                },
                modal: {
                    ondismiss: () => setLoading(false)   // popup band kare to button wapas active
                },
                handler: async function (response) {
                    const verifyResponse = await fetch(`${BASE_URL}/api/payment/verify`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(response)
                    });
                    const data = await verifyResponse.json();
                    if (verifyResponse.ok) {
                        setuser({ ...user, isPremium: true });
                        setSuccess(true);
                    } else {
                        setMessage(data.message);
                    }
                    setLoading(false);
                },
                theme: { color: "#10a37f" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => {
                setMessage("Payment failed. Please try again.");
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            console.log(err);
            setMessage("Something went wrong. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="pricingPage">
            <button className="pricingBack" onClick={() => navigate("/")}>
                <i className="fa-solid fa-arrow-left"></i> Back to chat
            </button>

            <h1 className="pricingTitle">Upgrade your plan</h1>
            <p className="pricingSub">Get more out of SigmaGPT with Premium</p>

            <div className="pricingCards">

                {/* Free plan */}
                <div className="planCard">
                    <h2 className="planName">Free</h2>
                    <p className="planPrice">₹0 <span>/ forever</span></p>
                    <ul className="planFeatures">
                        <li><i className="fa-solid fa-check"></i> Basic AI chat</li>
                        <li><i className="fa-solid fa-check"></i> Chat history saved</li>
                        <li><i className="fa-solid fa-check"></i> Dark / Light theme</li>
                    </ul>
                    <button className="planBtn planBtnGhost" disabled>
                        {isPremium ? "Previous plan" : "Current plan"}
                    </button>
                </div>

                {/* Premium plan */}
                <div className="planCard planCardPremium">
                    <span className="planBadge">Recommended</span>
                    <h2 className="planName">Premium</h2>
                    <p className="planPrice">₹199 <span>/ one-time</span></p>
                    <ul className="planFeatures">
                        <li><i className="fa-solid fa-check"></i> Unlimited messages</li>
                        <li><i className="fa-solid fa-check"></i> Faster responses</li>
                        <li><i className="fa-solid fa-check"></i> Priority access to new features</li>
                        <li><i className="fa-solid fa-check"></i> Everything in Free</li>
                    </ul>

                    {isPremium ? (
                        <button className="planBtn" disabled>
                            <i className="fa-solid fa-circle-check"></i> You are Premium
                        </button>
                    ) : (
                        <button className="planBtn" onClick={handlePay} disabled={loading}>
                            {loading ? "Please wait..." : "Pay Now ₹199"}
                        </button>
                    )}
                </div>
            </div>

            {success && (
                <p className="pricingSuccess">Payment successful! Welcome to Premium 🎉</p>
            )}
            {message && <p className="pricingError">{message}</p>}

            <p className="pricingNote">Secured by Razorpay. UPI, Cards and Netbanking supported.</p>
        </div>
    );
}

export default Pricing;