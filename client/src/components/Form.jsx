import { useState } from "react";
import axios from "axios";

const Form = ({ setData }) => {
  const [showArrow, setShowArrow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    income: "",
    savings: "",
    risk: "low",
    goal: "",
    duration: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setShowArrow(false);
      setErrorMsg("");

      // ✅ Only ONE API call
      const res = await axios.post(
        "http://localhost:5000/api/finance/advice",
        {
          ...form,
          language: "english"
        }
      );

      setData({
        english: res.data.result,
        hindi: ""
      });

      setShowArrow(true);

    } catch (err) {
      if (err.response?.status === 429) {
        setErrorMsg("❌ Limit reached. Please wait 10-20 seconds.");
      } else {
        setErrorMsg("⚠️ Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔽 Scroll to result
  const scrollToResult = () => {
    const section = document.getElementById("result-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      {/* 🔥 FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-[350px] space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Smart Finance AI 💸
        </h2>

        {/* Income */}
        <input
          name="income"
          placeholder="Monthly Income ₹"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Savings */}
        <input
          name="savings"
          placeholder="Monthly Savings ₹"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Risk */}
        <select
          name="risk"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        {/* Goal */}
        <input
          name="goal"
          placeholder="Your Goal (car, house, etc.)"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Duration */}
        <input
          name="duration"
          placeholder="Duration (years)"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "⏳ Generating Plan..." : "Get Advice"}
        </button>

        {/* Loading Text */}
        {loading && (
          <p className="text-center text-sm text-gray-500">
            AI aapka financial plan bana raha hai...
          </p>
        )}

        {/* ❌ Error Message */}
        {errorMsg && (
          <p className="text-red-500 text-sm text-center">
            {errorMsg}
          </p>
        )}
      </form>

      {/* 🔽 Arrow (centered) */}
      {showArrow && (
        <div className="mt-6 flex justify-center w-full">
          <div
            onClick={scrollToResult}
            className="text-3xl text-blue-500 animate-bounce cursor-pointer"
          >
            ⬇️
          </div>
        </div>
      )}

    </div>
  );
};

export default Form;