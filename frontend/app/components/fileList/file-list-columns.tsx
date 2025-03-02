import type { ColumnDef } from "@tanstack/react-table";

export type FileListItem = {
    id: string;
    filename: string;
    originalName: string;
    type: string;
    path: string;
    size: number;
    mineType: string;
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
      accessorKey: "originalName",
      header: "Filename",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "path",
      header: "Path",
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "mineType",
      header: "MineType",
    },
  ]