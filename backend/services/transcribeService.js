const { exec } = require("child_process");
const path = require("path");

const transcribeAudio = (filePath) => {
  return new Promise((resolve, reject) => {
    const transcriptPath = `transcriptions/${path.basename(filePath)}.txt`;

    exec(`python3 python-scripts/transcribe.py ${filePath} ${transcriptPath}`, (error, stdout, stderr) => {
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
