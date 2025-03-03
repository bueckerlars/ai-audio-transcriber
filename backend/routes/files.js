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
      logger.debug(`Creating upload directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    logger.debug("Unigue filename:", uniqueFilename);
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error processing file upload
 */
router.post("/upload", upload.single("audio"), async (req, res) => {
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

/**
 * @swagger
 * /files/list:
 *   get:
 *     summary: List all files of a specific type
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of files to list
 *     responses:
 *       200:
 *         description: List of files
 *       500:
 *         description: Error fetching files
 */
router.get("/list", async (req, res) => {
  try {
    logger.info('Fetching files');
    const type = req.query.type;
    const where = type ? { type } : {};
    
    const files = await databaseService.findAll('File', {
      where,
      attributes: ['id', 'filename', 'originalName', 'type', 'size', 'mimeType', 'createdAt']
    });
    
    res.json({ files });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Dateien:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Dateien" });
  }
});

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Retrieve a single file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error fetching file
 */
router.get("/:id", async (req, res) => {
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
    logger.error("Fehler beim Abrufen der Datei:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Datei" });
  }
});

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Delete a file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error deleting file
 */
router.delete("/:id", async (req, res) => {
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
    logger.error("Fehler beim Löschen der Datei:", error);
    res.status(500).json({ error: "Fehler beim Löschen der Datei" });
  }
});

/**
 * @swagger
 * /files/info/{id}:
 *   get:
 *     summary: Get information of a specific file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to get information
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error fetching file information
 */
router.get("/info/:id", async (req, res) => {
  try {
    const file = await databaseService.findOne('File', {
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    res.json(file);
  } catch (error) {
    logger.error("Fehler beim Abrufen der Datei-Informationen:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Datei-Informationen" });
  }
});

module.exports = router;
