require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/upload");
const path = require("path");
const fs = require("fs");

const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || path.join(__dirname, "uploads");
const TRANSCRIPT_FOLDER = process.env.TRANSCRIPT_FOLDER || path.join(__dirname, "transcriptions");

// Stelle sicher, dass die Ordner existieren
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
if (!fs.existsSync(TRANSCRIPT_FOLDER)) fs.mkdirSync(TRANSCRIPT_FOLDER, { recursive: true });

console.log(`Uploads gespeichert in: ${UPLOAD_FOLDER}`);
console.log(`Transkriptionen gespeichert in: ${TRANSCRIPT_FOLDER}`);

const app = express();
const PORT = process.env.PORT || 5066;

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
