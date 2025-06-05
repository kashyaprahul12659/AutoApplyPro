# Environment Variables Setup Instructions

Follow these steps to set up your environment variables with the provided API keys.

## Setting up your .env file

1. Create a new file named `.env` in the `backend` directory:
   ```
   C:\Users\POOJA\AutoApplyPro\backend\.env
   ```

2. Add the following content to the file:

```
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/autoapply-pro

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# File Upload Configuration
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes

# OpenAI API Configuration
OPENAI_API_KEY=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

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_8z4ovLkWO6K2P7
RAZORPAY_SECRET=9L8NUuskZBqKAmR0UPFZzeYf
```

3. Replace `your_jwt_secret_key_here` with a strong, random string for JWT authentication.

## Important Security Notes

1. **NEVER commit the `.env` file to version control.** This file contains sensitive API keys and secrets.

2. **These are LIVE Razorpay credentials.** Any transactions will be real and will charge actual money. For testing purposes, consider creating test credentials in the Razorpay dashboard.

3. Keep your API keys confidential and do not share them with unauthorized individuals.

## Verifying the Setup

After creating the `.env` file:

1. Restart your backend server:
   ```
   cd backend
   npm run dev
   ```

2. Verify the integration by testing the Razorpay payment flow in a controlled environment first.

## Next Steps

Once you've verified that the integration works correctly, you may want to:

1. Create test credentials in Razorpay for development
2. Set up proper error handling for production use
3. Implement webhook notifications for payment status updates
