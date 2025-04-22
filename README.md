---

# 📄 Document Similarity Checker with AI

An AI-powered web application that compares documents and identifies their similarity using NLP-based algorithms and semantic analysis. This tool is useful for plagiarism detection, academic comparisons, and content analysis.

---

## 🎯 Objective

To build a powerful, intelligent tool that analyzes text and files (PDF, Word, etc.), calculates similarity metrics, highlights matching sections, and presents the results in a simple, visual interface.

---

## 📹 Demo Video

Watch the full demo on YouTube: [📺 Click Here to Watch](https://drive.google.com/file/d/1ncRGWA1viK2LTaDd_T3k8MnEo4hPnT3J/view)



## 📂 Project Structure

```
Course-Review-Platform/
├── backend/
│   ├── config/         # DB configuration
│   ├── controllers/    # auth, course, review logic
│   ├── middleware/     # JWT auth, file uploads
│   ├── models/         # User, Course, Review schemas
│   ├── routes/         # API endpoints
│   └── app.js          # Entry point (formerly index.js)
│
└── front-end/
    ├── public/         
    └── src/
        ├── components/     # UI components
        ├── Pages/          # Page components
        ├── features/       # Redux slices
        ├── store/          # Redux store config
        └── main.jsx        # App entry
```

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


## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

---

### 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | `/signup`      | Register a new user  |
| POST   | `/login`       | Login and get token  |

---

### 📄 Document Comparison Routes (`/api/documents`)

| Method | Endpoint     | Description                                |
|--------|--------------|--------------------------------------------|
| POST   | `/compare`   | Compare two uploaded documents (PDF/Text). Requires token |
| GET    | `/history`   | Get user's document comparison history *(to be implemented)* |

- **Headers**:  
  `Authorization: Bearer <token>`
  
- **Body**:  
  `multipart/form-data` with two files under the name `documents`

---

### 👤 Profile Routes (`/api/profile`)

| Method | Endpoint                  | Description                            |
|--------|---------------------------|----------------------------------------|
| GET    | `/get`                    | Get profile data of authenticated user |
| POST   | `/last-comparisons`       | Get last two comparison results        |

- **Headers**:  
  `Authorization: Bearer <token>`

---

### 📚 History Routes (`/api/history`)

| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| POST   | `/history`    | Get user's history by email (no token needed for now) |

- **Body**:  
  ```json
  {
    "email": "user@example.com"
  }
  ```




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

---

## 🚀 Project Setup

### 📦 Prerequisites
- Node.js (v18 or above)
- MongoDB (local or cloud e.g., MongoDB Atlas)
- npm

### 📁 Clone the Repository
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

### 🔧 Backend Setup
```bash
cd backend
npm install
node app.js
```

---

## 🌐 Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 👤 User Flow
- Sign up with name, email, and password
- Sign in to receive a JWT token
- Upload documents for comparison
- View detailed similarity results
- Access your profile to check past comparisons

---



---

## 📹 Demo Video 
- Show Sign In / Sign Up
- Upload a document (PDF or Word)
- View similarity results with scores
- Navigate to user profile and show previous comparisons
