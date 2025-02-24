const express = require("express");
const multer = require("multer");
const path = require("path");
const { transcribeAudio } = require("../services/transcribeService");

const router = express.Router();

// Speicherort für hochgeladene Dateien
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Datei hochladen und transkribieren
router.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Keine Datei hochgeladen" });
  }

  try {
    const transcriptPath = await transcribeAudio(req.file.path);
    res.json({ message: "Transkription erfolgreich", transcriptPath });
  } catch (error) {
    res.status(500).json({ error: "Fehler bei der Transkription" });
  }
});

module.exports = router;
