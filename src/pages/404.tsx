
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NotFound from "../pages/NotFound";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <NotFound />
      </main>
      <Footer />
    </div>
  );
}
