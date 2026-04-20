import { useState, useEffect } from "react";
import axios from "axios";

const Form = ({ setData, setFormValues, darkMode, theme }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    income: "",
    savings: "",
    risk: "low",
    goal: "",
    duration: ""
  });

  useEffect(() => {
    setFormValues(form);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

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

  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: darkMode ? "#F0EDE5" : "#1a202c",
    borderColor: theme.border,
  };

  return (
    <div 
      className="p-8 rounded-3xl shadow-xl border transition-all duration-500" 
      style={{ backgroundColor: theme.card, borderColor: theme.border }}
    >
      <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
        Financial Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: darkMode ? "#a5b4b1" : "#718096" }}>
            Monthly Income (₹)
          </label>
          <input
            name="income"
            type="number"
            placeholder="e.g. 60000"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border outline-none focus:ring-2 transition-all"
            style={{ ...inputStyle, "--tw-ring-color": "#004643" }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: darkMode ? "#a5b4b1" : "#718096" }}>
            Monthly Savings (₹)
          </label>
          <input
            name="savings"
            type="number"
            placeholder="e.g. 15000"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border outline-none focus:ring-2 transition-all"
            style={{ ...inputStyle, "--tw-ring-color": "#004643" }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: darkMode ? "#a5b4b1" : "#718096" }}>
            Risk Tolerance
          </label>
          <select
            name="risk"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border outline-none focus:ring-2 transition-all"
            style={{ ...inputStyle, "--tw-ring-color": "#004643" }}
          >
            <option value="low">Low Risk (Safe)</option>
            <option value="medium">Medium Risk (Balanced)</option>
            <option value="high">High Risk (Aggressive)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: darkMode ? "#a5b4b1" : "#718096" }}>
            Main Goal
          </label>
          <input
            name="goal"
            placeholder="e.g. Dream House"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border outline-none focus:ring-2 transition-all"
            style={{ ...inputStyle, "--tw-ring-color": "#004643" }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: darkMode ? "#a5b4b1" : "#718096" }}>
            Duration (Years)
          </label>
          <input
            name="duration"
            type="number"
            placeholder="e.g. 5"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border outline-none focus:ring-2 transition-all"
            style={{ ...inputStyle, "--tw-ring-color": "#004643" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all active:scale-95 shadow-lg"
          style={{ 
            backgroundColor: loading ? "#94a3b8" : "#004643",
            cursor: loading ? "not-allowed" : "pointer",
            border: darkMode ? "1px solid #005a56" : "none"
          }}
        >
          {loading ? "Generating Plan..." : "Get Advice"}
        </button>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center font-bold animate-pulse">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default Form;