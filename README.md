# FinAI – Mobile Personal Finance Assistant

FinAI is a mobile application built with React Native (Expo) to help users manage their expenses and receive AI-generated financial insights. It integrates with Supabase for backend services and Hugging Face for AI features.

## Features

- Expense tracking with a simple user interface
- Support logging daily expenses using OCR receipt scanning
- AI-generated financial tips using Google Gemma Model via Hugging Face API
- Real-time data sync and user management with Supabase
- Secure handling of API keys and environment variables

## Tech Stack

- React Native (Expo)
- Supabase (Database, Auth, Realtime)
- Hugging Face Inference API
- TypeScript

## Getting Started
### 1. Clone the Repository
git clone https://github.com/your-username/FinAI.git

cd FinAI

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
Create a .env file in the root directory:

SUPABASE_URL=https://your-supabase-url.supabase.co

SUPABASE_ANON_KEY=your-supabase-anon-key

HF_API_TOKEN=your-huggingface-api-token

Note: Make sure .env is listed in .gitignore to avoid pushing secrets.

### 4. Start the app using Expo Go App
npx expo start


