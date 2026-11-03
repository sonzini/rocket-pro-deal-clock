import { Header } from "@/components/Header";
import { Report } from "./Report";

export default function Home() {
  return (
    <>
      <Header active="report" />
      <Report />
    </>
  );
}
