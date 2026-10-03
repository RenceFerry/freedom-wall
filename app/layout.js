import { Bricolage_Grotesque, Caveat } from "next/font/google";
import "./globals.css";

const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--sans" });
const hand = Caveat({ subsets: ["latin"], variable: "--hand" });

export const metadata = { title: "Freedom Wall", description: "Post anonymously. No sign-in." };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
