// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [orderType, setOrderType] = useState("dinein");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  return (
    <div className="min-h-screen bg-[hsl(30_25%_98%)] flex justify-center px-3 py-6 md:py-10">
      {/* Mobile = phone-like; Desktop = centered wide card */}
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden flex flex-col md:rounded-2xl">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b md:py-4">
          <button className="text-gray-600 text-xl leading-none">&lt;</button>
          <h1 className="text-base md:text-lg font-semibold text-gray-800">
            Checkout
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-5 md:space-y-6">
          {/* Order Type */}
          <section className="bg-[hsl(30_25%_98%)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
              Order Type
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {/* DINE IN */}
              <button
                onClick={() => setOrderType("dinein")}
                className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-3 text-xs md:text-sm font-medium transition ${
                  orderType === "dinein"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-transparent text-gray-600"
                }`}
              >
                <span className="text-xl md:text-2xl mb-1">🍽️</span>
                <span>Dine In</span>
              </button>

              {/* TAKEAWAY */}
              <button
                onClick={() => setOrderType("takeaway")}
                className={`flex flex-col items-center justify-center rounded-2xl border px-3 py-3 text-xs md:text-sm font-medium transition ${
                  orderType === "takeaway"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-transparent text-gray-600"
                }`}
              >
                <span className="text-xl md:text-2xl mb-1">🛍️</span>
                <span>Takeaway</span>
              </button>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-[hsl(30_25%_98%)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
              Payment Method
            </h2>

            <div className="space-y-2">
              {/* UPI */}
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm md:text-base transition ${
                  paymentMethod === "upi"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">📱</span>
                  <span>UPI / Google Pay</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "upi"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                />
              </button>

              {/* CARD */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm md:text-base transition ${
                  paymentMethod === "card"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">💳</span>
                  <span>Credit / Debit Card</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "card"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                />
              </button>

              {/* COD */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm md:text-base transition ${
                  paymentMethod === "cod"
                    ? "border-orange-400 bg-white text-orange-500 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl">💵</span>
                  <span>Cash on Delivery</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "cod"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-[hsl(30_25%_98%)] rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-3">
              Order Summary
            </h2>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y text-sm md:text-base">
              <div className="flex justify-between items-center px-3 py-3">
                <span>Margherita Pizza x1</span>
                <span className="font-medium">₹399</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹399</span>
              </div>
              <div className="px-3 py-2 flex justify-between text-gray-500">
                <span>Taxes</span>
                <span>₹20</span>
              </div>
              <div className="px-3 py-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹419</span>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Action */}
        <footer className="px-4 pb-5 pt-2 md:pb-6">
            <Link to="/order">
          <button className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 md:py-4 text-sm md:text-base shadow-md">
            Place Order · ₹419
          </button>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default CheckoutPage;
