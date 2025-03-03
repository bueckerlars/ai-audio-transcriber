import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { startTranscription, uploadFile } from '~/api';
import { Card } from './ui/card';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const UploadBox: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [responses, setResponses] = useState<any[]>([]);
    const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'uploaded' | 'error' }>({});

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            setUploadStatus(prevStatus => ({ ...prevStatus, [file.name]: 'uploading' }));
            const formData = new FormData();
            formData.append('file', file);

            uploadFile(file, 'audio')
                .then(response => {
                    setResponses(prevResponses => [...prevResponses, response]);
                    setUploadedFiles(prevFiles => [...prevFiles, file]);
                    setUploadStatus(prevStatus => ({ ...prevStatus, [file.name]: 'uploaded' }));
                    console.log('Files uploaded successfully:', response);
                })
                .catch(error => {
                    setUploadStatus(prevStatus => ({ ...prevStatus, [file.name]: 'error' }));
                    console.error('Error uploading files:', error);
                });
        });
    }, []);

    const handleTranscribe = () => {
        responses.forEach(res => {
            startTranscription(res.data.id)
                .then(response => {
                    console.log('Transcription started:', response.data);
                })
                .catch(error => {
                    console.error('Error starting transcription:', error);
                });
        });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Card style={{ padding: '20px', margin: '15px 80px', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
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