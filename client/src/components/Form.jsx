import { useState } from "react";
import axios from "axios";

const Form = ({ setData, setFormValues, addToHistory, darkMode, theme }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    income: "", savings: "", risk: "low", goal: "", duration: ""
  });

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
    setFormValues(updatedForm); // Keep App.jsx in sync for the chart
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post("http://localhost:5000/api/finance/advice", { ...form, language: "english" });
      
      const newData = { english: res.data.result, hindi: "" };
      setData(newData);
      addToHistory(newData, form);
    } catch (err) {
      setErrorMsg(err.response?.status === 429 ? "❌ Limit reached. Wait 20s." : "⚠️ Server Error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 rounded-xl border outline-none focus:ring-2 transition-all text-sm";

  return (
    <div className="p-8 rounded-3xl shadow-xl border transition-all" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>Profile Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Monthly Income (₹)", name: "income", type: "number" },
          { label: "Monthly Savings (₹)", name: "savings", type: "number" },
          { label: "Financial Goal", name: "goal", type: "text" },
          { label: "Duration (Years)", name: "duration", type: "number" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-[10px] font-black uppercase mb-1 opacity-60" style={{ color: theme.text }}>{field.label}</label>
            <input 
              {...field} 
              onChange={handleChange} 
              className={inputClass} 
              style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: darkMode ? "#F0EDE5" : "#000", "--tw-ring-color": "#004643" }} 
            />
          </div>
        ))}
        <div>
          <label className="block text-[10px] font-black uppercase mb-1 opacity-60" style={{ color: theme.text }}>Risk Level</label>
          <select 
            name="risk" 
            onChange={handleChange} 
            className={inputClass}
            style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: darkMode ? "#F0EDE5" : "#000", "--tw-ring-color": "#004643" }}
          >
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg mt-2"
          style={{ backgroundColor: loading ? "#94a3b8" : "#004643" }}
        >
          {loading ? "ANALYZING..." : "GET AI ADVICE"}
        </button>
        {errorMsg && <p className="text-red-500 text-center text-xs font-bold">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Form;