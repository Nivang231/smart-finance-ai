import { useState } from "react";
import Form from "./components/Form";
import Result from "./components/Result";

function App() {
  const [data, setData] = useState({
    english: "",
    hindi: ""
  });

  return (
    <div>
      <h1>Smart Finance AI 💸</h1>
      <Form setData={setData} />
      <Result data={data} setData={setData} />
    </div>
  );
}

export default App;