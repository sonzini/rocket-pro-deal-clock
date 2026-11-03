import { Header } from "@/components/Header";
import { CleanFile } from "./CleanFile";

export const metadata = { title: "Clean File — live MVP" };

export default function DemoPage() {
  return (
    <>
      <Header active="demo" />
      <CleanFile />
    </>
  );
}
