"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import SessionModal from "./SessionModal";
import AddProductModal from "./AddProductModal";
import Toast from "./Toast";
export default function AdminSidebar() {
  const supabase = createClient(); // para sa logout
  const route = useRouter(); // para sa pang redirect sa admin/auth/login
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  // display admin firstname after every reload
  useEffect(() => {
    getAdminName();
  }, []);

  // get firstname from auth and Admin table
  const getAdminName = async (userId) => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("Admin")
        .select("firstname")
        .eq("user_id", user.id)
        .single();

      setAdminName(data.firstname || "Admin");
      console.log("Admin Firstname: ", data.firstname);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchInventoryProduct();
  }, []);

  // kunin mga product sa loob ng Inventory Table
  const fetchInventoryProduct = async () => {
    try {
      let { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .order("created_at");

      if (error) throw error;
      setInventory(data || []); // ilagay sa inventory state ung nafetch na product
      console.log("Product Fetched successfully");
    } catch (error) {
      showToast("Error fetching products from Inventory");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  };

  const linkName = usePathname(); // pangkuha ng current link path para lagyan ng style

  // itatago nito ung navbar sa register at login page ng admin
  const hideNavbarOn = ["/admin/auth/login", "/admin/auth/register"];
  if (hideNavbarOn.includes(linkName)) return null;
  console.log("Current Link:", linkName);

  const SidebarLink = ({ icon, label, href }) => {
    const clickedLink = linkName === href; // isave sa clickedLink ung linkName then kukunin ung url sa href na naclick
    return (
      <Link
        className={`flex items-center space-x-3 rounded-[4px] px-4 py-3 mx-2 transition-all group ${clickedLink ? "text-black/90 bg-primary-container" : "text-[#e5e2e1] opacity-60 hover:bg-[#2a2a2a] hover:opacity-100"}`}
        href={href || "#"}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="font-headline uppercase text-[10px] font-black tracking-[0.2em]">
          {label}
        </span>
      </Link>
    );
  };

  const showLogoutModal = async () => {
    setShowSessionModal(true);
  };
  // logout function at session destroy
  const logoutAccount = async () => {
    const { error } = await supabase.auth.signOut(); // global signout para sa lahat ng device
    if (error) {
      console.log("Error during logout:", error.message);
    } else {
      console.log("Logout successful: Session destroyed.");
      setShowSessionModal(false);
      route.push("/admin/auth/login");
    }
  };

  return (
    <>
      {/* --- Mobile Header (Hamburger) --- */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[60] bg-[#131313]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container flex items-center justify-center rounded-[4px]">
            <span className="material-symbols-outlined text-white text-sm">
              precision_manufacturing
            </span>
          </div>
          <h1 className="text-lg font-black font-headline uppercase leading-none italic">
            {adminName ? adminName : "Admin"}
          </h1>
        </div>
        <button
          onClick={() => setActiveSidebar(!activeSidebar)}
          className="material-symbols-outlined text-white"
        >
          {activeSidebar ? "close" : "menu"}
        </button>
      </div>

      {/* --- SideNavBar --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-[#131313] flex flex-col py-6 transition-transform duration-300 border-r border-white/5 ${activeSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-6 mb-10 hidden lg:block">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-[4px]">
              <img src="/logo.jpg" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#e5e2e1] font-headline uppercase leading-none ">
                {adminName}
              </h1>
              <p className="font-headline uppercase text-[10px] font-black tracking-[0.3em] text-primary-container/98 mt-1">
                SHOP ADMIN
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 mt-14 lg:mt-0">
          <SidebarLink
            icon="grid_view"
            label="DASHBOARD"
            href="/admin/dashboard"
          />
          <SidebarLink
            icon="grid_view"
            label="ANALYTICS"
            href="/admin/analytics"
          />
          <SidebarLink
            icon="inventory_2"
            label="INVENTORY"
            href="/admin/inventory"
          />
          <SidebarLink
            icon="calendar_today"
            label="RESERVATIONS"
            href="/admin/reservations"
          />

          <SidebarLink
            icon="shopping_cart"
            label="POINT OF SALES"
            href="/admin/store"
          />

          <SidebarLink icon="group" label="CUSTOMERS" href="/admin/customers" />
          <SidebarLink icon="ios_share" label="EXPORT" href="/admin/export" />
        </nav>

        <div className="px-4 mt-auto space-y-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-primary-container text-black/90 py-3 rounded-[4px] font-headline text-xs font-bold uppercase tracking-tighter flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
            <span>New Product</span>
          </button>
          <div className="pt-4 border-t border-surface-container-highest">
            {/* <a
              className="flex items-center space-x-3 text-[#e5e2e1] px-4 py-2 opacity-60 hover:opacity-100 transition-opacity"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-headline uppercase text-xs font-bold tracking-widest">
                Settings
              </span>
            </a> */}
            <button
              onClick={showLogoutModal}
              className="flex items-center space-x-3 text-[#e5e2e1] px-4 py-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-headline uppercase text-xs font-bold tracking-widest">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onConfirm={logoutAccount}
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        showToast={showToast}
        onSuccess={fetchInventoryProduct}
      />
    </>
  );
}
