import React, { useState } from 'react';
import { Calendar, Users, CheckCircle2, User, Phone, CreditCard, QrCode, Building2, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const BookingWidget = ({ property, onBookingComplete, onRedirectAuth }) => {
  const { user, openAuthModal } = useAuth();
  const [checkIn, setCheckIn] = useState('2026-10-01');
  const [checkOut, setCheckOut] = useState('2026-10-05');
  const [guests, setGuests] = useState('2');
  const [occupantName, setOccupantName] = useState(user?.fullName || user?.name || '');
  const [occupantPhone, setOccupantPhone] = useState(user?.phone || '');
  
  // Payment Modal & Method States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING' | 'PAY_AT_CHECKIN'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);

  // Calculate nights & price
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(1000 * 60 * 60 * 24, d2 - d1);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 4;
  const pricePerNight = property.pricePerNight || 2500;
  const baseTotal = pricePerNight * nights;
  const serviceFee = Math.round(baseTotal * 0.05);
  const grandTotal = baseTotal + serviceFee;

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    // If user is not logged in, redirect directly to Login/Signup screen!
    if (!user) {
      openAuthModal('login');
      if (onRedirectAuth) onRedirectAuth();
      return;
    }

    // Open Payment Modal
    setShowPaymentModal(true);
  };

  const handleFinalPaymentSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await api.createBooking(property.id, user.id, {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalGuests: Number(guests),
        occupantName: occupantName || user.fullName || user.name || 'Guest',
        occupantPhone: occupantPhone || '9876543210',
        totalPrice: grandTotal,
        paymentMethod: paymentMethod
      });

      if (res) {
        setConfirmedBookingId(res.id || Math.floor(100000 + Math.random() * 900000));
        setShowPaymentModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Booking payment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-widget-card">
      <div className="widget-header">
        <div className="price-display">
          <strong>₹{pricePerNight.toLocaleString()}</strong>
          <span className="unit"> / night</span>
        </div>
      </div>

      <form onSubmit={handleProceedToPayment} className="widget-form">
        {/* Date pickers calculating number of days */}
        <div className="dates-row">
          <div className="date-field">
            <label>Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div className="date-field">
            <label>Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="guests-field">
          <label>Total Guests</label>
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
        </div>

        {/* Occupant Details */}
        <div className="occupant-fields-group">
          <div className="form-subfield">
            <label>Occupant Name (Booking Under)</label>
            <div className="input-with-icon-small">
              <User size={15} className="icon-small" />
              <input
                type="text"
                placeholder="Enter occupant name"
                value={occupantName}
                onChange={(e) => setOccupantName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-subfield">
            <label>Occupant Mobile Number</label>
            <div className="input-with-icon-small">
              <Phone size={15} className="icon-small" />
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={occupantPhone}
                onChange={(e) => setOccupantPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="price-breakdown">
          <div className="breakdown-row">
            <span>₹{pricePerNight.toLocaleString()} × {nights} nights</span>
            <span>₹{baseTotal.toLocaleString()}</span>
          </div>
          <div className="breakdown-row">
            <span>Service fee (5%)</span>
            <span>₹{serviceFee.toLocaleString()}</span>
          </div>
          <hr className="breakdown-divider" />
          <div className="breakdown-row total-row">
            <strong>Total Stay Price</strong>
            <strong>₹{grandTotal.toLocaleString()}</strong>
          </div>
        </div>

        <button type="submit" className="btn-primary book-now-btn">
          <span>{user ? `Proceed to Pay ₹${grandTotal.toLocaleString()}` : 'Login to Proceed Payment'}</span>
          <ArrowRight size={18} />
        </button>

        <p className="disclaimer-text">
          {!user ? "You will be redirected to Login/Signup to complete payment" : "🔒 256-bit Secure Encrypted Checkout"}
        </p>
      </form>

      {/* Payment Checkout Modal */}
      {showPaymentModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box payment-checkout-modal">
            <div className="modal-header-row">
              <div>
                <h3>Select Payment Method</h3>
                <p className="pay-amount-subtitle">Total Amount: <strong>₹{grandTotal.toLocaleString()}</strong></p>
              </div>
              <button className="close-modal-icon-btn" onClick={() => setShowPaymentModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="payment-methods-grid">
              <button
                type="button"
                className={`pay-method-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
              >
                <QrCode size={20} />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                className={`pay-method-card ${paymentMethod === 'CARD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('CARD')}
              >
                <CreditCard size={20} />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                className={`pay-method-card ${paymentMethod === 'NETBANKING' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('NETBANKING')}
              >
                <Building2 size={20} />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                className={`pay-method-card ${paymentMethod === 'PAY_AT_CHECKIN' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('PAY_AT_CHECKIN')}
              >
                <CheckCircle2 size={20} />
                <span>Pay at Check-in</span>
              </button>
            </div>

            {/* Dynamic Payment Details Input */}
            <div className="payment-details-box">
              {paymentMethod === 'UPI' && (
                <div className="upi-payment-panel">
                  <p className="panel-instruction">Scan QR Code or enter your GPay / PhonePe / Paytm UPI ID:</p>
                  <div className="qr-preview-box">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=nestaway@icici%26pn=NestAway%20Homes%26am=${grandTotal}`}
                      alt="NestAway UPI QR Code" 
                    />
                    <span>Scan with GPay / PhonePe / Paytm</span>
                  </div>
                  <div className="upi-input-group">
                    <label>Or enter VPA / UPI ID</label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi or username@okicici"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="card-payment-panel">
                  <div className="pay-field-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      maxLength="19"
                      placeholder="4532 •••• •••• 8921"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="card-subfields-grid">
                    <div className="pay-field-group">
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength="5"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="pay-field-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        maxLength="4"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="netbanking-panel">
                  <label>Select Bank</label>
                  <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'PAY_AT_CHECKIN' && (
                <div className="checkin-pay-panel">
                  <ShieldCheck size={32} color="#10B981" />
                  <p><strong>Reserve Now, Pay on Arrival!</strong></p>
                  <p className="pay-subtext">You can pay ₹{grandTotal.toLocaleString()} in cash or UPI directly to host {property.host?.name || "Surendra"} at check-in.</p>
                </div>
              )}
            </div>

            <div className="modal-pay-footer">
              <button 
                type="button" 
                className="btn-primary complete-pay-btn" 
                onClick={handleFinalPaymentSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing Payment...' : `Pay ₹${grandTotal.toLocaleString()} & Confirm Stay`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Confirmation Modal */}
      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-content-box success-modal">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={54} color="#10B981" />
            </div>
            <h3>Payment & Booking Confirmed! 🎉</h3>
            <p>Your stay at <strong>{property.title}</strong> is fully confirmed.</p>

            <div className="booking-summary-box">
              <p><strong>Booking Ref ID:</strong> <span className="ref-code">#NEST-{confirmedBookingId}</span></p>
              <p><strong>Dates:</strong> {checkIn} to {checkOut} ({nights} Nights)</p>
              <p><strong>Occupant:</strong> {occupantName} ({occupantPhone})</p>
              <p><strong>Amount Paid:</strong> ₹{grandTotal.toLocaleString()}</p>
              <p><strong>Payment Status:</strong> <span className="badge-confirmed">PAID / CONFIRMED</span></p>
            </div>

            <button 
              className="btn-primary view-bookings-btn" 
              onClick={() => {
                setShowSuccessModal(false);
                onBookingComplete();
              }}
            >
              View Stays in My Bookings
            </button>
          </div>
        </div>
      )}

      <style>{`
        .booking-widget-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 100px;
        }

        .widget-header {
          margin-bottom: 1.25rem;
        }

        .price-display strong {
          font-size: 1.5rem;
          color: var(--text-main);
        }

        .price-display .unit {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .widget-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dates-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.5rem;
        }

        .date-field {
          display: flex;
          flex-direction: column;
        }

        .date-field label, .guests-field label, .form-subfield label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .date-field input {
          border: none;
          padding: 0.2rem 0;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .guests-field select {
          width: 100%;
          font-weight: 600;
          padding: 0.6rem;
        }

        .occupant-fields-group {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .input-with-icon-small {
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon-small {
          position: absolute;
          left: 10px;
          color: var(--text-light);
        }

        .input-with-icon-small input {
          width: 100%;
          padding: 0.5rem 0.6rem 0.5rem 2.2rem;
          font-size: 0.88rem;
        }

        .book-now-btn {
          width: 100%;
          padding: 0.9rem;
          font-size: 1rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .disclaimer-text {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .price-breakdown {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.9rem;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          color: var(--text-muted);
        }

        .breakdown-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 0.35rem 0;
        }

        .total-row {
          color: var(--text-main);
          font-size: 1.05rem;
        }

        /* Payment Checkout Modal */
        .payment-checkout-modal {
          max-width: 520px;
          width: 100%;
          padding: 2rem;
        }

        .modal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .modal-header-row h3 {
          font-size: 1.35rem;
        }

        .pay-amount-subtitle {
          color: var(--text-muted);
          font-size: 0.92rem;
          margin-top: 0.25rem;
        }

        .pay-amount-subtitle strong {
          color: #FF385C;
          font-size: 1.1rem;
        }

        .close-modal-icon-btn {
          background: #F2F2F2;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .pay-method-card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          background: white;
          font-size: 0.88rem;
          font-weight: 600;
          transition: var(--transition);
        }

        .pay-method-card.active {
          border-color: #FF385C;
          background: #FFF0F3;
          color: #FF385C;
        }

        .payment-details-box {
          background: #FAF9F6;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .panel-instruction {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
        }

        .qr-preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          border: 1px solid var(--border-light);
        }

        .qr-preview-box img {
          width: 140px;
          height: 140px;
        }

        .qr-preview-box span {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .upi-input-group label, .pay-field-group label, .netbanking-panel label {
          font-size: 0.8rem;
          font-weight: 600;
          display: block;
          margin-bottom: 0.35rem;
        }

        .upi-input-group input, .pay-field-group input, .netbanking-panel select {
          width: 100%;
          padding: 0.65rem;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }

        .card-payment-panel {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .card-subfields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .checkin-pay-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
          padding: 1rem 0;
        }

        .pay-subtext {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .complete-pay-btn {
          width: 100%;
          padding: 0.95rem;
          font-size: 1.05rem;
          font-weight: 700;
        }

        .success-modal {
          text-align: center;
          padding: 2.5rem;
          max-width: 460px;
        }

        .success-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .booking-summary-box {
          background: #F9F9F9;
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin: 1.25rem 0;
          text-align: left;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ref-code {
          color: #FF385C;
          font-weight: 700;
        }

        .view-bookings-btn {
          width: 100%;
          padding: 0.9rem;
        }
      `}</style>
    </div>
  );
};
