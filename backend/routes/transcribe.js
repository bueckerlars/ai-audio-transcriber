const express = require("express");
const path = require("path");
const { transcribeAudio } = require("../services/transcribeService");
const { 
  getFileById, 
  insert, 
  update, 
  findOne 
} = require("../services/databaseService");
const LoggerService = require('../services/loggerService');

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
    const file = await getFileById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Create a transcription job in database
    const transcriptionJob = await insert('TranscriptionJob', {
      transcript_file_id: file.id,
      status: 'pending',
      created_at: new Date()
    });

    // Start transcription asynchronously
    transcribeAudio(file.path, TRANSCRIPT_FOLDER)
      .then(async (transcriptPath) => {
        // Update job status and save path
        await update('TranscriptionJob', {
          status: 'completed',
          transcript_file_id: file.id,
          completed_at: new Date()
        }, { id: transcriptionJob.id });
      })
      .catch(async (error) => {
        // Update job status on error
        await update('TranscriptionJob', {
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
    const job = await findOne('TranscriptionJob', {
      where: { id: req.params.jobId },
      include: [{ model: getModel('File'), as: 'transcriptFile' }]
    });
    
    if (!job) {
      return res.status(404).json({ error: "Transcription job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job status" });
  }
});

module.exports = router;
