# Electron: Civic Education Platform

Electron is a full-stack civic education platform designed to empower citizens through interactive modules, AI-driven guidance, and localized content.

## 🚀 Features

### 🏛️ Interactive Civic Modules
- **Module 1: Democratic Foundations**: An introduction to the core principles of democracy, the Constitution of India, and the three branches of government (Legislature, Executive, and Judiciary).
- **Module 2: The Electoral Process**: A practical guide to voter registration (Form 6), the Model Code of Conduct, and a **3D Styled EVM (Electronic Voting Machine)** simulation that explains how votes are cast and secured.
- **Module 3: Citizen Rights & Duties**: A deep dive into Fundamental Rights, Directive Principles, and the Fundamental Duties of every Indian citizen, using real-world scenarios.
- **Module 4: Local Governance**: Understanding the 73rd and 74th Amendments, the role of Gram Panchayats, Municipal Corporations, and how citizens can participate in local decision-making.

### 🤖 AI-Powered Assistance
- **Intelligent Chat Companion**: A contextual sidebar powered by **Google Gemini AI**. It doesn't just answer general questions; it understands which module and step the user is currently on to provide tailored guidance.
- **AI Voice Guide**: Uses **Google Cloud Text-to-Speech (Wavenet)** to provide high-quality audio narrations. It automatically detects the selected language and switches to native-sounding voices (e.g., `ta-IN-Wavenet-D` for Tamil).

### 🌍 Localization & Accessibility
- **Full Multi-Language Support**: The entire platform (UI, Content, AI Chat, and Voice) is architected for localization.
  - English (Full Support)
  - Tamil (தமிழ்) (Full Support)
  - Hindi (हिन्दी) - Coming Soon
  - Telugu (తెలుగు) - Coming Soon
  - Kannada (ಕನ್ನಡ) - Coming Soon

### 🔐 Security & Reliability
- **Secure Authentication**: Robust user sign-in and sign-up powered by **Firebase Authentication**.
- **Real-time Synchronization**: All your progress and chat history are securely stored and synced across devices.
- **Privacy First**: We only store essential progress data to help you complete your civic journey.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) & React Context
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (Express.js)
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) & [Google Cloud TTS](https://cloud.google.com/text-to-speech)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Security**: [Helmet](https://helmetjs.github.io/) & [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- **Logging**: Winston

## 📁 Project Structure

```text
.
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page layouts (Module 1-4, Dashboard, etc.)
│   │   ├── lib/            # API clients and utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── gcp/            # Firebase/GCP configuration
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
├── server/                 # Backend Node.js API
│   ├── src/
│   │   ├── routes/         # Express API route definitions
│   │   ├── services/       # Business logic (Gemini, TTS, Secrets)
│   │   ├── middleware/     # Auth, CORS, Rate Limiting, Error Handling
│   │   ├── utils/          # Logger and shared utilities
│   │   └── validators/     # Request validation logic
│   └── tests/              # Unit and integration tests
├── cloudbuild.yaml         # Root deployment orchestration
└── README.md               # You are here
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- Google Cloud Project (with Secret Manager, Cloud Run, and Cloud Build enabled)
- Firebase Project

### Local Development

#### 1. Server Setup
```bash
cd server
cp .env.example .env  # Add your API keys and Firebase credentials
npm install
npm run dev
```

#### 2. Client Setup
```bash
cd client
cp .env.example .env  # Update VITE_API_BASE_URL to http://localhost:5000
npm install
npm run dev
```

The frontend will be available at `http://localhost:8080` (or `5173`).

## ☁️ Deployment

The project is configured for automated deployment to Google Cloud Platform using Cloud Build.

### 1. Deploy Server
```bash
gcloud builds submit --config server/cloudbuild.yaml .
```

### 2. Deploy Client
```bash
gcloud builds submit --config client/cloudbuild.yaml .
```

*Note: Ensure the `_SERVER_URL` substitution in `client/cloudbuild.yaml` is set correctly before deploying.*

## 🔑 Environment Variables

### Server
- `PORT`: Port to run the server (default: 8080 in prod, 3001 in dev)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `GEMINI_API_KEY`: API key for Google Gemini
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to GCP service account JSON

### Client
- `VITE_API_BASE_URL`: The full URL of the backend server
- `VITE_FIREBASE_API_KEY`: Firebase web config keys...

## 📜 License

This project is licensed under the MIT License.
