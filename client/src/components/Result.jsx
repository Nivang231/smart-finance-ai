import { useState } from "react";
import axios from "axios";

const Result = ({ data, setData }) => {
  const [lang, setLang] = useState("english");
  const [loadingHindi, setLoadingHindi] = useState(false);

  const text = lang === "english" ? data.english : data.hindi;

  // 🔥 Hindi fetch function
  const handleHindi = async () => {
    setLang("hindi");

    if (!data.hindi) {
      try {
        setLoadingHindi(true);

        const res = await axios.post(
          "http://localhost:5000/api/finance/advice",
          {
            text: data.english,
            language: "hindi",
            translate: true
          }
        );

        setData((prev) => ({
          ...prev,
          hindi: res.data.result
        }));
        console.log("Hindi API response:", res.data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoadingHindi(false);
      }
    }
  };

  return (
    <div
      id="result-section"
      className="min-h-screen bg-gray-100 flex justify-center items-start p-4"
    >
      <div className="bg-white w-full max-w-md p-5 rounded-2xl shadow-lg">

        {/* Header */}
        <h2 className="text-xl font-bold text-center mb-4">
          AI Financial Plan 📊
        </h2>

        {/* 🔥 Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 rounded-full p-1 flex">

            <button
              onClick={() => setLang("english")}
              className={`px-4 py-1 rounded-full text-sm ${
                lang === "english"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
            >
              🇺🇸 EN
            </button>

            <button
              onClick={handleHindi}
              className={`px-4 py-1 rounded-full text-sm ${
                lang === "hindi"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }`}
            >
              🇮🇳 HI
            </button>

          </div>
        </div>

        {/* 🔥 Output */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
            {lang === "hindi" && loadingHindi
              ? "⏳ Translating to Hindi..."
              : text || "Fill the form to get your financial plan..."}
          </pre>
        </div>

      </div>
    </div>
  );
};

export default Result;