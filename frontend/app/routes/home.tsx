import TranscriptionListTable from "~/components/transcriptionList/transcription-list-table";
import type { Route } from "./+types/home";
import UploadBox from "~/components/uploadBox";
import AccountMenuButton from "~/components/account-menu-button";

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
      <UploadBox />
      <TranscriptionListTable />
    </>
  )
}
