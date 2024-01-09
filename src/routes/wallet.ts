import express from "express";
const { verifyToken } = require("../middleware/verifyToken");
const knex = require("../database/db"); // Import the Knex configuration

const router = express.Router();

// Fund User's Account
router.post("/fund-wallet", verifyToken, async (req: any, res: any) => {
  try {
    const { userId, amount } = req.body;
    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Check if an account exists for the user
    const existingAccount = await knex("accounts")
      .where({ user_id: userId })
      .first();
    if (!existingAccount) {
      // If check if user exists
      const user = await knex("users").where({ id: userId }).first();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // If account doesn't exist, create a new account for the user
      await knex("accounts").insert({
        user_id: userId,
        balance: parseFloat(amount),
        firstname: user.firstname,
        lastname: user.lastname,
      });
      return res.status(200).json({
        message: "Funds added successfully",
        balance: `₦${amount}`,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    }

    // Update user's account balance in the database
    // If account exists, update the balance
    const updatedBalance = existingAccount.balance + parseFloat(amount);
    await knex("accounts")
      .where({ user_id: userId })
      .update({ balance: updatedBalance });

    const user = await knex("users").where({ id: userId }).first();
    return res.status(200).json({
      message: "Funds added successfully",
      userName: user.username,
      balance: `₦${updatedBalance}`,
    });
  } catch (error) {
    console.error("Error funding account: ", error);
    return res.status(500).json({ error: "Error funding account" });
  }
});

// Transfer Funds to Another User
router.post("/transfer", async (req: any, res: any) => {
  try {
    const { senderId, recipientId, amount } = req.body;
    // Validate sender and recipient IDs
    const sender = await knex("users").where({ id: senderId }).first();
    const recipient = await knex("users").where({ id: recipientId }).first();
    if (!sender || !recipient) {
      return res.status(404).json({ error: "Sender or recipient not found" });
    }

    // Validate sender has sufficient funds
    if (sender.balance < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient funds for transfer" });
    }

    // Update sender and recipient account balances in the database
    const senderUpdatedBalance = sender.balance - parseFloat(amount);
    const recipientUpdatedBalance = recipient.balance + parseFloat(amount);

    await knex.transaction(async (trx: any) => {
      await trx("users")
        .where({ id: senderId })
        .update({ balance: senderUpdatedBalance });
      await trx("users")
        .where({ id: recipientId })
        .update({ balance: recipientUpdatedBalance });
      // Log the transaction
      // e.g., trx("transactions").insert({ sender_id: senderId, recipient_id: recipientId, amount });
    });

    return res.status(200).json({ message: "Funds transferred successfully" });
  } catch (error) {
    console.error("Error transferring funds: ", error);
    return res.status(500).json({ error: "Error transferring funds" });
  }
});

// Withdraw Funds from User's Account
router.post("/withdraw", async (req: any, res: any) => {
  try {
    const { userId, amount } = req.body;
    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Check if user exists
    const user = await knex("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate user has sufficient funds
    if (user.balance < parseFloat(amount)) {
      return res
        .status(400)
        .json({ error: "Insufficient funds for withdrawal" });
    }

    // Update user's account balance in the database
    const updatedBalance = user.balance - parseFloat(amount);
    await knex("users")
      .where({ id: userId })
      .update({ balance: updatedBalance });

    return res.status(200).json({
      message: "Funds withdrawn successfully",
      balance: updatedBalance,
    });
  } catch (error) {
    console.error("Error withdrawing funds: ", error);
    return res.status(500).json({ error: "Error withdrawing funds" });
  }
});

module.exports = router;
