import "./globals.css";
import { Space_Grotesk, Inter, Rubik } from "next/font/google";
import { Space_Grotesk, Inter, Rubik } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle";
import DotGrid from "./components/DotGrid";
import DotGrid from "./components/DotGrid";

export const metadata = {
  title: "AlloyDash",
  description: "The reservation system for ordering diecast.",
};

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

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
        className={`min-h-full flex flex-col ${spaceGrotesk.className} ${inter.className} ${rubik.variable}`}
        className={`min-h-full flex flex-col ${spaceGrotesk.className} ${inter.className} ${rubik.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <GoogleAnalytics />

          {/* Global Background Layer */}
          <div className="fixed inset-0 -z-50 w-full min-h-screen pointer-events-auto overflow-hidden">
            <DotGrid
              dotSize={4}
              className="opacity-25 dark:opacity-40"
              gap={15}
              baseColor="#232116"
              activeColor="#fffd00"
              proximity={120}
              speedTrigger={100}
              shockRadius={250}
              shockStrength={5}
              maxSpeed={5000}
              resistance={750}
              returnDuration={1.5}
            />
          </div>

          {/* Main App Content Layer */}
          <div className="relative z-10 min-h-screen w-full">{children}</div>

          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
