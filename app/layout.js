import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import ClerkProviderClient from "@/components/clerk-provider-client";
import { Toaster } from "sonner";
import { NavigationProgress } from "@/components/navigation-progress";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinAi",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50`}>
        <ClerkProviderClient>
          <NavigationProgress />
          {/* header */}
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/* footer */}
          <footer className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 py-12 mt-20">
            <div className="container mx-auto px-4 text-center text-white">
              <p className="font-semibold">Made with 💗 by VickySingh</p>
            </div>
          </footer>
        </ClerkProviderClient>
      </body>
    </html>
  );
}
