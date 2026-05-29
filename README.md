<div align="center">

# 🤖 InterviewIQ — AI Interview Preparation Platform

### Ace Your Next Interview with AI-Powered Practice

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A full-stack SaaS application where users upload resumes, practice with AI-generated interview questions, receive intelligent feedback, and purchase credits via Razorpay.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Setup](#-getting-started) · [API Docs](#-api-endpoints) · [Author](#-author)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google Authentication** | Secure sign-in via Firebase with JWT session management |
| 📄 **Resume Upload & Analysis** | Upload PDF resume → AI extracts and analyzes your skills |
| 🤖 **AI-Powered Questions** | Google Gemini generates 10 personalized questions (technical + behavioral + HR) |
| 💬 **Chat-Style Interview** | Interactive Q&A interface with real-time AI feedback per answer |
| 📊 **Smart Scoring** | Score per question (0-10) + overall score (0-100) + strengths & improvements |
| 💰 **Credit System** | 5 free credits on signup, buy more via Razorpay (₹99 / ₹199 / ₹399 packs) |
| 💳 **Razorpay Payments** | Secure payment integration with HMAC-SHA256 signature verification |
| 🎨 **Premium Dark UI** | Glassmorphism design with Framer Motion animations |
| 📱 **Fully Responsive** | Works on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI component library |
| **Vite** | Fast build tool & dev server |
| **Tailwind CSS v4** | Utility-first CSS styling |
| **Redux Toolkit** | Global state management |
| **Framer Motion** | Page transitions & animations |
| **Axios** | HTTP client with interceptors |
| **React Router v6** | Client-side routing |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js v5** | REST API framework |
| **MongoDB + Mongoose** | Database + ODM |
| **Firebase Admin SDK** | Server-side auth verification |
| **Google Gemini 2.0 Flash** | AI question generation & evaluation |
| **Razorpay SDK** | Payment order creation & verification |
| **Multer** | PDF file upload handling |
| **pdf-parse** | PDF text extraction |
| **JWT** | API authentication tokens |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   CLIENT (React + Vite)                       │
│   Redux Toolkit  │  React Router  │  Framer Motion           │
│                  │                │                           │
│            Axios (REST API)   Firebase Auth (Google)          │
└──────────┬───────────────────────┬───────────────────────────┘
           │                       │
           ▼                       ▼
┌──────────────────────────────────────────────────────────────┐
│                  SERVER (Express.js + Node.js)                │
│                                                              │
│   Auth Routes  │  Interview Routes  │  Payment Routes        │
│       │        │         │          │        │               │
│   JWT Auth     │  Multer + pdf-parse│  HMAC Verification     │
│  Middleware     │                   │                         │
│       │        │         │          │        │               │
│   Controllers  │    Controllers     │   Controllers          │
└───────┬────────┴─────────┬──────────┴────────┬───────────────┘
        │                  │                   │
        ▼                  ▼                   ▼
  ┌──────────┐      ┌──────────┐        ┌──────────┐
  │ MongoDB  │      │ Gemini   │        │ Razorpay │
  │ Atlas    │      │ AI API   │        │ API      │
  └──────────┘      └──────────┘        └──────────┘
```

---

## 📁 Project Structure

```
InterviewIQ/
├── Server/                          # Express.js Backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── firebase.js              # Firebase Admin SDK
│   │   ├── gemini.js                # Gemini AI client
│   │   └── razorpay.js              # Razorpay instance
│   ├── controllers/
│   │   ├── authController.js        # Login, profile, logout
│   │   ├── interviewController.js   # Start, answer, complete
│   │   └── paymentController.js     # Orders, verify, history
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── upload.js                # Multer PDF config
│   ├── models/
│   │   ├── User.js                  # User + credits schema
│   │   ├── Interview.js             # Interview + questions
│   │   └── Payment.js               # Payment records
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── aiPrompts.js             # Structured Gemini prompts
│   │   └── extractPdfText.js        # PDF text extraction
│   ├── index.js                     # Server entry point
│   └── .env.example                 # Env template
│
├── Client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── config/firebase.js       # Firebase client config
│   │   ├── store/                   # Redux (store, userSlice, interviewSlice)
│   │   ├── utils/api.js             # Axios with interceptors
│   │   ├── components/              # Navbar, Footer, ProtectedRoute
│   │   ├── pages/                   # Home, Login, Dashboard, Interview, Results, Pricing
│   │   ├── App.jsx                  # Router setup
│   │   ├── main.jsx                 # Entry + Redux Provider
│   │   └── index.css                # Design system
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/atlas))
- **Firebase** project ([console](https://console.firebase.google.com/))
- **Razorpay** test account ([dashboard](https://dashboard.razorpay.com/))
- **Google Gemini API** key ([AI Studio](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/raj-1807/InterviewIQ.git
cd InterviewIQ
```

### 2. Setup Backend

```bash
cd Server
npm install
```

Create `.env` from the template:
```bash
cp .env.example .env
```

Fill in your keys in `.env`:
```env
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/interviewiq
JWT_SECRET = your-random-secret-string
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
RAZORPAY_KEY_ID = rzp_test_xxxxx
RAZORPAY_KEY_SECRET = your_secret
GEMINI_API_KEY = AIzaSyxxxxxxxxxx
CLIENT_URL = http://localhost:5173
```

### 3. Setup Frontend

```bash
cd ../Client
npm install
```

Update Firebase config in `src/config/firebase.js` with your Firebase web app credentials.

### 4. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd Server
npm run dev        # Starts on http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd Client
npm run dev        # Starts on http://localhost:5173
```

> 💡 The Vite dev server proxies `/api` requests to the backend automatically.

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/google` | ❌ | Verify Firebase token → return JWT |
| `GET` | `/api/auth/me` | ✅ | Get user profile |
| `POST` | `/api/auth/logout` | ✅ | Clear session |
| `POST` | `/api/interview/start` | ✅ | Upload resume + generate questions |
| `POST` | `/api/interview/answer` | ✅ | Submit answer → get AI feedback |
| `POST` | `/api/interview/complete` | ✅ | Finish interview → overall score |
| `GET` | `/api/interview/history` | ✅ | Interview history |
| `GET` | `/api/interview/:id` | ✅ | Interview details |
| `POST` | `/api/payment/create-order` | ✅ | Create Razorpay order |
| `POST` | `/api/payment/verify` | ✅ | Verify payment + add credits |
| `GET` | `/api/payment/history` | ✅ | Payment history |
| `GET` | `/api/payment/packages` | ❌ | Available credit packages |

---

## 💳 Credit Packages

| Pack | Credits | Price | Per Credit |
|------|---------|-------|------------|
| Basic | 10 | ₹99 | ₹9.90 |
| Standard | 25 | ₹199 | ₹7.96 |
| Premium | 60 | ₹399 | ₹6.65 |

> New users receive **5 free credits** on signup.

---

## 🔐 Security

- **Firebase Auth** — Google OAuth 2.0 with ID token verification
- **JWT** — HTTP-only cookies with 7-day expiry
- **HMAC-SHA256** — Razorpay payment signature verification
- **CORS** — Restricted to frontend origin
- **Multer** — File type validation (PDF only, 5MB max)
- **Input validation** — Server-side checks on all endpoints

---

## 🤖 AI Integration

Powered by **Google Gemini 2.0 Flash** with 3 structured prompts:

1. **Question Generation** — Analyzes resume + job role → generates 6 technical + 2 behavioral + 2 HR questions
2. **Answer Evaluation** — Evaluates each answer → returns score (0-10) + detailed feedback
3. **Overall Assessment** — Generates overall score (0-100) + strengths + areas for improvement

---

## 📸 Screenshots

> _Add screenshots of your running application here_

<!-- 
![Home Page](screenshots/home.png)
![Dashboard](screenshots/dashboard.png)
![Interview](screenshots/interview.png)
![Results](screenshots/results.png)
-->

---

## 🗺️ Future Enhancements

- [ ] 🎙️ Voice interview mode (speech-to-text)
- [ ] 📥 Download results as PDF report
- [ ] ⏱️ Timed interview sessions
- [ ] 🔔 Razorpay webhook integration
- [ ] 📊 Admin analytics dashboard
- [ ] 🌐 Deploy on Render / Vercel

---

## 👤 Author

<table>
  <tr>
    <td align="center">
      <strong>Raj Barsaiya</strong><br/>
      Full-Stack Developer<br/><br/>
      <a href="https://github.com/raj-1807">
        <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for learning and portfolio purposes.

---

<div align="center">

**⭐ If you found this useful, consider giving it a star!**

Made with ❤️ by **Raj Barsaiya** using MERN Stack + Gemini AI

</div>
