import { ThemeProvider } from "next-themes";
import Sidebar from "./dashboard/_components/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex dark:bg-dark">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64">
          {children}
        </main>
      </div >
    </ThemeProvider>

  );
}