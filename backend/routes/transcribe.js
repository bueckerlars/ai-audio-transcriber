const express = require("express");
const path = require("path");
const { transcribeAudio } = require("../services/transcribeService");
const { 
  getFileById, 
  createTranscriptionJob, 
  updateTranscriptionStatus 
} = require("../services/databaseService");
const LoggerService = require('../services/loggerService');

const router = express.Router();

// Load environment variables for paths
const TRANSCRIPT_FOLDER = process.env.TRANSCRIPT_FOLDER || path.join(__dirname, "../transcriptions");
const logger = new LoggerService('TRANSCRIBE');

// Start transcription for an existing file
router.post("/transcribe/:fileId", async (req, res) => {
  try {
    logger.info('Starting new transcription job');
    // Get file information from database
    const file = await getFileById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Create a transcription job in database
    const transcriptionJob = await createTranscriptionJob({
      fileId: file.id,
      status: 'pending',
      created_at: new Date()
    });

    // Start transcription asynchronously
    transcribeAudio(file.path, TRANSCRIPT_FOLDER)
      .then(async (transcriptPath) => {
        // Update job status and save path
        await updateTranscriptionStatus(transcriptionJob.id, {
          status: 'completed',
          transcript_path: transcriptPath,
          completed_at: new Date()
        });
      })
      .catch(async (error) => {
        // Update job status on error
        await updateTranscriptionStatus(transcriptionJob.id, {
          status: 'failed',
          error: error.message,
          completed_at: new Date()
        });
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
router.get("/transcribe/status/:jobId", async (req, res) => {
  try {
    const job = await getTranscriptionJob(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ error: "Transcription job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job status" });
  }
});

module.exports = router;
