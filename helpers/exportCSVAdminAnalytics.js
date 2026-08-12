import * as XLSX from "xlsx";
import { styleWorksheet } from "../utils/excelFormatter";

/**
 * Aggregates POS data and downloads it as an annual revenue Excel report.
 * @param {Array} posData - List of POS sales records from Supabase
 * @param {number|string} currentYear - The target calendar year
 */
export const exportAnnualRevenueToCSV = (posData = [], currentYear) => {
  const monthlyRevenue = Array(12).fill(0);
  let annualTotal = 0;

  posData.forEach((res) => {
    if (res.Inventory?.price) {
      const revenue = res.quantity * res.Inventory.price;
      const monthIndex = new Date(res.created_at).getMonth();
      monthlyRevenue[monthIndex] += revenue;
      annualTotal += revenue;
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

  const exportData = monthNames.map((month, index) => ({
    Month: month,
    "Total Revenue (PHP)": Number(monthlyRevenue[index].toFixed(2)),
  }));

  exportData.push({
    Month: "TOTAL ANNUAL REVENUE",
    "Total Revenue (PHP)": Number(annualTotal.toFixed(2)),
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  styleWorksheet(worksheet, exportData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Annual Revenue");

  XLSX.writeFile(
    workbook,
    `Analytics_Annual_Revenue_Report_${currentYear}.xlsx`,
  );
};
