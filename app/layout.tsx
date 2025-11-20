// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoachesPlaybookAI",
  description: "Alpha build – internal use only",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   import { FavoritesProvider } from "@/context/FavoritesContext";

<html lang="en">
  <body className="...">
    <FavoritesProvider>
      {children}
    </FavoritesProvider>
  </body>
</html>
 
}

