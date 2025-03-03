import { use, useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { transcriptionListColumns, type TranscriptionListItem } from "./transcription-list-columns";
import { deleteTranscription, getFileById, getFileInfoById, getTranscriptionList } from "~/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Card } from "../ui/card";


const TranscriptionListTable = () => {
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

    const handleDeleteClicked = () => {
        selectedRows.forEach(async (row) => {
            await deleteTranscription(row.id);
        });
    }

    const handleDownloadTranscriptionsClicked = () => {
        selectedRows.forEach(async (row) => {
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
        });
    }

    const handleDownloadAudiosClicked = () => {
        selectedRows.forEach(async (row) => {
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
        });
    }

    return (
        <div className="container mx-auto my-10">
            <div className="w-full flex justify-end pb-4">
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button disabled={selectedRows.length == 0} variant="outline" className="ml-auto">Actions <ChevronDown/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDeleteClicked}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownloadTranscriptionsClicked}>Download Transcriptions</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownloadAudiosClicked}>Download Audios</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div >
                <DataTable columns={transcriptionListColumns} data={data} onSelectionChange={(value) => { setSelectedRows(value) }}/>
            </div>
        </div>
    )
}

export default TranscriptionListTable;