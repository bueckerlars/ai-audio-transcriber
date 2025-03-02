import { DataTable } from "../ui/data-table";
import { fileListColumns, type FileListItem } from "./file-list-columns";

const FileListTable = async () => {
    const data = await getData();
    
    async function getData(): Promise<FileListItem[]> {
        // Fetch data from your API here.
        return [
          {
            id: "1",
            filename: "string",
            size: 5,
          },
          // ...
        ]
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={fileListColumns} data={data} />
        </div>
    )
}

export default FileListTable;