# 📸 SnapSolve

> **Intelligent MCQ Extraction & AI-Powered Solutions**

A modern full-stack application that extracts multiple-choice questions from screenshots and provides AI-generated answers using Google's Gemini AI. Built with Spring Boot and React.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17+-red.svg)](https://www.java.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.5%20Flash-4285F4.svg)](https://ai.google.dev/)

---

## ✨ Features

- 📋 **Paste & Upload**: Directly paste screenshots from clipboard or upload image files
- ⚡ **Flash Processing**: Powered by Google's Gemini 2.5 Flash AI for instant processing
- 🧠 **Smart Extraction**: Automatically extracts questions, options, and generates answers in one step
- 💡 **Detailed Explanations**: Get comprehensive answers with thorough explanations
- 🎨 **Modern UI**: Clean, responsive, and intuitive user interface built with React and Tailwind CSS
- 🚀 **Fast & Efficient**: Optimized for speed and performance

---

## 🛠️ Prerequisites

| Requirement               | Version                                                 |
| ------------------------- | ------------------------------------------------------- |
| **Java**                  | 17+                                                     |
| **Maven**                 | 3.6+                                                    |
| **Node.js**               | 16+                                                     |
| **npm**                   | 8+                                                      |
| **Google Gemini API Key** | [Get it here](https://makersuite.google.com/app/apikey) |

---

## 📁 Project Structure

```
SnapSolve/
│
├── 🔙 backend/          # Spring Boot REST API
│   ├── src/main/java/   # Java source code
│   ├── pom.xml          # Maven dependencies
│   └── Dockerfile       # Container configuration
│
└── 🎨 frontend/         # React UI Application
    ├── src/             # React components
    ├── public/          # Static assets
    └── package.json     # npm dependencies
```

---

## 🚀 Backend Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/ankush321-collab/SnapSolve.git
cd SnapSolve/backend
```

### Step 2: Configure Gemini API Key

Edit `src/main/resources/application.properties`:

```properties
# Google Gemini API Configuration
gemini.api.key=your-gemini-api-key-here
```

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 3: Build & Run with Maven

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

✅ Backend available at: **`http://localhost:8080`**

### 🐳 Alternative: Run with Docker

```bash
# Pull the image
docker pull ankush321-collab/snapsolve

# Run container
docker run -p 8080:8080 ankush321-collab/snapsolve
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm start
```

✅ Frontend available at: **`http://localhost:5173`**

---

## 💡 How to Use

1. **Open Application**: Navigate to `http://localhost:5173` in your browser
2. **Capture MCQ**: Take a screenshot of your multiple-choice questions
3. **Choose Input Method**:
   - 📌 **Paste Mode**: Copy screenshot (Ctrl+C), then paste (Ctrl+V)
   - 📂 **Upload Mode**: Select file using the file picker
4. **Process**: Click "Extract & Solve"
5. **View Results**: Get instant answers with detailed explanations

---

## 🏗️ Technical Architecture

```
Frontend (React + Tailwind)
    ↓
REST API (Spring Boot)
    ↓
Gemini 2.5 Flash AI
    ↓
Smart MCQ Extraction & Answer Generation
```

### Core Technologies

| Layer          | Technology                   | Purpose                     |
| -------------- | ---------------------------- | --------------------------- |
| **Frontend**   | React.js, Tailwind CSS, Vite | Modern UI/UX                |
| **Backend**    | Spring Boot, Java 17+        | REST API Server             |
| **AI**         | Google Gemini 2.5 Flash      | Image & Question Processing |
| **Deployment** | Docker, Maven                | Containerization & Build    |

### Key Components

- **GeminiService**: Handles image processing and AI-powered answer generation
- **MCQController**: Manages HTTP endpoints and request routing
- **Question Model**: Represents MCQ structure with options and explanations
- **DocumentService**: Handles document processing and storage

---

## ⚠️ Limitations

- ⚠️ AI-generated answers may not always be 100% accurate
- 📷 Quality of results depends on screenshot clarity
- 🌐 Requires active internet connection for Gemini API
- 📊 API has rate limits and usage quotas
- 🔌 Depends on Google Gemini service availability

---

## 📸 Demo

![SnapSolve Output](https://raw.githubusercontent.com/ankush321-collab/SnapSolve/refs/heads/main/output/SnapSolveOutput.png)

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

---

## 👨‍💻 Author

**ankush321-collab**

- GitHub: [@ankush321-collab](https://github.com/ankush321-collab)
- Project: [SnapSolve](https://github.com/ankush321-collab/SnapSolve)

---

## 🙋 Support

Have questions or issues? Please [open an issue](https://github.com/ankush321-collab/SnapSolve/issues) on GitHub.

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star!**

Made with ❤️ by [ankush321-collab](https://github.com/ankush321-collab)

</div>
