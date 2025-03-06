import TranscriptionListTable from "~/components/transcriptionList/transcription-list-table";
import type { Route } from "./+types/home";
import UploadBox from "~/components/uploadBox";
import AccountMenuButton from "~/components/account-menu-button";
import { useCheckAuth } from "~/hooks/useCheckAuth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  useCheckAuth();
  return (
    <>
      <UploadBox />
      <TranscriptionListTable />
    </>
  )
}
