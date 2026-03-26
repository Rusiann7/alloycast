import "./globals.css";
import LandingPageNavbar from "./components/LandingPageNavbar";

export const metadata = {
  title: "AlloyDash",
  description: "The premier destination for elite diecast collectors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
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
      <body className="min-h-full flex flex-col custom-cursor-area">
        <LandingPageNavbar />
        {children}
      </body>
    </html>
  );
}
