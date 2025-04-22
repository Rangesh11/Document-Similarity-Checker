# 📄 Document Similarity Checker with AI

An AI-powered web application that compares documents and identifies their similarity using NLP-based algorithms and semantic analysis. This tool is useful for plagiarism detection, academic comparisons, and content analysis.

---

## 🎯 Objective

To build a powerful, intelligent tool that analyzes text and files (PDF, Word, etc.), calculates similarity metrics, highlights matching sections, and presents the results in a simple, visual interface.

---

## 🛠️ Technologies Used

### ⚙️ Frontend
- **React** with **Vite**
- **Functional Components** & **Hooks**
- **Tailwind CSS** & **Tailwind UI**
- **Redux** for global state

### 🧪 Backend
- **Node.js** with **Express**
- **JWT Authentication**
- **MongoDB** for data storage
- **RESTful API**

---

## 🔐 User Authentication (JWT)

User authentication is implemented using **JSON Web Tokens (JWT)** to ensure secure access to protected routes and user data.

- Upon **Sign Up**, user credentials are saved securely in the database with hashed passwords (bcrypt).
- On **Sign In**, a JWT token is issued and sent to the client.
- This token is stored on the client side and attached in headers (`Authorization: Bearer <token>`) for all authenticated API requests.
- **Token verification middleware** protects routes like `/upload`, `/history`, `/profile`, etc., ensuring only logged-in users can access them.

---

## 🤖 AI & NLP Features

- **Cosine Similarity**  
- **Jaccard Similarity**  
- **Semantic Similarity (BERT)**  
- **Hamming Distance**  
- **Text Extraction** from PDF/DOCX  
- **Similarity Reports & Plagiarism Indicator**  
- **Paragraph-level Analysis**

---

## 🔑 Core Features

- 📁 Upload documents (PDF, DOCX, TXT)
- 🔍 Extract and clean text
- 📊 Calculate similarity scores:
  - Cosine Similarity
  - Jaccard Similarity
  - Semantic Similarity
  - Hamming Distance
- 🧠 AI-Based Matching and Paragraph Analysis
- ⚠️ Plagiarism Detection
- 📝 History of past comparisons
- 👤 User profile with last two results

---

## 🧪 Sample Result Flow

### Document Upload (PDF/DOCX/TXT)
- User uploads two files or pastes text.
- Text is extracted and cleaned on the backend.

## 🚀 Project Setup
### 📦 Prerequisites
- Node.js (v18 or above)

- MongoDB (local or cloud e.g., MongoDB Atlas)

- npm

## 📁 Clone the Repository
```bash
git clone https://github.com/your-username/document-similarity-checker.git
cd document-similarity-checker
```

### 🔧 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
###  Backend Setup
```bash
cd backend_
npm install
npm start
```

### 🌐 Environment Variables
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### 👤 User Flow
- Sign up with name, email, and password
- Sign in to receive a JWT token
- Upload documents for comparison
- View detailed similarity results
- Access your profile to check past comparisons

### Demo Video (Must Include)
- Show Sign In / Sign Up
- Upload a document (PDF or Word)
- View similarity results with scores
- Navigate to user profile and show previous comparisons





