const { exec, execSync } = require("child_process");
const path = require("path");
const LoggerService = require('./loggerService');
const logger = new LoggerService('TRANSCRIBE');

let currentProcess = null;

const transcribeAudio = (filePath, outPath) => {
  return new Promise((resolve, reject) => {
    const transcriptPath = `${outPath}/${path.basename(filePath)}.txt`;
    logger.info("Transcription started | Audio: " + filePath);
    
    currentProcess = exec(`python3 python-scripts/transcribe.py --audio ${filePath} --output ${transcriptPath}`, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Fehler: ${stderr}`);
        reject(error);
      } else {
        logger.info(`Transcription successfull: ${stdout}`);
        resolve(transcriptPath);
      }
      currentProcess = null;
    });
  });
};

const stopTranscription = () => {
  if (currentProcess) {
    currentProcess.kill();
    logger.info("Transcription stopped");
    currentProcess = null;
  } else {
    logger.warning("No transcription process is running");
  }
};

const getTranscriptionProgress = () => {
  if (currentProcess) {
    try {
      const progress = execSync(`ps -p ${currentProcess.pid} -o %cpu,%mem,etime`).toString();
      logger.info("Transcription progress: ", progress);
      return progress;
    } catch (error) {
      logger.error("Error fetching progress: ", error);
      return null;
    }
  } else {
    logger.warning("No transcription process is running");
    return null;
  }
};

module.exports = { transcribeAudio, stopTranscription, getTranscriptionProgress };
