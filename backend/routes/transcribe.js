const express = require("express");
const path = require("path");
const fs = require("fs");
const { transcribeAudio } = require("../services/transcribeService");
const databaseService = require("../services/databaseService");
const LoggerService = require('../services/loggerService');
const { update } = require("../models/User");

const router = express.Router();

// Load environment variables for paths
const TRANSCRIPT_FOLDER = process.env.TRANSCRIPT_FOLDER || path.join(__dirname, "../transcriptions");
const logger = new LoggerService('TRANSCRIBE');

// Start transcription for an existing file
/**
 * @swagger
 * /transcribe/{fileId}:
 *   post:
 *     summary: Start transcription for an existing file
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the file to transcribe
 *     responses:
 *       200:
 *         description: Transcription started
 *       404:
 *         description: File not found
 *       500:
 *         description: Error starting transcription
 */
router.post("/transcribe/:fileId", async (req, res) => {
  try {
    logger.info('Starting new transcription job');
    // Get file information from database
    const file = await databaseService.findOne('File', {
          where: { id: req.params.fileId }
    });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Create a transcription job in database
    const transcriptionJob = await databaseService.insert('TranscriptionJob', {
      audio_file_id: req.params.fileId,
      updated_at: new Date(),
      status: 'running',
      created_at: new Date()
    });

    // Start transcription asynchronously
    transcribeAudio(file.path, TRANSCRIPT_FOLDER)
      .then(async (transcriptPath) => {
        // Update job status and save path

        const transcriptStats = fs.statSync(transcriptPath);
        logger.debug("Transcript: " + transcriptStats);

        const transcriptFile = await databaseService.insert('File', {
          filename: path.basename(transcriptPath),
          originalName: path.basename(transcriptPath),
          type: 'transcript',
          path: transcriptPath,
          size: transcriptStats.size,
          mimeType: 'text/plain',
        });

        await databaseService.update('TranscriptionJob', {
          status: 'completed',
          transcript_file_id: transcriptFile.id,
          updated_at: new Date(),
          completed_at: new Date()
        }, { id: transcriptionJob.id });
      })
      .catch(async (error) => {
        // Update job status on error
        await databaseService.update('TranscriptionJob', {
          status: 'failed',
          error: error.message,
          completed_at: new Date()
        }, { id: transcriptionJob.id });
      });

    // Return job ID immediately
    res.json({ 
      message: "Transcription started", 
      jobId: transcriptionJob.id 
    });

  } catch (error) {
    logger.error('Error starting transcription:', error);
    res.status(500).json({ error: "Error starting transcription" });
  }
});

/**
 * @swagger
 * /transcribe/list:
 *   get:
 *     summary: Fetch all transcription jobs
 *     responses:
 *       200:
 *         description: List of transcription jobs
 *       500:
 *         description: Error fetching transcription jobs
 */
router.get("/transcribe/list", async (req, res) => {
  try {
    logger.info('Fetching transcription jobs');
    
    const jobs = await databaseService.findAll('TranscriptionJob', {
      attributes: ['id', 'status', 'created_at', 'completed_at', 'updated_at', 'completed_at', 'transcript_file_id', 'audio_file_id', 'error'],
    });

    res.json({ jobs });
  } catch (error) {
    logger.error("Error fetching transcription jobs:", error);
    res.status(500).json({ error: "Error fetching transcription jobs" });
  }
});

// Query transcription status
/**
 * @swagger
 * /transcribe/status/{jobId}:
 *   get:
 *     summary: Query transcription status
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transcription job
 *     responses:
 *       200:
 *         description: Transcription job status
 *       404:
 *         description: Transcription job not found
 *       500:
 *         description: Error fetching job status
 */
router.get("/transcribe/status/:jobId", async (req, res) => {
  try {
    const job = await databaseService.findOne('TranscriptionJob', {
      where: { id: req.params.jobId },
    });
    
    if (!job) {
      logger.error('Transcription job not found: ' + req.params.jobId);
      return res.status(404).json({ error: "Transcription job not found" });
    }
    logger.debug("Job: " + job);
    res.json(job);
  } catch (error) {
    logger.error('Error fetching job status:' + error);
    res.status(500).json({ error: "Error fetching job status + " + error });
  }
});

module.exports = router;
