/**
 * Aggregates POS data and downloads it as an annual revenue CSV report.
 */

// Defines a modular, pure export function. By accepting posData and currentYear as explicit arguments,
// this utility remains completely detached from React state or Supabase client instances,
// making it highly reusable across different parts of your application.
export const exportAnnualRevenueToCSV = (posData = [], currentYear) => {
  // Initializes a fixed-size mathematical array representing the 12 calendar months
  // (index 0 for January to index 11 for December) pre-populated with zeros.
  // It also sets up a baseline variable (annualTotal) to compute the absolute yearly gross summary
  const monthlyRevenue = Array(12).fill(0);
  let annualTotal = 0;

  // Iterates through every individual point-of-sale row returned from your database.
  // It uses optional chaining (Inventory?.price) to prevent structural errors from broken
  // inventory links, calculating the line-item revenue by multiplying quantity sold by item price.
  posData.forEach((res) => {
    if (res.Inventory?.price) {
      const revenue = res.quantity * res.Inventory.price;
      // Parses the database ISO timestamp (created_at) into a native JavaScript Date object and invokes
      //  .getMonth() to instantly get its matching 0-indexed array position.
      // It maps the calculated line revenue to its respective month slice and simultaneously updates
      // the gross annual total.
      const monthIndex = new Date(res.created_at).getMonth();
      monthlyRevenue[monthIndex] += revenue;
      annualTotal += revenue;
    }
  });

  // Declares an ordered string array of calendar month names.
  // This serves as a translation layer to turn technical array positions (0 through 11) into clean,
  // human-readable labels inside the spreadsheet.
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

  // Instantiates your raw text string accumulator and writes the very first row of the document.
  // The comma separation represents columns, and the \n character functions as a line-break to jump down
  // to the next row in Excel.
  let csvContent = "Month, Total Revenue (PHP)\n";
  // Loops through your month names array to append rows to your file data.
  // It uses .toFixed(2) to ensure all revenue sums are strictly formatted as
  // decimal currencies (e.g., 1500.00 instead of 1500), guaranteeing clean column visualization
  // inside spreadsheet software.
  monthNames.forEach((month, index) => {
    csvContent += `${month},${monthlyRevenue[index].toFixed(2)}\n,`;
  });

  // Adds an extra line break for spacing, then generates the final summary row at the bottom of
  // the document to showcase the overall annual gross calculation.
  csvContent += `\nTOTAL ANNUAL REVENUE,${annualTotal.toFixed(2)}\n`;

  // Packages your plain string text array into a raw binary data blob object.
  // Specifying the MIME type as text/csv with utf-8 encoding ensures that spreadsheet applications
  // like Excel, Numbers, or Google Sheets correctly recognize and parse the format.
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Generates a temporary, unique virtual URL pointing directly to the data blob resting in the
  // browser’s allocated system memory space.
  const url = URL.createObjectURL(blob);

  // Dynamically builds a virtual anchor (<a>) element inside memory.
  // It binds your data URL to the link destination and assigns a clean,
  // structured filename string using the current calendar year variable.
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Analytics_Annual_Revenue_Report${currentYear}.csv`,
  );

  // Mounts the invisible link to the active page document, programmatically triggers a click
  // event to prompt the browser's download window, and immediately strips the node out
  // of the DOM to clean up the page structure.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Explicitly wipes the temporary data URL from system memory.
  // This is a critical performance practice that frees up local system RAM and prevents memory leaks
  // during long, continuous user dashboard sessions.
  URL.revokeObjectURL(url);
};
