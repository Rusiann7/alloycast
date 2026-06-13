"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import emailjs from "@emailjs/browser";
import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TableSkeleton } from "../../components/Skeleton";

const DynamicOrderStatusConfirmationModal = dynamic(
  () => import("../../components/OrderStatusConfirmationModal"),
);

const DynamicToast = dynamic(() => import("../../components/Toast"));

const supabase = createClient();

export default function AdminReservations() {
  const [activeTab, setActiveTab] = useState("All Items");
  const [reservation, setReservation] = useState([]);
  const [reservationDB, setReservationDB] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    reservationId: null,
    newStatus: null,
    customerEmail: null,
    customerName: null,
    productName: null,
  });

  const itemsPerPage = 5;

  const transaction = reservationDB.length;

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 4000);
  };

  useEffect(() => {
    const fetchTableData = async () => {
      const { data: reservationData } = await supabase
        .from("Reservation")
        .select("*, Users(id, email), Inventory(item_name, item_image, brand)")
        .order("created_at", { ascending: false });

      const { data: customerData } = await supabase
        .from("Customer")
        .select("user_id, firstname, lastname");

      if (reservationData && customerData) {
        const mergedTables = reservationData.map((reservation) => {
          const matchCustomer = customerData.find(
            (customer) => customer.user_id === reservation.user_id,
          );

          return {
            id: reservation.id,
            customer: matchCustomer
              ? `${matchCustomer.firstname} ${matchCustomer.lastname}`
              : "Details Not Provided",
            customer_email: reservation.Users?.email,
            item_name: reservation.Inventory?.item_name,
            brand: reservation.Inventory?.brand || "Unkownd Brand",
            qty: (reservation.quantity || 0).toString().padStart(2, "0"),
            date: new Date(reservation.created_at).toLocaleDateString(),
            status: reservation.status || "Pending",
            statusColor:
              reservation.status === "Approved"
                ? "bg-green-700 text-white/90 border-green-500/20"
                : reservation.status === "Declined" ||
                    reservation.status === "Cancelled"
                  ? "bg-red-400/50 text-red-300 border-red-500/20"
                  : "bg-primary-container text-secondary-container border-white/10",
            statusDot:
              reservation.status === "Approved"
                ? "bg-green-500"
                : reservation.status === "Declined" ||
                    reservation.status === "Cancelled"
                  ? "bg-red-500"
                  : "bg-secondary-container",

            img: reservation.Inventory?.item_image || "/logo.jpg",
          };
        });
        setReservation(mergedTables);
      }
      setLoading(false);
    };
    fetchTableData();
  }, []);

  useEffect(() => {
    let startDate = new Date();

    startDate.setHours(0, 0, 0, 0);

    const todayCountGetter = async () => {
      const { count } = await supabase
        .from("Reservation")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString());

      setTodayCount(count || 0);
    };

    todayCountGetter();
  }, []);

  const exportToExcel = () => {
    // data to be expored to excel
    const exportData = reservation.map((res) => ({
      "Customer Name": res.customer,
      "Email Address": res.customer_email,
      "Product Name": res.item_name,
      Brand: res.brand,
      Quantity: res.qty,
      "Date Reserved": res.date,
      Status: res.status,
    }));

    // craete a worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations");

    // download the excel
    XLSX.writeFile(workbook, "Ethan_Marcus_Reservations_Report.xlsx");
  };

  const handleActionClick = (
    reservationId,
    newStatus,
    customerEmail,
    customerName,
    productName,
  ) => {
    setConfirmModal({
      isOpen: true,
      reservationId,
      newStatus,
      customerEmail,
      customerName,
      productName,
    });
  };

  const handleConfirm = (reasonCancellation = "") => {
    const {
      reservationId,
      newStatus,
      customerEmail,
      customerName,
      productName,
    } = confirmModal;
    setConfirmModal({ ...confirmModal, isOpen: false });
    statusUpdate(
      reservationId,
      newStatus,
      customerEmail,
      customerName,
      productName,
      reasonCancellation,
    );
  };

  const handleCancel = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const statusUpdate = async (
    reservationId,
    newStatus,
    customerEmail,
    customerName,
    productName,
    reasonCancellation = "",
  ) => {
    const { error } = await supabase
      .from("Reservation")
      .update({ status: newStatus })
      .eq("id", reservationId);

    if (error) {
      showToast("Failed to update status. Try again later", "error");
      return;
    }

    // Update UI state immediately for responsive UX
    setReservation((prevReservations) =>
      prevReservations.map((res) => {
        if (res.id === reservationId) {
          const isApproved = newStatus === "Approved";
          const isRejected = newStatus === "Declined";
          let statusColor = "bg-white/5 text-white/60 border-white/10";
          let statusDot = "bg-white/40";
          if (isApproved) {
            statusColor = "bg-green-500/10 text-green-400 border-green-500/20";
            statusDot = "bg-green-500";
          } else if (isRejected) {
            statusColor = "bg-red-500/10 text-red-400 border-red-500/20";
            statusDot = "bg-red-500";
          }
          return { ...res, status: newStatus, statusColor, statusDot };
        }
        return res;
      }),
    );

    try {
      if (newStatus === "Approved") {
        await emailjs.send(
          "service_mu3qrbd",
          "template_uhrasxf",
          {
            to_email: customerEmail,
            customerName: customerName,
            productName: productName,
            status: newStatus,
            message:
              newStatus === "Approved"
                ? "Great news! Your order is approved. Please visit the store to complete your pickup."
                : "Unfortunately, your reservation could not be accommodated at this time.",
          },
          "3ilQZwBk_Cxjfohab",
        );

        showToast(
          "An email will be sent to customer about the order status",
          "success",
          "success",
        );
      } else if (newStatus === "Declined") {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to_email: customerEmail,
            customerName: customerName,
            productName: productName,
            status: newStatus,
            reasonCancellation: reasonCancellation,
          }),
        });
        const result = await response.json();
        if (result.success) {
          showToast("Cancellation email sent to customer", "success");
        } else {
          throw new Error(result.error);
        }
      }
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      showToast("Failed to send email notification to customer.", "error");
    }
  };

  useEffect(() => {
    const reservationDataDB = async (dateRange) => {
      try {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        switch (dateRange) {
          case "Today":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "Yesterday":
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
            break;
          case "This Week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "This Month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "All Time":
            startDate = new Date(0); // Year 1970
            endDate = new Date();
            break;
          default:
            startDate.setDate(now.getDate() - 30);
        }
        const { data: reservationData } = await supabase
          .from("Reservation")
          .select(
            "*, Users(id, email), Inventory(item_name, item_image, brand)",
          )
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        const { data: customerData } = await supabase
          .from("Customer")
          .select("user_id, firstname, lastname");

        if (reservationData && customerData) {
          const mergedTables = reservationData.map((reservation) => {
            const matchCustomer = customerData.find(
              (customer) => customer.user_id === reservation.user_id,
            );

            return {
              id: reservation.id,
              customer: matchCustomer
                ? `${matchCustomer.firstname} ${matchCustomer.lastname}`
                : "Unknown Customer",
              customer_email: reservation.Users?.email,
              item_name: reservation.Inventory?.item_name,
              brand: reservation.Inventory?.brand || "Unkownd Brand",
              qty: (reservation.quantity || 0).toString().padStart(2, "0"),
              date: new Date(reservation.created_at).toLocaleDateString(),
              status: reservation.status || "Pending",
              statusColor:
                reservation.status === "Approved"
                  ? "bg-green-700 text-white/90 border-green-500/20"
                  : reservation.status === "Declined" ||
                      reservation.status === "Cancelled"
                    ? "bg-red-400/50 text-red-300 border-red-500/20"
                    : "bg-primary-container text-secondary-container border-white/10",
              statusDot:
                reservation.status === "Approved"
                  ? "bg-green-500"
                  : reservation.status === "Declined" ||
                      reservation.status === "Cancelled"
                    ? "bg-red-500"
                    : "bg-secondary-container",

              img: reservation.Inventory?.item_image || "/logo.jpg",
            };
          });
          setReservationDB(mergedTables);
        }
      } catch (error) {
        console.log(error);
      }
    };
    reservationDataDB(dateRange);
  }, [dateRange]);

  return (
    <div className="text-white/90 min-h-screen font-body relative overflow-x-hidden selection:bg-primary-container selection:text-white">
      <DynamicToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />
      <DynamicOrderStatusConfirmationModal
        isOpen={confirmModal.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        status={confirmModal.newStatus}
        customerName={confirmModal.customerName}
        productName={confirmModal.productName}
      />

      {/* --- Main Content --- */}

      <main className="pl-0 pt-24 lg:pt-5 lg:pl-[var(--sidebar-width)] ml-10 px-6 lg:px-8 pb-12 transition-all duration-500">
        {/* Page Header */}
        <div className="text-font-color flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal-up ">
          <div className="mb-14 reveal-up">
            <h3 className="text-4xl sm:text-6xl text-font-color font-black font-headline tracking-tighter uppercase italic leading-none">
              RESERVATIONS
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                TOTAL RESREVATIONS:{" "}
                <span className="text-font-color">
                  {reservation.length}
                </span>{" "}
              </p>
              <div className="w-1 h-1 bg-secondary-container rounded-full" />
              <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-font-color">
                PENDING RESERVATIONS:{" "}
                <span className="text-font-color">
                  {reservation.filter((res) => res.status === "Pending").length}
                </span>
              </p>
            </div>
          </div>
          <div className="relative group">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-3 bg-primary-container shadow-lg/30 px-6 py-3 border border-white/5 text-black/90  font-bold text-md uppercase tracking-widest hover:scale-105 transition-all rounded-lg group relative overflow-hidden"
            >
              <span className="material-symbols-outlined text-lg">
                download
              </span>
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div
          className="flex items-center gap-10  mb-10 overflow-x-auto scrollbar-hide reveal-up"
          style={{ animationDelay: "0.1s" }}
        >
          {[
            "All Items",
            "Pending",
            "Approved",
            "Declined",
            "Cancelled",
            "Reports",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`pb-5  text-md  font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative ${
                activeTab === tab
                  ? "text-secondary-container"
                  : "text-font-color opacity-100 hover:opacity-60"
              }`}
            >
              {tab}
              {tab === "Pending" && (
                <span className="ml-2 w-2 h-2 rounded-full bg-secondary-container inline-block" />
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary-container animate-scale-in" />
              )}
            </button>
          ))}
        </div>

        {/* Reservations Table / Reports */}
        {activeTab !== "Reports" ? (
          <div
            className="bg-secondary-container rounded-lg shadow-lg/30 overflow-hidden reveal-up"
            style={{ animationDelay: "0.3s" }}
          >
            {loading ? (
              <div className="p-6">
                <TableSkeleton columns={8} rows={5} />
              </div>
            ) : (
              <div className="overflow-x-auto ">
                <table className="w-full text-left border-collapse">
                  <thead className="text-center">
                    <tr className="bg-input-field border-b border-primary-container">
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Customer Details
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Product Image
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Product Name
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Product Brand
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Quantity
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Date Reserved
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Status
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {reservation
                      .filter((res) =>
                        activeTab === "All Items"
                          ? true
                          : res.status === activeTab,
                      )
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage,
                      )
                      .map((res) => (
                        <tr
                          key={res.id}
                          className={`group hover:bg-white/[0.01] transition-all duration-300 cursor-pointer border-b border-primary-container`}
                        >
                          <td className="p-6">
                            <p className="font-black text-md tracking-tight uppercase group-hover:text-primary-container transition-colors">
                              {res.customer || "Details Not Provided"}
                            </p>
                            <p className="font-body text-md text-white mt-1 tabular-nums italic">
                              {res.email}
                            </p>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center  gap-4">
                              <div className="w-auto h-30 bg-black/40 rounded-lg overflow-hidden border border-white/5 relative group-hover:border-primary-container/30 transition-all duration-500">
                                <Image
                                  src={res.img}
                                  alt={res.model || "Product Model Image"}
                                  width={100}
                                  height={100}
                                  className="w-xs h-full object-cover filter group-hover:scale-110 transition-all duration-700"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center  gap-4">
                              <p className=" font-bold text-md tracking-tight uppercase">
                                {res.item_name}
                              </p>
                            </div>
                          </td>
                          <td className="p-6">
                            <div>
                              <span className="inline-block px-2 py-0.5 bg-white/[0.03] text-md font-black border border-white/[0.05] text-white mt-1.5 uppercase tracking-widest">
                                {res.brand}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 text-center font-black text-md tabular-nums  ">
                            {res.qty}
                          </td>
                          <td className="p-6 text-md font-black text-white uppercase tracking-widest  transition-colors ">
                            {res.date}
                          </td>
                          <td className="p-6">
                            <span
                              className={`inline-flex items-center gap-3 px-4 py-2 ${res.statusColor} text-md font-black uppercase tracking-widest rounded-lg border`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${res.statusDot} animate-pulse`}
                              ></span>
                              {res.status}
                            </span>
                          </td>
                          {/* --- ACTION COLUMN --- */}
                          <td
                            className="p-6 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {/* Status Update Action Dropdown */}
                              <div className="flex text-center gap-2">
                                {/* --- Approve Button --- */}
                                <button
                                  className="w-9 h-9 flex items-center justify-center bg-green-500 transition-colors rounded-lg text-black/90  group/btn disabled:opacity-60 disabled:cursor-not-allowed disabled:grayscale"
                                  disabled={
                                    res.status === "Approved" ||
                                    res.status === "Declined"
                                  }
                                  onClick={() =>
                                    handleActionClick(
                                      res.id,
                                      "Approved",
                                      res.customer_email,
                                      res.customer,
                                      res.item_name,
                                    )
                                  }
                                  title="Approve Reservation"
                                >
                                  <span className="material-symbols-outlined text-lg  group-hover/btn:opacity-100 transition-opacity">
                                    check
                                  </span>
                                </button>

                                {/* --- Reject Button --- */}
                                <button
                                  className="w-9 h-9 flex items-center justify-center bg-red-400 transition-colors rounded-lg text-red-700 group/btn disabled:opacity-20 disabled:cursor-not-allowed disabled:grayscale"
                                  disabled={
                                    res.status === "Approved" ||
                                    res.status === "Declined"
                                  }
                                  onClick={() =>
                                    handleActionClick(
                                      res.id,
                                      "Declined",
                                      res.customer_email,
                                      res.customer,
                                      res.item_name,
                                    )
                                  }
                                  title="Decline Reservation"
                                >
                                  <span className="material-symbols-outlined text-lg  group-hover/btn:opacity-100 transition-opacity">
                                    close
                                  </span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex items-center justify-center p-8 bg-[#131313]/50 ">
              <div className="flex items-center gap-3">
                {/* Pagination Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-white/90 textmd hover:bg-white/50 transition-colors disabled:opacity-20"
                  >
                    <span className="material-symbols-outlined text-md">
                      chevron_left
                    </span>
                  </button>

                  {/* Page Indicator */}
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-black  font-black text-md">
                    {currentPage}
                  </button>

                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)} // (Add check for total pages if you want)
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-white/90 text-md hover:bg-white/50 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-md">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 reveal-up">
            {/* Sticky Date Range Control */}
            <div className="sticky mt-5 z-30 rounded-lg bg-secondary-container backdrop-blur-xl border-b border-white/5 px-4 sm:px-10 py-5 flex flex-wrap items-center justify-center gap-6 reveal-up shadow-lg/30">
              <div className="grid grid-cols-2 md:flex items-center p-1 rounded-lg border border-primary-container bg-input-field gap-1 md:gap-0 w-full md:w-auto">
                {[
                  "Today",
                  "Yesterday",
                  "This Week",
                  "This Month",
                  "All Time",
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      setDateRange(label);
                    }}
                    className={`px-4 py-3 md:py-2 text-xs sm:text-sm font-headline font-black uppercase tracking-widest transition-all rounded-lg ${
                      dateRange === label
                        ? "bg-primary-container text-black/90 shadow-lg"
                        : "text-white/90 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
              {[
                {
                  label: "Today's Reservations",
                  value: todayCount,
                  icon: "book_online",
                  color: "text-green-400",
                },
                {
                  label: "Transactions",
                  value: transaction,
                  icon: "receipt_long",
                  color: "text-blue-400",
                },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className="bg-secondary-container shadow-lg/30 p-6 rounded-lg border border-white/5 group hover:scale-105 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`material-symbols-outlined ${kpi.color} text-4xl`}
                    >
                      {kpi.icon}
                    </span>
                  </div>
                  <p className="text-white/60 text-[12px] font-black uppercase tracking-[0.2em] mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-4xl font-headline font-black text-primary-container italic tracking-tighter">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Reports Table */}
            <div className="bg-secondary-container rounded-lg shadow-lg/30 overflow-hidden reveal-up">
              <div className="overflow-x-auto ">
                <table className="w-full text-left border-collapse">
                  <thead className="text-center">
                    <tr className="bg-input-field">
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Customer Details
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Product Image
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Product Name
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Product Brand
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Quantity
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Date Reserved
                      </th>
                      <th className="p-6  text-md font-black tracking-[0.3em] uppercase text-primary-container">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {reservationDB.map((res) => (
                      <tr
                        key={res.id}
                        className="group hover:bg-white/[0.01] transition-all duration-300 cursor-pointer border-l-4 border-l-transparent"
                      >
                        <td className="p-6">
                          <p className="font-black text-md tracking-tight uppercase group-hover:text-primary-container transition-colors">
                            {res.customer}
                          </p>
                          <p className="font-body text-md text-white mt-1 tabular-nums italic">
                            {res.customer_email}
                          </p>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-auto h-30 bg-black/40 rounded-lg overflow-hidden border border-white/5 relative group-hover:border-primary-container/30 transition-all duration-500">
                              <Image
                                src={res.img}
                                alt={res.item_name || "Image"}
                                width={100}
                                height={100}
                                className="w-xs h-full object-cover filter group-hover:scale-110 transition-all duration-700"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-md tracking-tight uppercase">
                              {res.item_name}
                            </p>
                          </div>
                        </td>
                        <td className="p-6">
                          <div>
                            <span className="inline-block px-2 py-0.5 bg-white/[0.03] text-md font-black border border-white/[0.05] text-white mt-1.5 uppercase tracking-widest">
                              {res.brand}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 text-center font-black text-md tabular-nums">
                          {res.qty}
                        </td>
                        <td className="p-6 text-md font-black text-white uppercase tracking-widest transition-colors">
                          {res.date}
                        </td>
                        <td className="p-6">
                          <span
                            className={`inline-flex items-center gap-3 px-4 py-2 ${res.statusColor} text-md font-black uppercase tracking-widest rounded-lg border`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${res.statusDot} animate-pulse`}
                            ></span>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(200, 16, 46, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 16, 46, 0.5);
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
