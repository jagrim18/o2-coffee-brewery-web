import React, { useState, useMemo } from "react";
import {
  ActivityLog,
  CafeTable,
  HourlyMetric,
  InventoryItem,
  OrderRecord,
} from "../types/cafe";

interface AdminDashboardPageProps {
  orders: OrderRecord[];
  tables: CafeTable[];
  inventory: InventoryItem[];
  hourlyMetrics: HourlyMetric[];
  activityLogs: ActivityLog[];
  onRestockIngredient: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  orders,
  tables,
  inventory,
  hourlyMetrics,
  activityLogs,
  onRestockIngredient,
}) => {
  const [timeframe, setTimeframe] = useState<"Today" | "This Week">("Today");

  const totalRevenue = useMemo(
    () => hourlyMetrics.reduce((sum, h) => sum + h.revenue, 0),
    [hourlyMetrics]
  );

  const collectedRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((sum, o) => sum + o.totalAmount, 0) + 89450,
    [orders]
  );

  const pendingCounterTotal = useMemo(
    () =>
      orders
        .filter((o) => o.paymentStatus === "Pending at Counter")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.currentStock <= i.lowThreshold),
    [inventory]
  );

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-[#EFE9DF] rounded-2xl p-5 border border-[#E2D9C8] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#4A6B53]">
            O2 Owner Analytics &amp; Audit
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C362B]">
            Executive Progress &amp; Inventory Dashboard
          </h1>
          <p className="text-xs text-[#6A7868] mt-0.5">
            Real-time revenue tracking, Kota evening rush analytics, counter collections, and BOM stock levels
          </p>
        </div>

        <div className="flex bg-[#FCFBF9] p-1 rounded-full border border-[#DCD2C0]">
          {(["Today", "This Week"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                timeframe === tf ? "bg-[#4A6B53] text-white" : "text-[#2C362B]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <span className="text-xs font-medium text-[#6A7868]">Gross Daily Revenue</span>
          <p className="font-serif text-2xl font-bold text-[#2C362B] mt-1">
            ₹{(timeframe === "This Week" ? totalRevenue * 6.4 : totalRevenue).toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-semibold text-[#4A6B53] mt-1 inline-block">
            Collected: ₹{collectedRevenue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <span className="text-xs font-medium text-[#6A7868]">Pending at Counter</span>
          <p className="font-serif text-2xl font-bold text-[#C86D51] mt-1">
            ₹{pendingCounterTotal.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-semibold text-[#6A7868] mt-1 inline-block">
            {orders.filter((o) => o.paymentStatus === "Pending at Counter").length} open table bills
          </span>
        </div>

        <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <span className="text-xs font-medium text-[#6A7868]">Active Floor Occupancy</span>
          <p className="font-serif text-2xl font-bold text-[#2C362B] mt-1">
            {tables.filter((t) => t.status !== "Vacant").length} / {tables.length} Tables
          </p>
          <span className="text-[11px] font-semibold text-[#4A6B53] mt-1 inline-block">
            Peak Rush: 6 PM – 9 PM
          </span>
        </div>

        <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <span className="text-xs font-medium text-[#6A7868]">Low-Stock Ingredients</span>
          <p className="font-serif text-2xl font-bold text-[#C86D51] mt-1">
            {lowStockItems.length} Alerts
          </p>
          <span className="text-[11px] font-semibold text-[#6A7868] mt-1 inline-block">
            Recipe BOM auto-deduction active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C362B]">
                Peak-Hour Orders &amp; Revenue (10 AM – 10 PM)
              </h2>
              <p className="text-xs text-[#6A7868]">
                Hover over any bar to inspect exact hourly order volume and ₹ revenue
              </p>
            </div>
          </div>

          <div className="h-56 flex items-end gap-2 pt-8 pb-2 px-1 border-b border-[#EFE9DF]">
            {hourlyMetrics.map((slot) => {
              const mult = timeframe === "This Week" ? 6.4 : 1;
              const dispOrders = Math.round(slot.orders * mult);
              const dispRev = Math.round(slot.revenue * mult);
              const maxOrders = timeframe === "This Week" ? 320 : 52;
              const pct = Math.min(100, Math.round((dispOrders / maxOrders) * 100));
              const isRush = slot.hour === "6 PM" || slot.hour === "7 PM" || slot.hour === "8 PM";

              return (
                <div
                  key={slot.hour}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 bg-[#2C362B] text-white text-[10px] px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none z-10 shadow-md">
                    {dispOrders} orders • ₹{dispRev.toLocaleString("en-IN")}
                  </div>
                  <div
                    style={{ height: `${pct}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      isRush ? "bg-[#C86D51]" : "bg-[#4A6B53]"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between gap-2 pt-2 px-1">
            {hourlyMetrics.map((slot) => (
              <span
                key={slot.hour}
                className="flex-1 text-center text-[10px] font-medium text-[#6A7868]"
              >
                {slot.hour.replace(" ", "")}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2C362B]">
              Category Gross Margins
            </h2>
            <p className="text-xs text-[#6A7868]">Profitability breakdown across menu</p>

            <div className="my-5 flex justify-center">
              <div
                className="w-36 h-36 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "conic-gradient(#4A6B53 0% 44%, #C86D51 44% 72%, #8BA88E 72% 90%, #D9B382 90% 100%)",
                }}
              >
                <div className="w-22 h-22 rounded-full bg-[#FCFBF9] flex flex-col items-center justify-center">
                  <span className="text-[10px] text-[#6A7868]">Net Margin</span>
                  <span className="font-serif font-bold text-lg text-[#2C362B]">71.4%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B53]" /> Signature Brews
              </span>
              <span className="font-bold">76% margin</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C86D51]" /> All-Day Eatery
              </span>
              <span className="font-bold">65% margin</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8BA88E]" /> Study Fuel
              </span>
              <span className="font-bold">72% margin</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9B382]" /> Boho Bakes
              </span>
              <span className="font-bold">69% margin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#2C362B] mb-1">
            Live Order &amp; Payment Ledger
          </h2>
          <p className="text-xs text-[#6A7868] mb-4">
            Every table order, payment mode, and manager settlement tracked in real time
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EFE9DF] text-[11px] uppercase text-[#6A7868]">
                  <th className="py-2.5 px-2">Order ID</th>
                  <th className="py-2.5 px-2">Table / Guest</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 px-2">Payment Mode</th>
                  <th className="py-2.5 px-2">Payment Status</th>
                  <th className="py-2.5 px-2">Kitchen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DF]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F7F4EF]/60">
                    <td className="py-3 px-2 font-bold text-[#2C362B]">{ord.id}</td>
                    <td className="py-3 px-2">
                      <span className="font-semibold">{ord.tableNumber}</span> • {ord.customerName}
                    </td>
                    <td className="py-3 px-2 font-bold">₹{ord.totalAmount}</td>
                    <td className="py-3 px-2 text-[#6A7868]">{ord.paymentMethod}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === "Paid"
                            ? "bg-[#4A6B53]/15 text-[#4A6B53]"
                            : "bg-[#C86D51]/15 text-[#C86D51]"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-semibold text-[#2C362B]">{ord.kitchenStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#2C362B] mb-1">
            Live Cafe Activity Feed
          </h2>
          <p className="text-xs text-[#6A7868] mb-4">Audit trail across guests &amp; staff</p>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#F7F4EF] border border-[#E5DDD0] text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-[#6A7868] mb-1">
                  <span className="font-bold text-[#4A6B53]">{log.role}</span>
                  <span>{log.time}</span>
                </div>
                <p className="text-[#2C362B] font-medium leading-snug">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#FCFBF9] p-5 rounded-2xl border border-[#EFE9DF] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2C362B]">
              Raw Ingredient Inventory (Recipe BOM Auto-Deduction)
            </h2>
            <p className="text-xs text-[#6A7868]">
              Stock automatically deducts whenever guests place orders
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EFE9DF] text-[11px] uppercase text-[#6A7868]">
                <th className="py-2.5 px-3">Ingredient</th>
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-3">Remaining Stock</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3 text-right">Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DF]">
              {inventory.map((item) => {
                const pct = Math.round((item.currentStock / item.maxCapacity) * 100);
                const isLow = item.currentStock <= item.lowThreshold;

                return (
                  <tr key={item.id} className="hover:bg-[#F7F4EF]/60">
                    <td className="py-3 px-3 font-semibold text-[#2C362B]">{item.name}</td>
                    <td className="py-3 px-3 text-[#6A7868]">{item.supplier}</td>
                    <td className="py-3 px-3 font-bold">
                      {item.currentStock.toLocaleString("en-IN")} {item.unit}
                    </td>
                    <td className="py-3 px-3 w-44">
                      <div className="w-full h-2 bg-[#EFE9DF] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${
                            isLow ? "bg-[#C86D51]" : "bg-[#4A6B53]"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onRestockIngredient(item.id)}
                        className="px-3 py-1 rounded-full bg-[#EFE9DF] hover:bg-[#4A6B53] hover:text-white text-[#2C362B] font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        + Refill Max
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
