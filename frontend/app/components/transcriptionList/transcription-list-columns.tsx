import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { deleteFile, deleteTranscription, getFileById, getFileInfoById } from "~/api";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "~/components/ui/dropdown-menu";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

export type TranscriptionListItem = {
    id: string,
    title: string,
    status: string,
    created_at: Date,
    updated_at: Date,
    completed_at: Date,
    audio_file_id: string,
    transcript_file_id: string,
    error: string,
};

export const transcriptionListColumns: ColumnDef<TranscriptionListItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <input 
                className="ml-2"
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <input
                className="ml-2"
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Title
                    <ArrowUpDown />
                </Button>
            )
        },
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Status
                    <ArrowUpDown />
                </Button>
            )
        },
        enableSorting: true,
        cell: ({ row }) => {
            const status = row.original.status;
            const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
            let variant: "default" | "destructive" | "outline" | "secondary";
            switch (status) {
                case "completed":
                    variant = "default";
                    break;
                case "pending":
                    variant = "secondary";
                    break;
                case "failed":
                    variant = "destructive";
                    break;
                default:
                    variant = "outline";
            }
            return <Badge variant={variant}>{formattedStatus}</Badge>;
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Created At
                    <ArrowUpDown />
                </Button>
            )
        },
        enableSorting: true,
        cell: ({ row }) => format(new Date(row.original.created_at), "Pp", { locale: de }),
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Updated At
                    <ArrowUpDown />
                </Button>
            )
        },
        enableSorting: true,
        cell: ({ row }) => format(new Date(row.original.updated_at), "Pp", { locale: de }),
    },
    {
        accessorKey: "completed_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Completed At
                    <ArrowUpDown />
                </Button>
            )
        },
        enableSorting: true,
        cell: ({ row }) => format(new Date(row.original.completed_at), "Pp", { locale: de }),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { transcript_file_id, audio_file_id, id, title } = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={handleTranscriptDownload.bind(null, transcript_file_id, title)}>
                            Download Transcript
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAudioDownload.bind(null, audio_file_id, title)}>
                            Download Audio
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDeletedClicked.bind(null, id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const handleAudioDownload = async (fileId: string, title: string) => {
    console.log("Downloading file with ID:", fileId);
    try {
        const response = await getFileById(fileId);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", title);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading file:", error);
    }
};

const handleTranscriptDownload = async (fileId: string, title: string) => {
    console.log("Downloading file with ID:", fileId);
    try {
        const response = await getFileById(fileId);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", title + ".txt");
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading file:", error);
    }
};

const onDeletedClicked = (id: string) => {
    // TODO: Implement delete transcript functionality
    console.log("Deleting transcript with ID:", id);
    deleteTranscription(id);
};
