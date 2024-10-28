# Tax Claim Management System

A comprehensive web application for managing tax claims between sales representatives and customers. Built with React, TypeScript, Material UI, and Firebase.

## 🚀 Features

- **Authentication System**
  - Email/Password login for sales representatives
  - Passwordless email link authentication
  - Password reset functionality
  - Role-based access control

- **Sales Representative Features**
  - Dashboard with claim statistics
  - Customer management
  - Claim status tracking
  - Document management
  - Profile and password management

- **Customer Features**
  - Claim submission and tracking
  - Document upload
  - Status updates
  - Communication with sales representatives

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: Material UI, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Routing**: React Router
- **Testing**: Vitest, Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── claims/        # Claim-related components
│   ├── layout/        # Layout components
│   ├── sales/         # Sales-specific components
│   └── ui/            # Base UI components
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and services
├── pages/            # Page components
└── types/            # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tax-claim-management.git
   cd tax-claim-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_USE_DUMMY_DATA=true  # Set to false for production
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)

2. Enable Authentication methods:
   - Email/Password
   - Email link (passwordless)

3. Create Firestore Database:
   - Start in production mode
   - Choose a location
   - Set up security rules

4. Set up Firebase Storage:
   - Create storage bucket
   - Configure security rules

5. Initialize Firebase collections:
   - The application will automatically create required collections on first run
   - Default collections: users, claims, allowedSalesEmails

### Development Mode

- Set `VITE_USE_DUMMY_DATA=true` to use mock data
- Test accounts available:
  - Sales: sales@test.com
  - Customer: customer@test.com

### Production Deployment

1. Update environment variables:
   ```env
   VITE_USE_DUMMY_DATA=false
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy to hosting:
   ```bash
   firebase deploy
   ```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_FIREBASE_API_KEY | Firebase API Key | Yes |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase Auth Domain | Yes |
| VITE_FIREBASE_PROJECT_ID | Firebase Project ID | Yes |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase Storage Bucket | Yes |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase Messaging Sender ID | Yes |
| VITE_FIREBASE_APP_ID | Firebase App ID | Yes |
| VITE_USE_DUMMY_DATA | Toggle mock data (true/false) | No |

## 🧪 Testing

Run tests:
```bash
npm run test           # Run tests once
npm run test:watch    # Run tests in watch mode
```

## 🔍 Code Quality

- Run linting:
  ```bash
  npm run lint
  ```

- Format code:
  ```bash
  npm run format
  ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.