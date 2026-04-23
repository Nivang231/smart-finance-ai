import { useState, useEffect } from "react";
import Form from "./components/Form";
import Result from "./components/Result";

function App() {
  const [data, setData] = useState({ english: "", hindi: "" });
  const [formValues, setFormValues] = useState({ risk: "low" });
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Theme Configuration
  const theme = {
    bg: darkMode ? "#004643" : "#F0EDE5",
    card: darkMode ? "#003331" : "#FFFFFF",
    text: darkMode ? "#F0EDE5" : "#004643",
    border: darkMode ? "#005a56" : "#e2e8f0",
    inputBg: darkMode ? "#002b29" : "#ffffff",
    accent: "#004643"
  };

  // Load History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("finance_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (newData, params) => {
    const item = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      params,
      result: newData
    };
    const updated = [item, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("finance_history", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen transition-colors duration-500 pb-12" style={{ backgroundColor: theme.bg }}>
      <header className="shadow-md p-5 mb-8 border-b transition-all sticky top-0 z-20" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black" style={{ color: theme.text }}>SMART FINANCE AI 💸</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-5 py-2 rounded-full font-bold text-xs shadow-sm transition-transform active:scale-95"
            style={{ backgroundColor: darkMode ? "#F0EDE5" : "#004643", color: darkMode ? "#004643" : "#F0EDE5" }}
          >
            {darkMode ? "☀️ LIGHT MODE" : "🌙 NIGHT TRADER"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT COLUMN: Form & History */}
          <div className="w-full lg:w-[380px] space-y-6 lg:sticky lg:top-28">
            <Form
              setData={setData}
              setFormValues={setFormValues}
              addToHistory={addToHistory}
              darkMode={darkMode}
              theme={theme}
            />

            {history.length > 0 && (
              <div className="p-6 rounded-3xl shadow-xl border overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <h3 className="text-xs font-black mb-4 tracking-widest opacity-60" style={{ color: theme.text }}>RECENT REPORTS</h3>
                <div className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setData({
                          english: item.result.english,
                          hindi: item.result.hindi || ""
                        });
                        setFormValues(item.params);
                      }}
                      className="w-full text-left p-3 rounded-xl border transition-all hover:translate-x-1"
                      style={{ backgroundColor: darkMode ? "#002b29" : "#f8fafc", borderColor: theme.border }}
                    >
                      <p className="text-xs font-bold truncate" style={{ color: theme.text }}>{item.params.goal || "Untitled Goal"}</p>
                      <p className="text-[10px] opacity-50 font-bold" style={{ color: theme.text }}>{item.date} • {item.params.risk.toUpperCase()} RISK</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Results & Charts */}
          <div className="w-full lg:flex-1">
            <Result data={data} setData={setData} formValues={formValues} darkMode={darkMode} theme={theme} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;