import express from "express";
import {
  fundWallet,
  transferFund,
  withdrawFund,
} from "../controllers/walletController";
import { verifyToken } from "../middleware/verifyToken";

// "use strict";
const router = express.Router();

router.post("/fund-wallet", verifyToken, fundWallet);
router.post("/transfer", verifyToken, transferFund);
router.post("/withdraw", verifyToken, withdrawFund);

export default router;
