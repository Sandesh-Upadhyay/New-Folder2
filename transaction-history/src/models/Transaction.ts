import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  transactionType: { type: String, enum: ['credit', 'debit'], required: true }
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema); 