require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const transcribeRoutes = require("./routes/transcribe");
const fileRoutes = require("./routes/files");
const authRoutes = require("./routes/auth");
const DatabaseService = require("./services/databaseService");
const LoggerService = require('./services/loggerService');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

const logger = new LoggerService('SERVER');

const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || path.join(__dirname, "uploads");
const TRANSCRIPT_FOLDER = process.env.TRANSCRIPT_FOLDER || path.join(__dirname, "transcriptions");

// Stelle sicher, dass die Ordner existieren
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
if (!fs.existsSync(TRANSCRIPT_FOLDER)) fs.mkdirSync(TRANSCRIPT_FOLDER, { recursive: true });

logger.debug(`Upload storage location: ${UPLOAD_FOLDER}`);
logger.debug(`Transcriptionen storage location: ${TRANSCRIPT_FOLDER}`);

// Initialisiere Datenbank-Service
DatabaseService.initialize();

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT || 5066;

// Middleware
app.use(cors());
app.use(express.json());

// SwaggerUI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
logger.debug(`Swagger UI initialized at http://localhost:${BACKEND_PORT}/api-docs`);

// Routen
app.use("/api/v1", transcribeRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/auth", authRoutes)

app.listen(BACKEND_PORT, () => {
  logger.info(`Server is running on http://localhost:${BACKEND_PORT}`);
});
