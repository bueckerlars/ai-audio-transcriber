const { exec } = require("child_process");
const path = require("path");

const transcribeAudio = (filePath, outPath) => {
  return new Promise((resolve, reject) => {
    const transcriptPath = `${outPath}/${path.basename(filePath)}.txt`;
    console.log("Transcription started");
    console.log("Filepath: " + transcriptPath);
    
    exec(`python3 python-scripts/transcribe.py --audio ${filePath} --output ${transcriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Fehler: ${stderr}`);
        reject(error);
      } else {
        console.log(`Transkription abgeschlossen: ${stdout}`);
        resolve(transcriptPath);
      }
    });
  });
};

module.exports = { transcribeAudio };
