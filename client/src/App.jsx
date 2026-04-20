import { useState } from "react";
import Form from "./components/Form";
import Result from "./components/Result";

function App() {
  const [formValues, setFormValues] = useState({ risk: 'low' });
  const [data, setData] = useState({
    english: "",
    hindi: ""
  });
  const [darkMode, setDarkMode] = useState(false);

  // Theme configuration
  const theme = {
    bg: darkMode ? "#004643" : "#F0EDE5",
    card: darkMode ? "#003331" : "#FFFFFF",
    text: darkMode ? "#F0EDE5" : "#004643",
    border: darkMode ? "#005a56" : "#e2e8f0",
    inputBg: darkMode ? "#002b29" : "#ffffff"
  };

  return (
    
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      {/* Header */}
      <header 
        className="shadow-md p-5 mb-8 border-b transition-colors duration-500 sticky top-0 z-10" 
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            SMART FINANCE AI <span className="text-xl">💸</span>
          </h1>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm"
            style={{ 
              backgroundColor: darkMode ? "#F0EDE5" : "#004643", 
              color: darkMode ? "#004643" : "#F0EDE5" 
            }}
          >
            {darkMode ? "☀️ LIGHT MODE" : "🌙 NIGHT TRADER"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side: Form */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-28">
            <Form setData={setData} setFormValues={setFormValues} darkMode={darkMode} theme={theme} />
          </div>

          {/* Right Side: Result */}
          <div className="w-full lg:flex-1">
            <Result data={data} setData={setData} formValues={formValues} darkMode={darkMode} theme={theme} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;