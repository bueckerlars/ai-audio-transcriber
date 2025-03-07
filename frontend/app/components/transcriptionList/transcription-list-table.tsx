import { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { transcriptionListColumns, type TranscriptionListItem } from "./transcription-list-columns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Card } from "../ui/card";
import { useTranscriptionList } from "~/hooks/useTranscriptionList";

const TranscriptionListTable = () => {
  const {
    data,
    selectedRows,
    setSelectedRows,
    handleDeleteClicked,
    handleDownloadTranscriptionsClicked,
    handleDownloadAudiosClicked,
  } = useTranscriptionList();

  return (
    <div className="container mx-auto my-10">
      <div className="w-full flex justify-end pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={selectedRows.length == 0} variant="outline" className="ml-auto">
              Actions <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDeleteClicked}>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadTranscriptionsClicked}>Download Transcriptions</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadAudiosClicked}>Download Audios</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DataTable columns={transcriptionListColumns} data={data} onSelectionChange={(value) => setSelectedRows(value)} />
      </div>
    </div>
  );
};

export default TranscriptionListTable;