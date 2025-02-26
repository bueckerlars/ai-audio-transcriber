import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { downloadFile, getTranscriptions, uploadFile } from "~/api";
import { Card, CardContent } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [transcriptions, setTranscriptions] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  useEffect(() => {
    getTranscriptions().then((res) => {
      setTranscriptions(res.data.transcriptions);
    });
  }, [uploading]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    
    try {
      await uploadFile(file);
      setMessage("✅ File uploaded successfully!");
    } catch (error) {
      setMessage("❌ Upload failed!");
    }
    setUploading(false);
  };

  const handleDownload = async (filename) => {
    try {
      const response = await downloadFile("transcriptions", filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Upload an Audio File</h2>
        <div {...getRootProps()} className="border-dashed border-2 p-6 text-center cursor-pointer bg-white">
          <input {...getInputProps()} />
          <p>{file ? file.name : "Drag & drop an audio file here, or click to select one"}</p>
        </div>
        <Button className="mt-4" onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Start Transcription"}
        </Button>
        {message && <p className="mt-2 text-sm">{message}</p>}

        <h2 className="text-xl font-bold mt-6">Your Transcriptions</h2>
        <ul>
          {transcriptions.map((file, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              {file}
              <Button onClick={() => handleDownload(file)}>Download</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
