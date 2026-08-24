import type { Metadata, Viewport } from "next";
import { Ubuntu_Sans_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { RouteProvider } from "@/lib/spa-router";
import PWARegister from "@/components/PWARegister";

const mono = Ubuntu_Sans_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Git USSR — Repository Index",
    template: "%s — Repository Index",
  },
  description: "A searchable, terminal-inspired command center for any public GitHub user's repositories.",
  icons: {
    icon: "/icon.svg",
    apple: "/icons/icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

// See src/app/not-found.tsx for the matching "capture" half of this trick.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const RESTORE_PATH_SCRIPT = `(function () {
  var basePath = ${JSON.stringify(BASE_PATH)};
  var params = new URLSearchParams(window.location.search);
  var redirect = params.get("redirect");
  if (redirect === null) return;
  window.history.replaceState(null, "", basePath + redirect);
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Script id="restore-path" strategy="beforeInteractive">
          {RESTORE_PATH_SCRIPT}
        </Script>
        <div aria-hidden="true" className="h-[3px] w-full shrink-0" style={{ backgroundImage: "var(--gradient-brand)" }} />
        <RouteProvider>{children}</RouteProvider>
        <PWARegister />
      </body>
    </html>
  );
}
