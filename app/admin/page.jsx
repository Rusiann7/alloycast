export default function AdminDashboard() {
  const HeaderAction = ({ icon }) => (
    <button className="material-symbols-outlined text-[#e5e2e1] opacity-70 hover:text-primary-container hover:opacity-100 transition-all">
      {icon}
    </button>
  );
  return (
    <div className="bg-background text-on-surface font-body min-h-screen overflow-x-hidden select-none">
      {/* --- TopNavBar (Desktop Only) --- */}
      <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-[#131313]/60 backdrop-blur-xl hidden lg:flex justify-between items-center px-8 border-b border-white/5">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">
              search
            </span>
            <input
              className="bg-surface-container-highest/50 border-none rounded-[4px] pl-10 pr-4 py-2 w-full text-xs font-headline tracking-widest focus:ring-1 focus:ring-primary-container placeholder:text-on-surface/30 outline-none"
              placeholder="SEARCH SYSTEM ARCHIVE..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <HeaderAction icon="notifications" />
            <HeaderAction icon="settings" />
            <HeaderAction icon="help" />
          </div>
          <div className="h-8 w-px bg-surface-container-highest"></div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-[#e5e2e1]">
                Admin User
              </p>
              <p className="text-[8px] font-headline text-[#C8102E] font-black italic uppercase">
                System Root
              </p>
            </div>
            <img
              alt="Admin Profile"
              className="w-10 h-10 rounded-full border border-surface-container-highest object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8qtkW3P0OKqkDjFOjp2vG2xmjlHUu6WmI5xIPnqNARcDjcOfeG70XrEwnke3AFkwdVJMMuTJn92fuwKJo37rUispAJdhXUHdBKHGq-F0woedW9QtsVkHQSvqzdvHfhUCwinQR9DTdDuZ4GY44rbeCO-u367G6PopeheGm-Bs-qGPcjHWYoariDmeyUOfPeA7H-uA8f1vt27-v5hAwUNRF95I7g9BrfkEX-pQhUrBWZ7vDwd7KBJm43yB8W4EDFXYGcUfESweUGYg"
            />
          </div>
        </div>
      </header>
      {/* --- Main Content Canvas --- */}
      <main className="lg:ml-64 pt-24 lg:pt-24 px-6 lg:px-8 pb-12 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 reveal-up">
          <div>
            <h2 className="text-4xl font-black font-headline uppercase tracking-tighter leading-none italic">
              Admin <span className="text-primary-container">Dashboard</span>
            </h2>
            <p className="text-on-surface/50 text-xs font-headline uppercase tracking-widest mt-2">
              Operational Overview & Acquisition Velocity
            </p>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-surface-container-high px-4 py-2 rounded-[4px] text-[10px] font-headline font-bold uppercase tracking-widest border border-outline-variant/20 flex items-center justify-center space-x-2 hover:bg-surface-bright transition-colors">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              <span>Last 30 Days</span>
            </button>
            <button className="flex-1 md:flex-none bg-primary-container px-4 py-2 rounded-[4px] text-[10px] font-headline font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              <span>Export Logs</span>
            </button>
          </div>
        </div>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon="bookmark_manager"
            label="Total Reservations"
            value="1,284"
            trend="+12.4%"
            trendColor="text-secondary-container"
            delay="0.1s"
          />
          <KPICard
            icon="pending_actions"
            label="Pending Review"
            value="42"
            trend="Manual Auth Required"
            trendColor="text-on-surface/40"
            delay="0.2s"
          />
          <KPICard
            icon="payments"
            label="Revenue Estimate"
            value="$4.2M"
            trend="Target: 92%"
            trendColor="text-primary-container"
            delay="0.3s"
          />
          <KPICard
            icon="warning"
            label="Critical Stock"
            value="08"
            trend="Urgent"
            trendColor="text-primary-container"
            delay="0.4s"
            badge="Urgent"
          />
        </div>

        {/* Primary Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="lg:col-span-2 bg-surface-container-low p-8 rounded-[4px] border border-outline-variant/10 relative reveal-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-lg font-black font-headline uppercase tracking-tighter">
                  Reservations Velocity
                </h4>
                <p className="text-[10px] font-headline uppercase tracking-widest text-on-surface/40">
                  Active tracking across nodes
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <LegendItem color="bg-primary-container" label="Completed" />
                <LegendItem color="bg-secondary-container" label="Initiated" />
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 1000 200">
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#C8102E" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,200 L0,150 C100,120 200,180 300,140 C400,100 500,130 600,80 C700,30 800,100 900,60 L1000,40 L1000,200 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0,150 C100,120 200,180 300,140 C400,100 500,130 600,80 C700,30 800,100 900,60 L1000,40"
                  fill="none"
                  stroke="#C8102E"
                  strokeWidth="3"
                />
                <circle cx="300" cy="140" fill="#C8102E" r="4" />
                <circle cx="600" cy="80" fill="#C8102E" r="4" />
                <circle cx="900" cy="60" fill="#C8102E" r="4" />
              </svg>
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] font-headline font-bold text-on-surface/20 py-2">
                <span>1.5K</span>
                <span>1.0K</span>
                <span>0.5K</span>
                <span>0.0K</span>
              </div>
            </div>
          </div>

          {/* Side Panel: Volume */}
          <div
            className="bg-surface-container-low p-8 rounded-[4px] border border-outline-variant/10 reveal-up"
            style={{ animationDelay: "0.6s" }}
          >
            <h4 className="text-lg font-black font-headline uppercase tracking-tighter mb-6">
              Top Brand Volume
            </h4>
            <div className="space-y-6">
              <ProgressBar label="Shelby American" value="42%" />
              <ProgressBar label="Porsche AG" value="28%" />
              <ProgressBar label="Ferrari S.P.A" value="18%" />
              <ProgressBar label="Ford Performance" value="12%" />
            </div>
            <div className="mt-8 p-4 bg-surface-container-highest/20 rounded-[4px] border border-outline-variant/10">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-secondary-container">
                  trending_up
                </span>
                <div>
                  <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/80">
                    Growth Peak
                  </p>
                  <p className="text-[8px] text-on-surface/40 leading-relaxed uppercase">
                    Vintage Muscle segments up 14% this week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div
            className="xl:col-span-3 bg-surface-container-low rounded-[4px] border border-outline-variant/10 overflow-hidden reveal-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-lg font-black font-headline uppercase tracking-tighter">
                Activity Ledger
              </h4>
              <button className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary-container hover:text-secondary-container transition-colors">
                View All Archive
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-highest/30">
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Entity / Item
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Action
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40 text-right">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <TableRow
                    date="2023.10.24"
                    time="14:22:01"
                    item="1967 Mustang GT500"
                    action="Inventory Restock"
                    status="Priority"
                    statusColor="bg-secondary-container/10 text-secondary-container"
                    refId="#ARC-5902"
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCvnfL0yv-UW2-T7Nabl5WAx9WDhSchBQ2ju9m-HEbEtdIHPDi0Q14U_hR6h0UUvMVeweWdCwTJYKytE9v64ihc0LiP-p5GR-O1ByWLsK3OeAbx-BQ_mwbV8ZJ_q-5E9PQ0tVaBiVbQMbu1rjSMn_7c-9K9o18eA5dkGCUfU2Tmj0Wn_fcGyop9Fb5x8Zn5LirHCBQONOUhSjZ9vcNlKxp775T1Jco_QQ2EpMwEJrdAy5NMQzMm--BnYHOF-I7lEIWlFxqzM5_FYUw"
                  />
                  <TableRow
                    date="2023.10.24"
                    time="13:10:45"
                    item="Porsche 911 GT3 RS"
                    action="Order Delivery"
                    status="Complete"
                    statusColor="bg-green-500/10 text-green-500"
                    refId="#ORD-1284"
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCaQJvoMAucdYmdAY1MkbvHWsUYYf0TTpqG52izUkcXXZj3E8exiAsky5Bqlza1l101KvZAfbsYe3ztUDaTOuW9sudFSrI_4V-MBhmaKB5amnxNRYQU9cRzKSpHXyaaFy4vZIBOKnxRe-ql3rdHcHA64AYdm5ZbxfUXiPnU95V5sZ_JOeFdL0PQaoi5_6m-Uq8OboqcCKShkkuPX1G2y_2_3nTyvgM1e2KmtkLwmSm1_8rMJO9yMIxDCebPsqiK7Z2crfc7bet-rLU"
                  />
                  <TableRow
                    date="2023.10.24"
                    time="09:45:12"
                    item="Ferrari 250 GTO"
                    action="Bid Process"
                    status="Pending"
                    statusColor="bg-primary-container/10 text-primary-container"
                    refId="#BID-8831"
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCwwpKwF-HxZjdbKsnnEe8r5T5F4ZCENjpQ42K7ftQG61XAnFYzmMjjT_5yj3WKJEFUPcUV4kuEywNsoSxPmBrEoPy-M3wN9cg_QtbKLJtN5sG36zRSf295CbBhI--hN9HVfbfYcH2nIhVkKOCnuUPKRKDIbtLHndboEcL-y_OchXzVsiiTiRA9rc0UhBi7mTGIKgCjMIwmbUBeNL0ppFCUEwBwA_xCJqYb1MYVizcJFTVZrYO_ISdffA0CUZAu-IP_FRFxvlAx-2w"
                  />
                </tbody>
              </table>
            </div>
          </div>

          <div
            className="bg-surface-container-low p-6 rounded-[4px] border border-outline-variant/10 reveal-up"
            style={{ animationDelay: "0.8s" }}
          >
            <h4 className="text-sm font-black font-headline uppercase tracking-widest mb-6">
              Live Inventory{" "}
              <span className="text-primary-container ml-2 text-[10px]">
                14 NEW
              </span>
            </h4>
            <div className="space-y-4">
              <InventoryItem
                name="Ferrari F40 Comp"
                price="$2.45M"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ4E21lXBurIS_TWCdfOL3rkgZAV8Q_HCvzGktxGs6jRWCzAQMeGTr4aj1eVjl7l_mB8x6M2Ol4jKJk-7ubei34idebYwVoKaf9ZBwpGO7p7nKtweGTsDREJ2RsyqvdHR-Au6iXtJiQXGnXYTXol45bJ4VSK4GPXoup5TXjGLOBiSOsgQhOlmSHBe6XdfpNEqDWUvR7Ay1pcCnaFvM0ZNZ1QULJhZ5As6xOuafgQ3rUICZETKcs1ng_zOfulAipRuvNB1QV7I49hc"
              />
              <InventoryItem
                name="Porsche 911 Singer"
                price="$1.85M"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuAhTnncqNeHV29ytKg7N8n0hCB20gPaVNwCqaugA2N9Yl5CQFJ8z4LlVLRhAHzi3U-8moB8L-c05Bv9dDz2v3i7ee_coSItfNJHYdFu2HJUZmTU6k0EBVUXbPy-SiQPcE4-r0hySdIoSP6XOpBuAG9ODy2k-7HUVhUcdHF8UqeMHKbrWocUl7TJlYrEN6O3cfyY5DbRykaoXEfscvYlmdCset2ruMOb6sJA-qqwdvnfIIl0HjfIRgG6zhhAr__zMQPnCymQ5IjlQ0U"
              />
              <InventoryItem
                name="AC Cobra 427 S/C"
                price="$1.10M"
                img="https://lh3.googleusercontent.com/aida-public/AB6AXuADCCjlhQRddil5lw4UtXaD4aEdI0SpHODnwQv4wUwNCusIrAU7vK9MRawdsiM56fMHyDM-Ll6vnNlWiZ6lboalxgzMxpgdOuoOwYnC36qybnBXUGamCVgyHLnI58bxfK6jj1_IS8-uSc3N6VKR1QxksGkmRvYbORLI3DMrjxpYk-YxUKWlk-toiwiC23RibNYA3lc5mEtpT_gnhW6kQK7X2fSZDmJifzzdQ9tC3W8Kf3DDUrbScO5bMbaEuonKkbpH3_ZcjE2f0Fs"
              />
            </div>
            <button className="w-full mt-6 py-3 border border-outline-variant/20 rounded-[4px] text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-surface-container-highest hover:border-primary-container/20 transition-all">
              Manage Stock Vault
            </button>
          </div>
        </div>
      </main>

      {/* Contextual FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-white rounded-[4px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-4 bg-primary-container text-white text-[10px] font-headline font-bold uppercase tracking-widest px-3 py-1 rounded-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Launch New Batch Listing
        </span>
      </button>
    </div>
  );
}

const KPICard = ({ icon, label, value, trend, trendColor, delay, badge }) => (
  <div
    className="bg-surface-container-low p-6 rounded-[4px] border-l-2 border-primary-container relative overflow-hidden group reveal-up"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-between items-start mb-4">
      <span className="material-symbols-outlined text-primary-container">
        {icon}
      </span>
      {badge ? (
        <span className="bg-primary-container/20 text-primary-container text-[8px] px-2 py-0.5 rounded font-bold uppercase">
          {badge}
        </span>
      ) : (
        <span className={`text-[10px] font-headline font-bold ${trendColor}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface/40 mb-1">
      {label}
    </p>
    <h3 className="text-3xl font-black font-headline tracking-tighter">
      {value}
    </h3>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span className="material-symbols-outlined text-8xl">{icon}</span>
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center space-x-1">
    <div className={`w-3 h-3 ${color} rounded-full`}></div>
    <span className="text-[10px] font-headline font-bold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const ProgressBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-[10px] font-headline font-bold uppercase tracking-widest opacity-60">
        {label}
      </span>
      <span className="text-[10px] font-headline font-bold text-primary-container">
        {value}
      </span>
    </div>
    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div
        className="h-full bg-primary-container transition-all duration-1000"
        style={{ width: value }}
      ></div>
    </div>
  </div>
);

const TableRow = ({
  date,
  time,
  item,
  action,
  status,
  statusColor,
  refId,
  img,
}) => (
  <tr className="hover:bg-surface-container-highest/20 transition-colors group cursor-pointer">
    <td className="px-6 py-4">
      <p className="text-xs font-mono">{date}</p>
      <p className="text-[10px] opacity-40">{time}</p>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-6 bg-surface-container-highest rounded-[2px] overflow-hidden flex items-center justify-center">
          <img
            className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all"
            src={img}
            alt=""
          />
        </div>
        <p className="text-xs font-bold font-headline uppercase tracking-tight">
          {item}
        </p>
      </div>
    </td>
    <td className="px-6 py-4 text-[10px] font-headline font-medium uppercase tracking-widest opacity-60">
      {action}
    </td>
    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded-[2px] ${statusColor} text-[8px] font-bold uppercase tracking-widest`}
      >
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right text-[10px] font-mono opacity-40 group-hover:opacity-100 transition-opacity">
      {refId}
    </td>
  </tr>
);

const InventoryItem = ({ name, price, img }) => (
  <div className="flex items-center space-x-4 p-3 bg-surface-container-highest/20 rounded-[4px] group cursor-pointer hover:bg-surface-container-highest transition-all border border-transparent hover:border-primary-container/20">
    <img
      className="w-12 h-12 rounded-[2px] object-cover filter grayscale group-hover:grayscale-0 transition-all"
      src={img}
      alt=""
    />
    <div className="flex-1">
      <p className="text-[10px] font-headline font-bold uppercase tracking-tight truncate">
        {name}
      </p>
      <p className="text-[9px] font-headline text-primary-container font-black tracking-widest uppercase">
        {price}
      </p>
    </div>
    <span className="material-symbols-outlined text-on-surface/20 group-hover:text-primary-container transition-colors text-sm">
      arrow_forward_ios
    </span>
  </div>
);
