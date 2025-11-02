import DashboardLayoutClient from "./_components/DashboardLayoutClient";

export default function DashboardLayout({ children }) {
  // Keep this layout server-side; the client Clerk provider is mounted
  // inside the client DashboardLayoutClient to avoid importing Clerk on the server.
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
