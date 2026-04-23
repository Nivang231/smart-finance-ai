import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const Result = ({ data, setData, formValues, darkMode, theme }) => {
  const [lang, setLang] = useState("english");
  const [loadingHindi, setLoadingHindi] = useState(false);

  // CRITICAL FIX: Reset language to English when a new history item is selected
  // This prevents showing a blank Hindi screen for a new report.
  useEffect(() => {
    setLang("english");
  }, [data.english]);

  const text = lang === "english" ? data.english : data.hindi;

  const chartData = useMemo(() => {
    const levels = {
      low: [{ name: "Safe/Debt", val: 60, col: "#004643" }, { name: "Emergency", val: 30, col: "#4d7e7b" }, { name: "Gold", val: 10, col: "#8b9c9a" }],
      medium: [{ name: "Index Funds", val: 50, col: "#004643" }, { name: "Mutual Funds", val: 30, col: "#4d7e7b" }, { name: "Cash/Gold", val: 20, col: "#8b9c9a" }],
      high: [{ name: "Equities", val: 60, col: "#004643" }, { name: "Small Cap", val: 30, col: "#4d7e7b" }, { name: "Crypto/Spec", val: 10, col: "#8b9c9a" }]
    };
    return levels[formValues?.risk] || levels.low;
  }, [formValues?.risk]);

  const handleHindi = async () => {
    setLang("hindi");
    // Only call the API if we don't already have the Hindi translation for this specific data
    if (!data.hindi && data.english) {
      try {
        setLoadingHindi(true);
        const res = await axios.post("http://localhost:5000/api/finance/advice", { 
          text: data.english, 
          language: "hindi", 
          translate: true 
        });
        
        setData(prev => ({ ...prev, hindi: res.data.result }));
      } catch (err) { 
        console.error("Translation failed:", err); 
      } finally { 
        setLoadingHindi(false); 
      }
    }
  };

  return (
    <div className="rounded-3xl shadow-xl border overflow-hidden min-h-[600px] flex flex-col transition-all duration-500" 
         style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      
      {/* Header with Language Toggle */}
      <div className="p-6 border-b flex justify-between items-center" 
           style={{ backgroundColor: darkMode ? "#002b29" : "#f8fafc", borderColor: theme.border }}>
        <h2 className="font-bold" style={{ color: theme.text }}>Investment Strategy</h2>
        
        <div className="flex bg-gray-200 p-1 rounded-lg" style={{ backgroundColor: darkMode ? "#004643" : "#e2e8f0" }}>
          {["english", "hindi"].map(l => (
            <button 
              key={l} 
              onClick={() => l === "hindi" ? handleHindi() : setLang("english")}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${lang === l ? "bg-white shadow-sm" : "opacity-50"}`}
              style={{ color: "#004643" }}
            >
              {l === "hindi" ? "🇮🇳 HINDI" : "🇺🇸 ENGLISH"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 space-y-8 flex-grow">
        {/* Dynamic Chart Section */}
        {(data.english || loadingHindi) && (
          <div className="h-64 w-full rounded-2xl p-4 shadow-inner" 
               style={{ backgroundColor: darkMode ? "#002b29" : "#f1f5f9" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="val" animationDuration={1000}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.col} stroke={theme.card} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme.card, borderRadius: '10px', border: `1px solid ${theme.border}`, color: theme.text }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Advice Content Section */}
        <div className="flex-grow">
          {loadingHindi ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 mb-4" style={{ borderColor: theme.text }}></div>
              <p className="text-center font-bold tracking-widest text-xs" style={{ color: theme.text }}>TRANSLATING REPORT...</p>
            </div>
          ) : text ? (
            <div className="p-6 rounded-2xl border-l-8 animate-fadeIn" 
                 style={{ backgroundColor: darkMode ? "#003d3a" : "#f1f5f9", borderColor: "#004643" }}>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" 
                   style={{ color: darkMode ? "#F0EDE5" : "#334155" }}>
                {text}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
              <span className="text-6xl mb-4">📊</span>
              <p className="font-bold uppercase tracking-tighter" style={{ color: theme.text }}>Ready for your analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;