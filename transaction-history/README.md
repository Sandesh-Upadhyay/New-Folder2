# Transaction History System

A Next.js application that displays transaction history with MongoDB integration and JWT authentication.

## Features

- Simple user authentication with User ID
- Transaction history display with date filtering
- MongoDB integration for data storage
- JWT-based authentication
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- MongoDB running locally or a MongoDB Atlas connection string
- npm or yarn package manager

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your User ID to log in
3. View your transaction history
4. Use the date filters to view transactions for specific date ranges
5. Click the logout button to sign out

## API Endpoints

### GET /api/transactions

Fetches transactions based on the following query parameters:
- `userId` (Required): The user's ID
- `fromDate` (Optional): Start date for filtering transactions
- `toDate` (Optional): End date for filtering transactions
- `token` (Required): JWT token for authentication

## Security Notes

- Change the `JWT_SECRET` in production
- Use HTTPS in production
- Implement proper user authentication in a production environment
- Add rate limiting for API endpoints
- Add input validation and sanitization
