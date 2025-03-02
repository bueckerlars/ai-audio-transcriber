import type { ColumnDef } from "@tanstack/react-table";

export type FileListItem = {
    id: string;
    filename: string;
    size: number;
};

export const fileListColumns: ColumnDef<FileListItem>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "filename",
      header: "Filename",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
  ]