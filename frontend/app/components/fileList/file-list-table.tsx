import { useEffect, useState } from 'react';
import { DataTable } from "../ui/data-table";
import { fileListColumns, type FileListItem } from "./file-list-columns";
import { getFiles } from '~/api';

const FileListTable = () => {
    const [data, setData] = useState<FileListItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = getFiles();
            const data = (await response).data.files;
            setData(data);
        }
        fetchData();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={fileListColumns} data={data} />
        </div>
    )
}

export default FileListTable;