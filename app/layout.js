import { Geist, Geist_Mono } from "next/font/google";
import {CommentProvider} from '../contexts/Comment';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SlideSU",
  description: "Created for SeattleU Hackathon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <CommentProvider>
        {children}
        </CommentProvider>
      </body>
    </html>
  );
}
