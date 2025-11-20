import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const metadata = {
  title: "CoachesPlaybookAI",
  description: "Sports analytics dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <FavoritesProvider>
          <Sidebar />
          <main className="md:pl-64 p-4">{children}</main>
        </FavoritesProvider>
      </body>
    </html>
  );
}
