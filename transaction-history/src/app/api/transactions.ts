import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const client = await MongoClient.connect(uri);
      const db = client.db('sandesh');
      const transactionsCollection = db.collection('transactions');

      const { userId, amount, date, transactionType, token } = req.body;

      // Verify user authentication (if needed)
      if (!token || !userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const newTransaction = {
        userId,
        amount,
        date,
        transactionType,
      };

      await transactionsCollection.insertOne(newTransaction);
      client.close();

      return res.status(201).json({ message: 'Transaction added successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error adding transaction', error });
    }
  }

  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(uri);
      const db = client.db('sandesh');
      const transactionsCollection = db.collection('transactions');

      const transactions = await transactionsCollection.find({}).toArray();
      client.close();

      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching transactions', error });
    }
  }
}
