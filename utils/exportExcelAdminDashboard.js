// app/utils/exportExcel.js
import * as XLSX from "xlsx";

/**
 * Generates and downloads a multi-sheet spreadsheet.
 */
export const exportToExcelFile = ({
  // exports the core processor wrapper
  dateRange,
  posData,
  reservations,
  arrivals,
  showToast,
}) => {
  const workbook = XLSX.utils.book_new(); // instantiates a blank spreadsheet workbook instance structure in internal system memory

  // --- SHEET 1: REVENUE SUMMARY ---
  let revenueExport = []; // empty tracker array for revenue
  let grandTotal = 0; // zero-indexed tracking accumulator(iteration)

  if (dateRange === "Annual") {
    const monthly = Array(12).fill(0); // creates a blank array with 12 slots for each month starting 0 = January
    // Iterates over every POS entry returned from Supabase.
    // If the nested product card price exists,
    // it calculates transaction revenue,
    // reads the numerical month index (0-11),
    // adds the revenue to that month's slot,
    //  and updates the grandTotal
    posData.forEach((p) => {
      if (p.Inventory?.price) {
        const rev = p.quantity * p.Inventory.price;
        const m = new Date(p.created_at).getMonth();
        monthly[m] += rev;
        grandTotal += rev;
      }
    });

    // Defines an explicit text matrix for calendar months,
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
    // maps over it to produce clean,
    // formatted row rows linking the month name to its total revenue.
    revenueExport = monthNames.map((mn, i) => ({
      Month: mn,
      "Total Revenue (PHP)": Number(monthly[i].toFixed(2)),
    }));
  } else {
    // For shorter ranges, it sets up an object map.
    // It splits the ISO date text to isolate the calendar date string (YYYY-MM-DD),
    //  initializes or increments that specific date bucket with the calculated sale item revenue,
    //  and adds to the total.
    const daily = {};
    posData.forEach((p) => {
      if (p.Inventory?.price) {
        const rev = p.quantity * p.Inventory.price;
        const dKey = p.created_at.split("T")[0];
        daily[dKey] = (daily[dKey] || 0) + rev;
        grandTotal += rev;
      }
    });

    // Converts the unique object map keys into a sorted sequential calendar timeline array,
    // mapping each date into a clean spreadsheet data row.
    revenueExport = Object.keys(daily)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((dateStr) => ({
        Date: new Date(dateStr).toLocaleDateString(),
        "Total Revenue (PHP)": Number(daily[dateStr].toFixed(2)),
      }));
  }

  // Injects a final summary footer row onto the bottom of the data table,
  // converts the raw JSON array into a standard binary spreadsheet grid,
  // and attaches it as the first worksheet tab.
  revenueExport.push({
    Total: "Grand Total",
    "Total Revenue (PHP)": Number(grandTotal.toFixed(2)),
  });
  const revSheet = XLSX.utils.json_to_sheet(revenueExport);
  XLSX.utils.book_append_sheet(workbook, revSheet, `${dateRange} Revenue`);

  // --- SHEET 2: TOP PRODUCTS ---
  // Starts processing Sheet 2 (Top Products).
  // It iterates through the dataset to tally total unit counts for each model variant name,
  // tracking the global aggregate volume.
  const productAgg = {};
  let totalUnits = 0;
  posData.forEach((p) => {
    const name = p.Inventory?.item_name || "Unknown";
    productAgg[name] = (productAgg[name] || 0) + p.quantity;
    totalUnits += p.quantity;
  });

  // Maps the volume data into an export layout that calculates relative percentage market share,
  // sorts from highest units sold to lowest,
  // and logs it as the second tab in the workbook.
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

  // --- SHEET 3: ACTIVITY LEDGER RESERVATIONS---
  // Starts processing Sheet 3 (Activity Ledger Reservations).
  // It maps raw historical reservations arrays into structured spreadsheet rows with
  // separate date, time, and uppercase alphanumeric business lookup reference codes.
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
  // Starts processing Sheet 4 (New Inventory).
  // It builds a data sheet showing items introduced to the database during the selected time period,
  // along with their pricing metrics.
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
  // Generates a clean filename using the current date and selected date range,
  // compiles the binary file download directly inside the browser client context,
  // and triggers your decoupled success notification.
  const timestamp = new Date().toISOString().split("T")[0];
  XLSX.writeFile(
    workbook,
    `AlloyDash_Dashboard_${dateRange.replace(/\s+/g, "_")}_Report_${timestamp}.xlsx`,
  );
  showToast("Multi-sheet business report exported!", "success");
};
