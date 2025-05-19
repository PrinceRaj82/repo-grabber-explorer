
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Guide from "./Guide";

export default function GuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Guide />
      </main>
      <Footer />
    </div>
  );
}
