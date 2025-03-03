import { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { transcriptionListColumns, type TranscriptionListItem } from "./transcription-list-columns";
import { getFileInfoById, getTranscriptionList } from "~/api";


const TranscriptionListTable = () => {
    const [data, setData] = useState<TranscriptionListItem[]>([]);
  
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

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={transcriptionListColumns} data={data} />
        </div>
    )
}

export default TranscriptionListTable;