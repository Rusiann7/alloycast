// app/utils/exportExcel.js
import * as XLSX from "xlsx";

/**
 * Generates and downloads a multi-sheet spreadsheet.
 */
export const exportToExcelFile = ({
  dateRange,
  posData,
  reservations,
  arrivals,
  showToast,
}) => {
  const workbook = XLSX.utils.book_new();

  // --- SHEET 1: REVENUE SUMMARY ---
  let revenueExport = [];
  let grandTotal = 0;

  if (dateRange === "Annual") {
    const monthly = Array(12).fill(0);
    posData.forEach((p) => {
      if (p.Inventory?.price) {
        const rev = p.quantity * p.Inventory.price;
        const m = new Date(p.created_at).getMonth();
        monthly[m] += rev;
        grandTotal += rev;
      }
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    revenueExport = monthNames.map((mn, i) => ({
      Month: mn,
      "Total Revenue (PHP)": Number(monthly[i].toFixed(2)),
    }));
  } else {
    const daily = {};
    posData.forEach((p) => {
      if (p.Inventory?.price) {
        const rev = p.quantity * p.Inventory.price;
        const dKey = p.created_at.split("T")[0];
        daily[dKey] = (daily[dKey] || 0) + rev;
        grandTotal += rev;
      }
    });
    revenueExport = Object.keys(daily)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((dateStr) => ({
        Date: new Date(dateStr).toLocaleDateString(),
        "Total Revenue (PHP)": Number(daily[dateStr].toFixed(2)),
      }));
  }

  revenueExport.push({
    Total: "Grand Total",
    "Total Revenue (PHP)": Number(grandTotal.toFixed(2)),
  });
  const revSheet = XLSX.utils.json_to_sheet(revenueExport);
  XLSX.utils.book_append_sheet(workbook, revSheet, `${dateRange} Revenue`);

  // --- SHEET 2: TOP PRODUCTS ---
  const productAgg = {};
  let totalUnits = 0;
  posData.forEach((p) => {
    const name = p.Inventory?.item_name || "Unknown";
    productAgg[name] = (productAgg[name] || 0) + p.quantity;
    totalUnits += p.quantity;
  });

  const topProductsExport = Object.keys(productAgg)
    .map((name) => ({
      "Product Name": name,
      "Units Sold": productAgg[name],
      "Market Share (%)":
        totalUnits > 0
          ? `${Math.round((productAgg[name] / totalUnits) * 100)}%`
          : "0%",
    }))
    .sort((a, b) => b["Units Sold"] - a["Units Sold"]);

  const topSheet = XLSX.utils.json_to_sheet(topProductsExport);
  XLSX.utils.book_append_sheet(workbook, topSheet, `${dateRange} Top Products`);

  // --- SHEET 3: ACTIVITY LEDGER ---
  const activityExport = (reservations || []).map((r) => ({
    Date: new Date(r.created_at).toLocaleDateString(),
    Time: new Date(r.created_at).toLocaleTimeString(),
    CustomerEmail: r.Users?.email || "",
    Product: r.Inventory?.item_name || "",
    Quantity: r.quantity || "",
    Status: r.status || "",
    Reference: `#RES-${String(r.id).slice(0, 4).toUpperCase()}`,
  }));

  const actSheet = XLSX.utils.json_to_sheet(activityExport);
  XLSX.utils.book_append_sheet(
    workbook,
    actSheet,
    `${dateRange} Activity Ledger`,
  );

  // --- SHEET 4: NEW INVENTORY ---
  const inventoryExport = (arrivals || []).map((i) => ({
    "Item Name": i.item_name,
    Price: Number(i.price).toFixed(2),
    "Date Added": new Date(i.created_at).toLocaleDateString(),
  }));

  const invSheet = XLSX.utils.json_to_sheet(inventoryExport);
  XLSX.utils.book_append_sheet(
    workbook,
    invSheet,
    `${dateRange} New Inventory`,
  );

  // --- GENERATE FILE ---
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(
    workbook,
    `Alloycast_Dashboard_${dateRange.replace(/\s+/g, "_")}_Report_${timestamp}.xlsx`,
  );
  showToast("Multi-sheet business report exported!", "success");
};
