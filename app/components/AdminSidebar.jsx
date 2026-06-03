"use client";
import { useState, useEffect, use } from "react";
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

const SidebarLink = ({
  icon,
  label,
  href,
  linkName,
  isCollapsed,
  isMobileOpen,
}) => {
  const clickedLink = linkName === href;
  const showLabel = !isCollapsed || isMobileOpen;

  return (
    <Link
      title={isCollapsed ? label : undefined}
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
  const supabase = createClient(); // para sa logout
export default function AdminSidebar() {
  const linkName = usePathname(); // pangkuha ng current link path para lagyan ng style
  // itatago nito ung navbar sa register at login page ng admin
  const hideNavbarOn = ["/admin/auth/login", "/admin/auth/register"];
  if (hideNavbarOn.includes(linkName)) return null;

  const route = useRouter(); // para sa pang redirect sa admin/auth/login
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  // merged for collpasing sidebar responsive
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if(isMobile){
        document.documentElement.style.setProperty("--sidebar-width", "0rem");
      } else {
        document.documentElement.style.setProperty("--sidebar-width", isCollapsed ? "5rem": "16rem");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return() => window.removeEventListener("resize", handleResize)
  }, [isCollapsed]);
  

  // display admin firstname after every reload
  useEffect(() => {
    let isMounted = true;
    // get firstname from auth and Admin table
    const getAdminName = async () => {
      try {
        const {
          data: { user }, error: authError
        } = await supabase.auth.getUser();
        
        if(authError || !user) return;

        const { data, error: dbError} = await supabase
          .from("Admin")
          .select("firstname")
          .eq("user_id", user.id)
          .single();

          if(dbError) throw Error;
        // Only update state if the component is still mounted
        if(isMounted && data){
          setAdminName(data.firstname || "Shop");
        }
      } catch (error) {
        console.log("Error fetching admin first name:", error.message);
      }
    };
    getAdminName();
    // cleanup function to prevent memory leaks when unmounting
    return () => {
      isMounted = false;
    }
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
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
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />
          <SidebarLink
            icon="analytics"
            label="ANALYTICS"
            href="/admin/analytics"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />
          <SidebarLink
            icon="inventory_2"
            label="INVENTORY"
            href="/admin/inventory"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />
          <SidebarLink
            icon="calendar_today"
            label="RESERVATIONS"
            href="/admin/reservations"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />

          <SidebarLink
            icon="point_of_sale"
            label="POINT OF SALES"
            href="/admin/store"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />

          <SidebarLink
            icon="reviews"
            label="REVIEWS"
            href="/admin/reviews"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />

          <SidebarLink
            icon="feedback"
            label="FEEDBACK"
            href="/admin/feedbacks"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
          />

          <SidebarLink
            icon="people"
            label="CUSTOMER"
            href="/admin/customers"
            linkName={linkName}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
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
              className="w-full flex items-center space-x-3 rounded-lg border border-secondary-container text-black/90 px-4 py-2 hover:bg-secondary-container hover:text-white/90  hover:scale-105 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              {!isCollapsed && (
                <span className="font-headline uppercase text-sm text-black/90 font-bold tracking-widest">
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
      />
    </>
  );
}
