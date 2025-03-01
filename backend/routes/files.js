const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const databaseService = require("../services/databaseService");
const LoggerService = require('../services/loggerService');

const router = express.Router();

const logger = new LoggerService('FILES');

// Konfiguration für Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_FOLDER || path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage });

// 🔹 Datei hochladen
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    logger.info('Processing file upload request');
    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      type: req.query.type || 'upload',
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype
    };

    const file = await databaseService.insert('File', fileData);
    res.status(201).json(file);
  } catch (error) {
    logger.error('Error processing file upload:', error);
    res.status(500).json({ error: "Fehler beim Hochladen der Datei" });
  }
});

// 🔹 Liste aller Dateien eines bestimmten Typs
router.get("/files", async (req, res) => {
  try {
    const type = req.query.type;
    const where = type ? { type } : {};
    
    const files = await databaseService.findAll('File', {
      where,
      attributes: ['id', 'filename', 'originalName', 'type', 'size', 'mimeType', 'createdAt']
    });
    
    res.json({ files });
  } catch (error) {
    console.error("Fehler beim Abrufen der Dateien:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Dateien" });
  }
});

// 🔹 Einzelne Datei abrufen
router.get("/files/:id", async (req, res) => {
  try {
    const file = await databaseService.findOne('File', {
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "Datei nicht auf dem Server gefunden" });
    }

    res.sendFile(file.path);
  } catch (error) {
    console.error("Fehler beim Abrufen der Datei:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Datei" });
  }
});

// 🔹 Datei löschen
router.delete("/files/:id", async (req, res) => {
  try {
    const file = await databaseService.findOne('File', {
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    // Datei physisch löschen
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Datenbankeinträg löschen
    await databaseService.delete('File', { id: req.params.id });

    res.json({ message: "Datei erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen der Datei:", error);
    res.status(500).json({ error: "Fehler beim Löschen der Datei" });
  }
});

module.exports = router;
