import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../api";

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    setMessage("");
    
    try {
      await uploadFile(acceptedFiles[0]);
      setMessage("✅ Datei erfolgreich hochgeladen!");
      onUploadSuccess();
    } catch (error) {
      setMessage("❌ Fehler beim Hochladen!");
    }
    
    setUploading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  return (
    <div {...getRootProps()} className="border p-4 text-center cursor-pointer">
      <input {...getInputProps()} />
      {uploading ? <p>🔄 Hochladen...</p> : <p>🎤 Datei hier ablegen oder klicken zum Hochladen</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
