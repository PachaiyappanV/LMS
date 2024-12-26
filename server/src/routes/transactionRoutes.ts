import express from "express";
import {
  createStripePaymentIntent,
  createTransaction,
  getTransactions,
} from "../controllers/transactionController";

const router = express.Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;
