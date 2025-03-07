import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { startTranscription, uploadFile } from '~/api';

export function useUploadBox() {
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
    setUploadedFiles([]);
    setResponses([]);
    setUploadStatus({});
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return {
    uploadedFiles,
    uploadStatus,
    getRootProps,
    getInputProps,
    handleTranscribe,
  };
}