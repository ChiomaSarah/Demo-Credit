import { Request, Response } from "express";
const knex = require("../database/db");

export const fundWallet = async (req: Request, res: Response) => {
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
};

// Transfer Funds to Another User
export const transferFund = async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId, amount } = req.body;

    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Fetch sender and recipient account details
    const senderAccount = await knex("accounts")
      .where({ user_id: senderId })
      .first();

    const recipientAccount = await knex("accounts")
      .where({ user_id: recipientId })
      .first();

    if (!senderAccount || !recipientAccount) {
      return res
        .status(404)
        .json({ error: "Sender or recipient account not found" });
    }

    if (senderAccount.balance < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient funds for transfer" });
    }

    // Use Knex transaction to ensure atomicity of database operations
    await knex.transaction(async (trx: any) => {
      // Update sender's account balance
      const updatedSenderBalance = senderAccount.balance - parseFloat(amount);
      await trx("accounts")
        .where({ user_id: senderId })
        .update({ balance: updatedSenderBalance });

      // Update recipient's account balance
      const updatedRecipientBalance =
        recipientAccount.balance + parseFloat(amount);
      await trx("accounts")
        .where({ user_id: recipientId })
        .update({ balance: updatedRecipientBalance });

      // Insert transaction record into the transactions table
      await trx("transactions").insert({
        sender_id: senderId,
        recipient_id: recipientId,
        amount: parseFloat(amount),
      });

      return res.status(200).json({
        message: `You have successfully transferred ₦${amount}.`,
        sender: {
          user_id: senderAccount.user_id,
          balance: updatedSenderBalance,
        },
        recipient: {
          user_id: recipientAccount.user_id,
          balance: updatedRecipientBalance,
        },
      });
    });
  } catch (error) {
    console.error("Error transferring funds: ", error);
    return res.status(500).json({ error: "Error transferring funds" });
  }
};

// Withdraw Funds from User's Account
export const withdrawFund = async (req: Request, res: Response) => {
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
};

// Other user-related operations...
