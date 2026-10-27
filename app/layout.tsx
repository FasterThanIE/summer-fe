import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Scene } from "@/components/scene";
import { ThemeToggle } from "@/components/theme-toggle";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";
import "./styles/base.css";
import "./styles/scene.css";
import "./styles/home.css";
import "./styles/results.css";
import "./styles/detail.css";
import "./styles/price-list.css";
import "./styles/lightbox.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "latin-ext"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Sunce putovanja",
  description: "Pronadji letovanje u Grckoj po svojoj meri.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" data-mode="light" className={`${playfair.variable} ${jakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Scene />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
