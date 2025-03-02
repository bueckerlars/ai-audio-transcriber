import type { Route } from "./+types/home";
import FileListTable from "~/components/fileList/file-list-table";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // return <Welcome />;
  return <FileListTable />;
}
