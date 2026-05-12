import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
  title: "AlloyDash",
  description: "The reservation system for ordering diecast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&family=Inter:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <GoogleAnalytics />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
