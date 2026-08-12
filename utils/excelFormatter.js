import * as XLSX from "xlsx";

/**
 * Formats a SheetJS worksheet with auto column widths, row heights, and cell number formats.
 * @param {XLSX.WorkSheet} worksheet - The SheetJS worksheet instance.
 * @param {Array<Object>} data - The array of row objects used to create the sheet.
 */
export const styleWorksheet = (worksheet, data) => {
  if (!worksheet || !data || data.length === 0) return;

  // 1. Auto Column Width Calculation
  const keys = Object.keys(data[0]);
  const colWidths = keys.map((key) => {
    let maxLen = key ? key.toString().length : 10;
    data.forEach((row) => {
      const val = row[key];
      if (val !== null && val !== undefined) {
        let str = val.toString();
        if (typeof val === "number") {
          str = val.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
        if (str.length > maxLen) {
          maxLen = str.length;
        }
      }
    });
    // Add margin padding to ensure text and headers are never clipped
    return { wch: Math.max(maxLen + 5, 14) };
  });

  worksheet["!cols"] = colWidths;

  // 2. Set Row Heights for Header Row
  worksheet["!rows"] = [{ hpt: 26, hpx: 26 }];

  // 3. Apply Excel Cell Number Formatting based on column name hints
  if (worksheet["!ref"]) {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (!cell) continue;

        const colName = keys[C] || "";
        const lowerCol = colName.toLowerCase();

        if (typeof cell.v === "number") {
          if (
            lowerCol.includes("revenue") ||
            lowerCol.includes("price") ||
            lowerCol.includes("total") ||
            lowerCol.includes("php") ||
            lowerCol.includes("sales")
          ) {
            cell.z = '"₱"#,##0.00';
          } else if (
            lowerCol.includes("quantity") ||
            lowerCol.includes("qty") ||
            lowerCol.includes("units") ||
            lowerCol.includes("stock")
          ) {
            cell.z = "#,##0";
          } else if (
            lowerCol.includes("share") ||
            lowerCol.includes("%")
          ) {
            cell.z = "0.0%";
          }
        }
      }
    }
  }
};
