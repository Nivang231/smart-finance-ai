const express = require("express");
const router = express.Router();

const { getFinancialAdvice } = require("../controllers/finance.controller");

router.post("/advice", getFinancialAdvice);

module.exports = router;