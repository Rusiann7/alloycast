import AdminSidebar from "../components/AdminSidebar";
import dynamic from "next/dynamic";

const DynamicAICopilot = dynamic(() => import("../components/AICopilot"));

export const metadata = {
  title: "AlloyDash Admin",
  description: "AI Analytics Inventory Management System",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicAICopilot />
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
