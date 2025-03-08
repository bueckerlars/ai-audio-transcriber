export type Transcription = {
    id: string;
    userId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string;
    transcript_file_id: string;
    audio_file_id: string;
    error: string;
};