import AdminSidebar from "../components/AdminSidebar";

export const metadata = {
  title: "AlloyDash Admin",
  description: "Inventory Management System",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <AdminSidebar />
        {children}
      </div>
    </div>
  );
}
