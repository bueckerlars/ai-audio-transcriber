const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const databaseService = require("../services/databaseService");
const LoggerService = require('../services/loggerService');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import the authentication middleware

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
 *     tags: ['Files']
 *     security:
 *       - bearerAuth: []
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
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               type:
 *                 type: string
 *                 description: The type of the file
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error processing file upload
 */
router.post("/upload", authenticateToken, upload.single("audio"), async (req, res) => {
  try {
    logger.info('Processing file upload request');
    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen" });
    }

    const fileData = {
      filename: req.file.filename,
      userId: req.body.userId,
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
 *     tags: ['Files']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
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
router.get("/list", authenticateToken, async (req, res) => {
  try {
    logger.info('Fetching files');
    const userId = req.query.userId; // Ensure userId is passed as a query parameter
    logger.debug('UserId:', userId);
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const type = req.query.type;
    
    const files = await databaseService.findAll('File', {
      where: { userId: userId, type: type ? { type } : {} },
      attributes: ['id', 'filename', 'originalName', 'type', 'size', 'mimeType', 'createdAt']
    });
    
    res.json({ files });
  } catch (error) {
    logger.error("Failed to fetch files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Retrieve a single file
 *     tags: ['Files']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to retrieve
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error fetching file
 */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.query.userId; // Ensure userId is passed as a query parameter
    const file = await databaseService.findOne('File', {
      where: { id: req.params.id, userId: userId }
    });

    if (!file) {
      return res.status(404).json({ error: "Could not find file" });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: "File does not exist" });
    }

    res.sendFile(file.path);
  } catch (error) {
    logger.error("Failed to fetch file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
});

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: ['Files']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to delete
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error deleting file
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const file = await databaseService.findOne('File', {
      where: { id: req.params.id, userId: req.query.userId }
    });

    if (!file) {
      return res.status(404).json({ error: "Could not find file" });
    }

    // Datei physisch löschen
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Datenbankeinträg löschen
    await databaseService.delete('File', { id: req.params.id });

    res.json({ message: "Successfully delete file" });
  } catch (error) {
    logger.error("Failed to delete file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

/**
 * @swagger
 * /files/info/{id}:
 *   get:
 *     summary: Get information of a specific file
 *     tags: ['Files']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to get information
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error fetching file information
 */
router.get("/info/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.query.userId; // Ensure userId is passed as a query parameter

    const file = await databaseService.findOne('File', {
      where: { id: req.params.id, userId: userId }
    });

    if (!file) {
      return res.status(404).json({ error: "Could not find file" });
    }

    res.json(file);
  } catch (error) {
    logger.error("Failed to fetch file info:", error);
    res.status(500).json({ error: "Failed to fetch file info" });
  }
});

module.exports = router;
