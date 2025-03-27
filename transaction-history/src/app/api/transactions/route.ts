import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '6b96c4730cf3286aaab06a7aff1c40900b23af579edbe26953e104dc5dd0a75e';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const token = searchParams.get('token');

    if (!userId || !token) {
      return NextResponse.json({ error: 'User ID and token are required' }, { status: 400 });
    }

    try {
      if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
        throw new Error('JWT_SECRET is not defined or invalid');
      }
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error instanceof Error ? error.message : String(error));
      return NextResponse.json({ error: 'Invalid or malformed token' }, { status: 401 });
    }

    await dbConnect();

    const filter: any = { userId };
    if (fromDate && toDate) {
      filter.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, amount, transactionType, token } = await request.json();

    if (!userId || !amount || !transactionType || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error instanceof Error ? error.message : String(error));
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    await dbConnect();

    const newTransaction = new Transaction({
      userId,
      amount,
      transactionType,
      date: new Date()
    });

    await newTransaction.save();

    return NextResponse.json({ message: 'Transaction added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
