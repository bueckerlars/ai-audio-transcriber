import { use, useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { transcriptionListColumns, type TranscriptionListItem } from "./transcription-list-columns";
import { getFileInfoById, getTranscriptionList } from "~/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Card } from "../ui/card";


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

        <div className="container mx-auto my-10">
            <div className="w-full flex justify-end pb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">Actions <ChevronDown/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem>Download Transcriptions</DropdownMenuItem>
                        <DropdownMenuItem>Download Audios</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div >
                <DataTable columns={transcriptionListColumns} data={data} onSelectionChange={(value) => {console.log(value)}}/>
            </div>
        </div>
    )
}

export default TranscriptionListTable;