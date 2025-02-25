# 🎙 AI Audio Transcriber

AI Audio Transcriber is a web application that allows users to upload audio files and transcribe them using AI-powered speech recognition.  
The application provides an intuitive frontend for uploads and transcriptions and a scalable backend that integrates with the **Whisper AI model** for accurate speech-to-text conversion.

## 🚀 Technologies Used
The project is built using modern web technologies:

### **Frontend**
- **React** – User Interface  
- **Axios** – API Requests  
- **Nginx** – Serves the frontend in production  

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
✅ **Backend** → `http://localhost:5000`  
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

### **1️⃣ Upload an Audio File**
```
POST /api/upload
```
- **Body:** `multipart/form-data` (Key: `audio`)
- **Response:**
  ```json
  { "message": "Transcription started", "transcriptPath": "/transcriptions/audio1.txt" }
  ```

### **2️⃣ Get Uploaded Files**
```
GET /api/uploads
```
- **Response:**
  ```json
  { "uploads": ["audio1.mp3", "audio2.wav"] }
  ```

### **3️⃣ Get Transcriptions**
```
GET /api/transcriptions
```
- **Response:**
  ```json
  { "transcriptions": ["audio1.txt", "audio2.txt"] }
  ```

### **4️⃣ Download a File**
```
GET /api/uploads/:filename
GET /api/transcriptions/:filename
```

---

## 📌 Features & To-Do
✅ Upload and transcribe audio files  
✅ Download transcriptions  
🔄 **Upcoming Features:**  
- User authentication & project management  
- Database for file storage  
- Support for multiple languages  

---

## 📜 License
This project is licensed under the MIT License.

---

Now you're all set! 🚀 If you have any issues, feel free to open an [issue](https://github.com/bueckerlars/ai-transcriber/issues).  
Happy transcribing! 🎙✨

