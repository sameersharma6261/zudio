import React, { useState } from "react";
import {
  FaCreditCard,
  FaLock,
  FaUser,
  FaKey,
  FaWallet,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formData, setFormData] = useState({
    number: "1234 5678 9012 3456",
    name: "contact",
    expiry: "12/12",
    cvv: "123",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayNow = () => {
    const { number, name, expiry, cvv } = formData;
    if (number && name && expiry && cvv) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/token");
      }, 3000);
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <>
      <div className="background">
        <div className="checkout-container">
          <h2>Complete Your Payment</h2>
          <p className="secure-text">
            <FaLock /> Secure Payment
          </p>

          {/* Payment Method */}
          <div className="payment-methods">
            <button
              className={paymentMethod === "credit" ? "active" : ""}
              onClick={() => setPaymentMethod("credit")}
            >
              <FaCreditCard /> Card
            </button>
            <button
              className={paymentMethod === "upi" ? "active" : ""}
              onClick={() => setPaymentMethod("upi")}
            >
              <FaWallet /> UPI
            </button>

            <button
              className={paymentMethod === "cash" ? "active" : ""}
              onClick={() => setPaymentMethod("cash")}
            >
              <FaMoneyBillAlt /> Cash
            </button>
          </div>

          {/* Card Preview */}
          <div className="card-preview">
           
            <div className="dots">
              {formData.number || "•••• •••• •••• ••••"}
            </div>
            <div className="details">
              <span>Card Holder</span>
              <span>Expires</span>
            </div>
            <div className="details">
              <strong>{formData.name || "YOUR NAME"}</strong>
              <strong>{formData.expiry || "MM/YY"}</strong>
            </div>
          </div>

          {/* Card Form */}
          <div className="card-form">
            <label>Card Number</label>
            <input
              type="text"
              name="number"
              placeholder="1234 5678 9012 3456"
              value={formData.number}
              onChange={handleChange}
              maxLength={16}
            />

            <label>Card Holder Name</label>
            <div className="input-icon">
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div>
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  maxLength={5}
                />
              </div>
              <div>
                <label>CVV</label>
                <div className="input-icon">
                  <FaKey />
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            <button
              className="pay-btn"
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <FaLock /> Pay Now
                </>
              )}
            </button>
            <p className="secure-msg">✔ Your payment info is secure</p>
          </div>
        </div>
      </div>
      <style>{`
      
      .background{
    //   background: linear-gradient(135deg,rgb(32, 32, 32),rgb(49, 42, 42));
        height: 100vh;  
        background: white;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
         position: relative;
        z-index: 2;
      }
      
      
      .checkout-container {
  // max-width: 420px;
  margin: 40px auto;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
 
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  background: #f9fbff;
}

h2 {
  text-align: center;
  margin-bottom: 8px;
}

.secure-text {
  text-align: center;
  color: green;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.payment-methods {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.payment-methods button {
  flex: 1;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.payment-methods .active {
  border-color: #2563eb;
  background-color: #ebf2ff;
}

.card-preview {
  background: linear-gradient(135deg, #5f72ff, #9921e8);
  border-radius: 14px;
  color: white;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.card-preview img {
  width: 40px;
}

.card-preview .dots {
  font-size: 1.2rem;
  margin: 20px 0;
}

.card-preview .details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.card-form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-form label {
  display: block;
  font-size: 0.9rem;
  margin-top: 12px;
  margin-bottom: 4px;
}

.card-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.input-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding-left: 10px;
  border-radius: 8px;
}

.input-icon input {
  border: none;
  background: transparent;
  flex: 1;
  padding: 10px;
}

.row {
  display: flex;
  gap: 10px;
}

.pay-btn {
  margin-top: 20px;
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.secure-msg {
  text-align: center;
  color: green;
  font-size: 0.85rem;
  margin-top: 10px;
}`}</style>
    </>
  );
}

export default PaymentPage;
