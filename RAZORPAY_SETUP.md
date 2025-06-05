# Razorpay Integration Setup Guide

This guide walks you through setting up Razorpay payments for the AutoApply Pro application.

## Prerequisites

1. A Razorpay account (you can create one at [razorpay.com](https://razorpay.com))
2. Access to your Razorpay API keys from the dashboard

## Setup Steps

### 1. Create your .env file

Create a `.env` file in the `/backend` directory with the following Razorpay credentials:

```
# Existing environment variables...

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_SECRET=your_razorpay_secret_here

# OpenAI API Key (already set)
OPENAI_API_KEY=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
```

Replace `your_razorpay_key_id_here` and `your_razorpay_secret_here` with your actual Razorpay API keys.

### 2. Install Dependencies

Make sure you have the required dependencies installed:

```bash
cd backend
npm install
```

### 3. Testing the Integration

To test the Razorpay integration:

1. Start the backend and frontend servers:
   ```
   # In the backend directory
   npm run dev
   
   # In a new terminal, in the frontend directory
   npm start
   ```

2. Log in to the application

3. Navigate to the AI Cover Letter page

4. Try to generate a cover letter when you have no credits remaining

5. When the Pro upgrade modal appears, click "Pay ₹299 to Upgrade"

6. For testing, you can use the following card details:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

## Razorpay Test Mode

By default, the integration uses Razorpay's test mode. In test mode:
- No actual charges will be made
- Test cards (like the one above) will work
- You'll see the transactions in your Razorpay dashboard marked as test transactions

## Going Live

Before going live with real payments:

1. Update your Razorpay account to production mode
2. Replace the test API keys with production API keys
3. Ensure your checkout page is secure (HTTPS)
4. Test the entire flow in a staging environment

## Troubleshooting

- **Payment Fails**: Check the browser console and server logs for errors
- **Verification Issues**: Ensure your Razorpay secret key is correct
- **Modal Not Opening**: Check if the Razorpay script is loading properly

For more information, refer to the [Razorpay Documentation](https://razorpay.com/docs/).
