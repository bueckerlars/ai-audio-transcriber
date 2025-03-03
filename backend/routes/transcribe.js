const express = require("express");
const path = require("path");
const fs = require("fs");
const { transcribeAudio } = require("../services/transcribeService");
const databaseService = require("../services/databaseService");
const LoggerService = require('../services/loggerService');

const router = express.Router();

// Load environment variables for paths
const TRANSCRIPT_FOLDER = process.env.TRANSCRIPT_FOLDER || path.join(__dirname, "../transcriptions");
const logger = new LoggerService('API');

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

    // Check if there is a running job
    const runningJob = await databaseService.findOne('TranscriptionJob', {
      where: { status: 'running' }
    });

    // Create a transcription job in database with status 'pending' if a job is already running
    const transcriptionJob = await databaseService.insert('TranscriptionJob', {
      audio_file_id: req.params.fileId,
      updated_at: new Date(),
      status: runningJob ? 'pending' : 'running',
      created_at: new Date()
    });

    // Function to process the transcription job
    const processJob = async (job) => {
      try {
        const transcriptPath = await transcribeAudio(file.path, TRANSCRIPT_FOLDER);
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
        }, { id: job.id });

        // Process next pending job
        const nextJob = await databaseService.findOne('TranscriptionJob', {
          where: { status: 'pending' },
          order: [['created_at', 'ASC']]
        });
        if (nextJob) {
          await databaseService.update('TranscriptionJob', { status: 'running' }, { id: nextJob.id });
          processJob(nextJob);
        }
      } catch (error) {
        await databaseService.update('TranscriptionJob', {
          status: 'failed',
          error: error.message,
          completed_at: new Date()
        }, { id: job.id });
      }
    };

    // Start processing the job if no job is currently running
    if (!runningJob) {
      processJob(transcriptionJob);
    }

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
    logger.debug('Fetching transcription jobs');
    
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


/**
 * @swagger
 * /transcribe/{jobId}:
 *   delete:
 *     summary: Delete a transcription job
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the transcription job to delete
 *     responses:
 *       200:
 *         description: Job deleted
 *       404:
 *         description: Transcription job not found
 *       500:
 *         description: Error deleting job
 */
router.delete("/transcribe/:jobId", async (req, res) => {
  try {
    const job = await databaseService.findOne('TranscriptionJob', {
      where: { id: req.params.jobId },
    });
      
    if (!job) {
      logger.error('Transcription job not found: ' + req.params.jobId);
      return res.status(404).json({ error: "Transcription job not found" });
    } else {
      logger.debug('Job: ' + job);
      // delete job entry
      await databaseService.delete("TranscriptionJob", { id: req.params.jobId });
      logger.debug('Deleted job: ' + req.params.jobId);
    }

    // delete audio file
    const audio_file_id = job.audio_file_id;
    logger.debug('Audio file id: ' + audio_file_id);
    const audioFile = await databaseService.findOne('File', {
      where: { id: audio_file_id }
    });
    if (audioFile) {
      fs.unlinkSync(audioFile.path);
      await databaseService.delete('File', { id: audio_file_id });
      logger.debug('Deleted audio file: ' + audioFile.path); 
    } else {
      logger.error('Audio file not found: ' + audio_file_id);
    }

    // delete transcript file
    const transcript_file_id = job.transcript_file_id;
    logger.debug('Transcript file id: ' + transcript_file_id);
    const transcriptFile = await databaseService.findOne('File', {
      where: { id: transcript_file_id }
    });
    if (transcriptFile) {
      fs.unlinkSync(transcriptFile.path);
      await databaseService.delete('File', { id: transcript_file_id });
      logger.debug('Deleted transcript file: ' + transcriptFile.path); 
    } else {
      logger.error('Transcript file not found: ' + transcript_file_id);
    }

    // If the deleted job was running, start the next pending job
    if (job.status === 'running') {
      const nextJob = await databaseService.findOne('TranscriptionJob', {
        where: { status: 'pending' },
        order: [['created_at', 'ASC']]
      });
      if (nextJob) {
        await databaseService.update('TranscriptionJob', { status: 'running' }, { id: nextJob.id });
        processJob(nextJob);
      }
    }

    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    logger.error('Error deleting job:' + error);
    res.status(500).json({ error: "Error deleting job" });
  }
});

module.exports = router;
