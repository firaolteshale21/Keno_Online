const express = require("express");
const router = express.Router();
const { Transaction, User } = require("../models");
const axios = require("axios");

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

/**
 * CHAPA Webhook - Listen for Payment Confirmation
 */
router.post("/chapa-callback", async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    // Find the transaction in the database
    const transaction = await Transaction.findOne({ where: { externalTransactionId: tx_ref } });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Verify the transaction with CHAPA
    const chapaResponse = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
    });

    if (chapaResponse.data.status !== "success" || chapaResponse.data.data.status !== "success") {
      return res.status(400).json({ error: "Payment not verified" });
    }

    // Update transaction status
    transaction.status = "completed";
    await transaction.save();

    // Update user balance
    const user = await User.findByPk(transaction.userId);
    if (user) {
      await user.increment("balance", { by: transaction.amount });
    }

    return res.status(200).json({ message: "Payment successful", transaction });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
