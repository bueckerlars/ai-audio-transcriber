import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useUploadBox } from '~/hooks/useUploadBox';

const UploadBox: React.FC = () => {
  const {
    uploadedFiles,
    uploadStatus,
    getRootProps,
    getInputProps,
    handleTranscribe,
  } = useUploadBox();

  return (
    <Card className="container mx-auto pt-10" style={{ padding: '20px', marginTop: "50px", alignSelf: "center", justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '50px', textAlign: 'center', width: '100%' }}>
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
        <p style={{ color: '#888888' }}>Files will be uploaded immediately</p>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {uploadedFiles.map((file, index) => (
            <li key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #cccccc', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
              {file.name}
              {uploadStatus[file.name] === 'uploading' && <FaSpinner style={{ marginLeft: '10px', color: '#888888' }} />}
              {uploadStatus[file.name] === 'uploaded' && <FaCheckCircle style={{ marginLeft: '10px', color: 'green' }} />}
              {uploadStatus[file.name] === 'error' && <FaExclamationCircle style={{ marginLeft: '10px', color: 'red' }} />}
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={handleTranscribe} style={{ width: 'auto' }} disabled={uploadedFiles.length === 0}>
        Transcribe Files
      </Button>
    </Card>
  );
};

export default UploadBox;