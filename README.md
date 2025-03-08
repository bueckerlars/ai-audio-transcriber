# 🎙 AI Audio Transcriber

AI Audio Transcriber is a web application that allows users to upload audio files and transcribe them using AI-powered speech recognition.  
The application provides an intuitive frontend for uploads and transcriptions and a scalable backend that integrates with the **Whisper AI model** for accurate speech-to-text conversion.

## 🚀 Technologies Used
The project is built using modern web technologies:

### **Frontend**
- **React** – User Interface  
- **Axios** – API Requests  

### **Backend**
- **Node.js (Express.js)** – API & File Management  
- **Multer** – Handles file uploads  
- **Python (Whisper AI)** – AI-powered transcription  
- **FFmpeg** – Required for audio processing  

### **Deployment**
- **Docker** – Containerized deployment  
- **Docker Compose** – Multi-container setup  

---

## 🔧 How to Use

### **1️⃣ Running Locally (without Docker)**
#### **1. Clone the repository**
```bash
git clone https://github.com/bueckerlars/ai-audio-transcriber.git
cd ai-audio-transcriber
```

#### **2. Set up the Backend**
```bash
cd backend
npm install
pip install -r requirements.txt  # Install Python dependencies
npm start
```
Backend is now running on **http://localhost:5066**

#### **3. Set up the Frontend**
```bash
cd ../frontend
npm install
npm start
```
Frontend is now running on **http://localhost:3000**

---

### **2️⃣ Running with Docker**
#### **1. Build & Start Docker Containers**
```bash
docker-compose up --build -d
```
This starts:  
✅ **Backend** → `http://localhost:5066`  
✅ **Frontend** → `http://localhost:3000`  

#### **2. Stopping Containers**
```bash
docker-compose down
```

#### **3. Checking Logs**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📌 API Endpoints

The API documentation is available through SwaggerUI. You can access it by navigating to the following URL once the backend is running:

```
http://localhost:5066/api-docs
```

Refer to the SwaggerUI documentation for detailed information on request parameters and responses.

---

## 📌 Features & To-Do
✅ Upload and transcribe audio files  
✅ Download transcriptions  
✅ Database for file storage  
🔄 **Upcoming Features:**  
- User authentication & project management  
- Support for external transcription agents
- Support for selectable models from the frontend
- Support for multiple languages  

---

## 📜 License
This project is licensed under the MIT License.

---

Now you're all set! 🚀 If you have any issues, feel free to open an [issue](https://github.com/bueckerlars/ai-transcriber/issues).  
Happy transcribing! 🎙✨

