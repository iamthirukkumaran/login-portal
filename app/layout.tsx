// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "MyApp",
  description: "Next.js App with Auth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
