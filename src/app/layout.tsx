import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { event } from "@/config/event";
import { formattedDate } from "@/lib/format";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${event.firstName} fête ses ${event.age} ans`,
  description: `Vous êtes invité·e à l'anniversaire de ${event.firstName}, le ${formattedDate} — ${event.venue.name}, ${event.venue.city}.`,
};

export const viewport: Viewport = {
  themeColor: "#0b0710",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable} antialiased`}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
