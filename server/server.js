const express = require("express");
const cors = require("cors");
require("dotenv").config();

const financeRoutes = require("./routes/finance.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/finance", financeRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});