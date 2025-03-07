import { useEffect, useState } from "react";
import { deleteTranscription, getFileById, getFileInfoById, getTranscriptionList } from "~/api";
import type { TranscriptionListItem } from "~/components/transcriptionList/transcription-list-columns";

export function useTranscriptionList() {
  const [data, setData] = useState<TranscriptionListItem[]>([]);
  const [selectedRows, setSelectedRows] = useState<TranscriptionListItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getTranscriptionList();
      const jobs = response.data.jobs;

      const updatedJobs = await Promise.all(
        //@ts-ignore
        jobs.map(async (job) => {
          const res = await getFileInfoById(job.audio_file_id);
          job.title = res.data.originalName;
          return job;
        })
      );

      setData(updatedJobs);
    }

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Update data every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleDeleteClicked = async () => {
    for (const row of selectedRows) {
      await deleteTranscription(row.id);
    }
  };

  const handleDownloadTranscriptionsClicked = async () => {
    for (const row of selectedRows) {
      try {
        const response = await getFileById(row.transcript_file_id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", row.title + ".txt");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  };

  const handleDownloadAudiosClicked = async () => {
    for (const row of selectedRows) {
      try {
        const response = await getFileById(row.transcript_file_id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", row.title);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  };

  return {
    data,
    selectedRows,
    setSelectedRows,
    handleDeleteClicked,
    handleDownloadTranscriptionsClicked,
    handleDownloadAudiosClicked,
  };
}