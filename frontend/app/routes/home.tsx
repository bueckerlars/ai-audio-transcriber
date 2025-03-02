import TranscriptionListTable from "~/components/transcriptionList/transcription-list-table";
import type { Route } from "./+types/home";
import FileListTable from "~/components/fileList/file-list-table";
// import FileUploadDialog from "~/components/fileUploadDialog";
import UploadBox from "~/components/uploadBox";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // return <Welcome />;
  return (
    <>
      {/* <FileUploadDialog /> */}
      <UploadBox />
      <FileListTable />;
      {/* <TranscriptionListTable />; */}
    </>
  )
}
