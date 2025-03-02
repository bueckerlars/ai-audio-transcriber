import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../api';
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog"

const FileUploadDialog = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = async () => {
        setUploading(true);
        try {
            for (const file of files) {
                await uploadFile(file, 'audio');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            // TODO: implement custom alert
            alert('Failed to upload files');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Upload</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                        Drag and drop files here to upload them.
                    </DialogDescription>
                </DialogHeader>
                <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    {files.length === 0 ? (
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    ) : (
                        <ul>
                            {files.map(file => (
                                <li key={file.name}>{file.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FileUploadDialog;