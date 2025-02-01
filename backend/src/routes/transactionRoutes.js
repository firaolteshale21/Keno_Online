const express = require("express");
const router = express.Router();
const { processTransaction } = require("../services/transactionService");
const { Transaction } = require("../models");

/**
 * Deposit Money
 */
router.post("/deposit", async (req, res) => {
  try {
    const { userId, amount, paymentProvider } = req.body;
    const transaction = await processTransaction(
      userId,
      "deposit",
      amount,
      paymentProvider
    );
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Withdraw Money
 */
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount, paymentProvider } = req.body; // Added paymentProvider
    const transaction = await processTransaction(
      userId,
      "withdrawal",
      amount,
      paymentProvider
    );
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Get Transaction History
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.findAll({ where: { userId } });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
