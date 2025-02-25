import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";

const Home = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container">
      <h1>🎙 AI Transcriber</h1>
      <FileUpload onUploadSuccess={() => setRefresh(!refresh)} />
      <FileList key={refresh} />
    </div>
  );
};

export default Home;
