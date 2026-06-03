import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
  title: "AlloyDash",
  description: "The reservation system for ordering diecast.",
};

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`min-h-full flex flex-col ${spaceGrotesk.className} ${inter.className}`}
      >
        `
        <ThemeProvider attribute="class" defaultTheme="dark">
          <GoogleAnalytics />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
