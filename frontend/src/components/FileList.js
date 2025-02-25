import React, { useEffect, useState } from "react";
import { getUploadedFiles, getTranscriptions, getFile } from "../api";

const FileList = () => {
  const [uploads, setUploads] = useState([]);
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const uploadRes = await getUploadedFiles();
      const transcriptRes = await getTranscriptions();
      setUploads(uploadRes.data.uploads);
      setTranscripts(transcriptRes.data.transcriptions);
    } catch (error) {
      console.error("Fehler beim Laden der Dateien", error);
    }
  };

  const handleDownload = async (type, filename) => {
    try {
      const res = await getFile(type, filename);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Fehler beim Herunterladen", error);
    }
  };

  return (
    <div>
      <h3>🎵 Hochgeladene Audiodateien</h3>
      <ul>
        {uploads.map((file) => (
          <li key={file}>
            {file} <button onClick={() => handleDownload("uploads", file)}>⬇️</button>
          </li>
        ))}
      </ul>

      <h3>📜 Transkriptionen</h3>
      <ul>
        {transcripts.map((file) => (
          <li key={file}>
            {file} <button onClick={() => handleDownload("transcriptions", file)}>⬇️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
