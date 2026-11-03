import { Header } from "@/components/Header";
import { DealClock } from "./DealClock";

export const metadata = { title: "Deal Clock — live MVP by Jorge Mariel" };

export default function DemoPage() {
  return (
    <>
      <Header active="demo" />
      <DealClock />
    </>
  );
}
