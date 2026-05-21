"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicToast = dynamic(() => import("./Toast"), {
  ssr: false,
});

const DynamicAddProductModal = dynamic(() => import("./AddProductModal"), {
  ssr: false,
});

const DynamicSessionModal = dynamic(() => import("./SessionModal"), {
  ssr: false,
});

export default function AdminSidebar() {
  const supabase = createClient(); // para sa logout
  const route = useRouter(); // para sa pang redirect sa admin/auth/login
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  // for mobile sidebar
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      document.documentElement.style.setProperty("--sidebar-width", "0rem");
    } else {
      const width = isCollapsed ? "5rem" : "16rem";
      document.documentElement.style.setProperty("--sidebar-width", width);
    }
  }, [isCollapsed]);

  // for collpasing sidebar in larger screens
  useEffect(() => {
    const width = isCollapsed ? "5rem" : "16rem"; // w‑64
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, [isCollapsed]);

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
    const clickedLink = linkName === href;
    const showLabel = !isCollapsed || isMobileOpen;

    return (
      <Link
        className={`flex items-center rounded-lg px-4 py-3 mx-2 transition-all group 
      ${!showLabel ? "justify-center" : "space-x-3"} 
      ${clickedLink ? "text-white bg-secondary-container drop-shadow-lg/30" : "text-input-field opacity-60 hover:scale-105 hover:opacity-90"}`}
        href={href || "#"}
      >
        <span className="material-symbols-outlined">{icon}</span>

        {showLabel && (
          <span className="font-headline uppercase text-xs font-black tracking-[0.2em]">
            {label}
          </span>
        )}
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
      {/* Mobile header (hamburger)  */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-[60] bg-secondary-container backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg text-black/90 font-black font-headline uppercase leading-none italic">
          {adminName ? adminName : "AlloyDash"} Admin
        </h1>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="material-symbols-outlined text-white"
        >
          {isMobileOpen ? "close" : "menu"}{" "}
        </button>
      </div>
      <aside
        className={`
    fixed top-0 left-0 h-full z-50 bg-primary-container flex flex-col py-6
    transition-all duration-300 border-r border-white/5
    
    /* Mobile responsive positioning logic */
    w-[16rem] lg:w-[var(--sidebar-width)]
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0
  `}
      >
        {/* Logo / title – hide when collapsed */}
        <div className="px-6 mb-10 hidden lg:block">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-lg hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={60}
                height={60}
                loading="lazy"
                className="rounded-lg border-black/90 border-1 shadow-lg/30"
              />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-black text-black font-headline uppercase leading-none">
                  {adminName ? adminName : "AlloyDash"} Admin
                </h1>
                <p className="font-headline uppercase text-xs font-black tracking-[0.3em] text-secondary-container mt-1">
                  SHOP ADMIN
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 mt-14 lg:mt-0">
          <SidebarLink
            icon="grid_view"
            label="DASHBOARD"
            href="/admin/dashboard"
          />
          <SidebarLink
            icon="analytics"
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
            icon="point_of_sale"
            label="POINT OF SALES"
            href="/admin/store"
          />

          <SidebarLink icon="reviews" label="REVIEWS" href="/admin/reviews" />

          <SidebarLink
            icon="feedback"
            label="FEEDBACK"
            href="/admin/feedbacks"
          />

          <SidebarLink
            icon="people"
            label="Customers"
            href="/admin/customers"
          />
        </nav>

        <div className="px-4 mt-auto space-y-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-secondary-container text-white/90 py-3 rounded-lg font-headline text-xs font-bold uppercase tracking-tighter flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
            {!isCollapsed && <span>Add New Product</span>}
          </button>
          {/* Collapse/expand button */}
          <div className="hidden lg:block">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full bg-secondary-container text-white/90 py-3 rounded-lg font-headline text-xs font-bold uppercase tracking-tighter flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">
                {isCollapsed
                  ? "horizontal_align_right"
                  : "horizontal_align_left"}
              </span>
              {!isCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
          <div className="pt-4 border-t border-surface-container-highest">
            <button
              onClick={showLogoutModal}
              className="w-full flex items-center space-x-3 rounded-lg border border-secondary-container text-input-field px-4 py-2 hover:bg-secondary-container hover:text-white/90  hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              {!isCollapsed && (
                <span className="font-headline uppercase text-sm font-bold tracking-widest">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <DynamicSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onConfirm={logoutAccount}
      />
      <DynamicAddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        showToast={showToast}
        onSuccess={fetchInventoryProduct}
      />
    </>
  );
}
