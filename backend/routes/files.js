const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Lade die Umgebungsvariablen für Pfade
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || path.join(__dirname, "../uploads");
const TRANSCRIPT_FOLDER = process.env.TRANSCRIPT_FOLDER || path.join(__dirname, "../transcriptions");

// 🔹 Liste alle hochgeladenen Audiodateien
router.get("/uploads", (req, res) => {
  fs.readdir(UPLOAD_FOLDER, (err, files) => {
    if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Dateien" });
    res.json({ uploads: files });
  });
});

// 🔹 Liste alle fertigen Transkriptionen
router.get("/transcriptions", (req, res) => {
  fs.readdir(TRANSCRIPT_FOLDER, (err, files) => {
    console.log("TranscriptFolder: " + TRANSCRIPT_FOLDER);
    if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Transkripte" });
    res.json({ transcriptions: files });
  });
});

// 🔹 Einzelne Audiodatei abrufen
router.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Datei nicht gefunden" });
  res.sendFile(filePath);
});

// 🔹 Einzelnes Transkript abrufen
router.get("/transcriptions/:filename", (req, res) => {
  const filePath = path.join(TRANSCRIPT_FOLDER, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Transkript nicht gefunden" });
  res.sendFile(filePath);
});

module.exports = router;
