import { useState, useMemo } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Result = ({ data, setData, darkMode, theme, formValues }) => {
  const [lang, setLang] = useState("english");
  const [loadingHindi, setLoadingHindi] = useState(false);

  const text = lang === "english" ? data.english : data.hindi;

  // Logic to determine chart data based on user's selected risk
  const chartData = useMemo(() => {
    const allocations = {
      low: [
        { name: "FD/Debt", value: 50, color: "#004643" },
        { name: "Gold", value: 20, color: "#005a56" },
        { name: "Emergency Fund", value: 30, color: "#8b9c9a" },
      ],
      medium: [
        { name: "Index Funds", value: 40, color: "#004643" },
        { name: "Mutual Funds", value: 30, color: "#005a56" },
        { name: "Debt/Gold", value: 20, color: "#4d7e7b" },
        { name: "Cash", value: 10, color: "#8b9c9a" },
      ],
      high: [
        { name: "Direct Equity", value: 50, color: "#004643" },
        { name: "Small Cap", value: 25, color: "#005a56" },
        { name: "International", value: 15, color: "#4d7e7b" },
        { name: "Crypto/Alt", value: 10, color: "#8b9c9a" },
      ],
    };
    return allocations[formValues?.risk] || allocations.medium;
  }, [formValues?.risk]);

  const handleHindi = async () => {
    setLang("hindi");
    if (!data.hindi && data.english) {
      try {
        setLoadingHindi(true);
        const res = await axios.post("http://localhost:5000/api/finance/advice", {
          text: data.english,
          language: "hindi",
          translate: true,
        });
        setData((prev) => ({ ...prev, hindi: res.data.result }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingHindi(false);
      }
    }
  };

  return (
    <div className="w-full min-h-[500px] flex flex-col">
      <div 
        className="rounded-3xl shadow-xl border flex-grow flex flex-col overflow-hidden transition-all duration-500"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ backgroundColor: darkMode ? "#002b29" : "#f8fafc", borderColor: theme.border }}
        >
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>
            AI Financial Roadmap 📈
          </h2>

          <div className="flex p-1 rounded-xl shadow-inner" style={{ backgroundColor: darkMode ? "#004643" : "#e2e8f0" }}>
            <button
              onClick={() => setLang("english")}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${lang === "english" ? "bg-white shadow-md" : "text-gray-500"}`}
              style={{ color: lang === "english" ? "#004643" : "" }}
            >🇺🇸 ENGLISH</button>
            <button onClick={handleHindi} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${lang === "hindi" ? "bg-white shadow-md" : "text-gray-500"}`}
              style={{ color: lang === "hindi" ? "#004643" : "" }}
            >🇮🇳 HINDI</button>
          </div>
        </div>

        <div className="p-8 flex-grow">
          {!text && !loadingHindi ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
              <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: theme.bg }}>📋</div>
              <p className="text-lg font-medium" style={{ color: theme.text }}>Submit your details to generate your plan.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* --- NEW CHART SECTION --- */}
              <div className="w-full h-64 rounded-2xl p-6 transition-all " style={{ backgroundColor: darkMode ? "#002b29" : "#f1f5f9" }}>
                <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-2" style={{ color: theme.text }}>Suggested Asset Allocation</h3>
                <ResponsiveContainer width="100%" height="100%" >
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={theme.card} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, color: theme.text }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Advice Text */}
              {lang === "hindi" && loadingHindi ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.text }}></div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border-l-8" style={{ backgroundColor: darkMode ? "#003d3a" : "#f1f5f9", borderColor: "#004643" }}>
                  <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed" style={{ color: darkMode ? "#F0EDE5" : "#334155" }}>
                    {text}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;