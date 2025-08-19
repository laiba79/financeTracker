const mongoose = require("mongoose");

const recurringTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, default: "cash" },
    description: { type: String, default: "" },
    currency: { type: String, default: "USD" },

    // frequency: daily, weekly, monthly, yearly; runs based on nextRunAt
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], required: true },
    nextRunAt: { type: Date, required: true },
    lastRunAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecurringTransaction", recurringTransactionSchema);
