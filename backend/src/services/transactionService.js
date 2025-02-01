const { User, Transaction } = require("../models");                                
const axios = require("axios"); // Needed to call CHAPA API
const { v4: uuidv4 } = require("uuid");

const CHAPA_BASE_URL = "https://api.chapa.co/v1/transaction";
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY; // Store in .env

/**
 * Process a user transaction (deposit, withdrawal, bet, payout)
 */
const processTransaction = async (
  userId,
  type,
  amount,
  paymentProvider = null
) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (type === "deposit" && paymentProvider === "CHAPA") {
      // Create CHAPA payment request
      const referenceId = uuidv4();
      const response = await axios.post(
        `${CHAPA_BASE_URL}/initialize`,
        {
          amount,
          currency: "ETB",
          email: user.phoneNumber + "@fakeemail.com", // Chapa requires email
          first_name: user.username,
          tx_ref: referenceId,
          callback_url:
            "https://yourdomain.com/api/transactions/chapa-callback",
        },
        { headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` } }
      );

      if (response.data.status !== "success") {
        throw new Error("CHAPA payment initialization failed");
      }

      const transaction = await Transaction.create({
        id: uuidv4(),
        userId,
        type,
        amount,
        status: "pending",
        paymentProvider: "CHAPA",
        externalTransactionId: referenceId,
      });

      return { transaction, paymentLink: response.data.data.checkout_url };
    }

    return await Transaction.create({
      id: uuidv4(),
      userId,
      type,
      amount,
      status: "pending",
      paymentProvider,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { processTransaction };
