import React, { useState } from "react";
import { CafeTable, OrderRecord, TableStatus } from "../types/cafe";

interface ManagerDashboardPageProps {
  tables: CafeTable[];
  orders: OrderRecord[];
  onSettleCounterPayment: (orderId: string) => void;
  onUpdateKitchenStatus: (orderId: string, status: "Ready" | "Served") => void;
  onUpdateTableStatus: (tableId: string, status: TableStatus) => void;
  onAssignWalkInTable: (tableId: string, guestName: string) => void;
}

export const ManagerDashboardPage: React.FC<ManagerDashboardPageProps> = ({
  tables,
  orders,
  onSettleCounterPayment,
  onUpdateKitchenStatus,
  onUpdateTableStatus,
  onAssignWalkInTable,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || "t-1");
  const [walkInGuest, setWalkInGuest] = useState<string>("");
  const [zoneFilter, setZoneFilter] = useState<string>("All");

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const pendingCounterOrders = orders.filter((o) => o.paymentStatus === "Pending at Counter");
  const activeKitchenOrders = orders.filter((o) => o.kitchenStatus !== "Served");

  const filteredTables =
    zoneFilter === "All" ? tables : tables.filter((t) => t.zone === zoneFilter);

  const tableSpecificOrders = orders.filter(
    (o) => o.tableNumber === selectedTable.number
  );

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-[#EFE9DF] rounded-2xl p-5 border border-[#E2D9C8] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#4A6B53]">
            Floor &amp; Counter Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C362B]">
            Cafe Manager Command Desk
          </h1>
          <p className="text-xs text-[#6A7868] mt-0.5">
            Manage table seating, settle "Pay at Counter" bills, and dispatch Bar &amp; Kitchen tickets
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#FCFBF9] px-4 py-2.5 rounded-xl border border-[#DCD2C0] text-center">
            <span className="text-[10px] uppercase font-bold text-[#C86D51] block">
              Counter Bills Due
            </span>
            <span className="font-serif text-xl font-bold text-[#2C362B]">
              {pendingCounterOrders.length}
            </span>
          </div>
          <div className="bg-[#FCFBF9] px-4 py-2.5 rounded-xl border border-[#DCD2C0] text-center">
            <span className="text-[10px] uppercase font-bold text-[#4A6B53] block">
              Active Kitchen Tickets
            </span>
            <span className="font-serif text-xl font-bold text-[#2C362B]">
              {activeKitchenOrders.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#FCFBF9] rounded-2xl p-5 border border-[#EFE9DF] shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C362B]">
                Live Floor Plan (12 Tables)
              </h2>
              <p className="text-xs text-[#6A7868]">
                Click a table to assign guests, collect counter payment, or clear table
              </p>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {["All", "Indoor Botanical", "Study Nook", "Outdoor Patio"].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoneFilter(z)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                    zoneFilter === z
                      ? "bg-[#4A6B53] text-white"
                      : "bg-[#EFE9DF] text-[#2C362B]"
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredTables.map((table) => {
              const isSelected = table.id === selectedTable.id;
              const badgeColor =
                table.status === "Vacant"
                  ? "bg-[#EFE9DF] text-[#6A7868]"
                  : table.status === "Counter Bill Pending"
                  ? "bg-[#C86D51] text-white"
                  : "bg-[#4A6B53] text-white";

              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-[#4A6B53] bg-[#F7F4EF] border-[#4A6B53]"
                      : "bg-[#FCFBF9] border-[#E5DDD0] hover:bg-[#F7F4EF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#2C362B]">
                      {table.number}
                    </span>
                    <span className="text-[10px] font-semibold text-[#6A7868]">
                      {table.seats}P
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6A7868] block mt-0.5">{table.zone}</span>

                  <span
                    className={`inline-block mt-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}
                  >
                    {table.status}
                  </span>

                  {table.guestName && (
                    <p className="text-[11px] font-semibold text-[#2C362B] mt-1.5 truncate">
                      {table.guestName}
                    </p>
                  )}
                  {table.pendingBill > 0 && (
                    <p className="text-xs font-bold text-[#C86D51] mt-0.5">
                      Due: ₹{table.pendingBill}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#FCFBF9] rounded-2xl p-5 border border-[#EFE9DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4A6B53]">
                  {selectedTable.zone}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C362B]">
                  Table {selectedTable.number} Controls
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EFE9DF] text-xs font-bold">
                {selectedTable.seats} Seats
              </span>
            </div>

            {selectedTable.status === "Vacant" ? (
              <div className="mt-4 bg-[#F7F4EF] p-4 rounded-xl border border-[#E2D9C8] space-y-3">
                <p className="text-xs font-bold text-[#2C362B]">Seat Walk-In Guests</p>
                <input
                  type="text"
                  value={walkInGuest}
                  onChange={(e) => setWalkInGuest(e.target.value)}
                  placeholder="Guest Name (e.g., Kartik & Chirag)"
                  className="w-full bg-[#FCFBF9] border border-[#DCD2C0] rounded-xl px-3 py-2 text-xs"
                />
                <button
                  onClick={() => {
                    onAssignWalkInTable(
                      selectedTable.id,
                      walkInGuest.trim() || "Walk-In Guest"
                    );
                    setWalkInGuest("");
                  }}
                  className="w-full py-2.5 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white text-xs font-semibold cursor-pointer"
                >
                  Check-In Guests to {selectedTable.number}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="bg-[#F7F4EF] p-3.5 rounded-xl border border-[#E5DDD0] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#6A7868]">Seated Guest:</span>
                    <span className="font-bold text-[#2C362B]">
                      {selectedTable.guestName || "QR Table Guest"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A7868]">Current Status:</span>
                    <span className="font-bold text-[#4A6B53]">{selectedTable.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A7868]">Pending Counter Bill:</span>
                    <span className="font-bold text-[#C86D51]">₹{selectedTable.pendingBill}</span>
                  </div>
                </div>

                {tableSpecificOrders.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#2C362B]">Orders on This Table</p>
                    {tableSpecificOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 rounded-xl bg-[#F7F4EF] border border-[#E5DDD0] text-xs space-y-2"
                      >
                        <div className="flex justify-between font-bold">
                          <span>{ord.id}</span>
                          <span>₹{ord.totalAmount}</span>
                        </div>
                        <p className="text-[11px] text-[#6A7868]">
                          {ord.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                        </p>
                        {ord.paymentStatus === "Pending at Counter" && (
                          <button
                            onClick={() => onSettleCounterPayment(ord.id)}
                            className="w-full py-2 rounded-lg bg-[#C86D51] hover:bg-[#b55c40] text-white font-semibold text-[11px] cursor-pointer"
                          >
                            Collect ₹{ord.totalAmount} at Counter ✓
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <p className="text-[11px] font-bold text-[#6A7868]">Change Table State</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onUpdateTableStatus(selectedTable.id, "Served")}
                      className="py-2 rounded-xl bg-[#EFE9DF] hover:bg-[#4A6B53] hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Mark Served
                    </button>
                    <button
                      onClick={() => onUpdateTableStatus(selectedTable.id, "Vacant")}
                      className="py-2 rounded-xl bg-[#EFE9DF] hover:bg-[#2C362B] hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Clear &amp; Free Table
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#FCFBF9] rounded-2xl p-5 border border-[#EFE9DF] shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#2C362B] mb-1">
            Pay at Counter — Pending Settlements
          </h2>
          <p className="text-xs text-[#6A7868] mb-4">
            Guests who chose "Pay at Counter" during checkout
          </p>

          {pendingCounterOrders.length === 0 ? (
            <div className="p-8 text-center bg-[#F7F4EF] rounded-2xl text-xs text-[#6A7868]">
              All counter bills have been settled!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCounterOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#E2D9C8] flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2C362B] text-white text-xs font-bold">
                        {ord.tableNumber}
                      </span>
                      <span className="font-bold text-sm text-[#2C362B]">
                        {ord.id} • {ord.customerName}
                      </span>
                    </div>
                    <p className="text-xs text-[#6A7868] mt-1">
                      {ord.items.map((i) => `${i.qty}× ${i.name}`).join(" • ")}
                    </p>
                  </div>

                  <button
                    onClick={() => onSettleCounterPayment(ord.id)}
                    className="px-4 py-2.5 rounded-full bg-[#C86D51] hover:bg-[#b55c40] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Settle ₹{ord.totalAmount} Paid ✓
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#FCFBF9] rounded-2xl p-5 border border-[#EFE9DF] shadow-xs">
          <h2 className="font-serif text-lg font-bold text-[#2C362B] mb-1">
            Live Kitchen &amp; Bar Dispatch
          </h2>
          <p className="text-xs text-[#6A7868] mb-4">
            Track order preparation and mark served to table
          </p>

          <div className="space-y-3">
            {activeKitchenOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#E2D9C8] flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#4A6B53] text-white text-xs font-bold">
                      {ord.tableNumber}
                    </span>
                    <span className="font-bold text-sm text-[#2C362B]">{ord.id}</span>
                    <span className="text-[11px] font-semibold text-[#C86D51]">
                      • {ord.kitchenStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#6A7868] mt-1">
                    {ord.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>
                </div>

                <div className="flex gap-2">
                  {ord.kitchenStatus === "Preparing" && (
                    <button
                      onClick={() => onUpdateKitchenStatus(ord.id, "Ready")}
                      className="px-3.5 py-2 rounded-full bg-[#4A6B53] text-white text-xs font-semibold cursor-pointer"
                    >
                      Mark Ready
                    </button>
                  )}
                  <button
                    onClick={() => onUpdateKitchenStatus(ord.id, "Served")}
                    className="px-3.5 py-2 rounded-full bg-[#EFE9DF] hover:bg-[#2C362B] hover:text-white text-[#2C362B] text-xs font-semibold cursor-pointer"
                  >
                    Mark Served ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
