import React, { useState } from "react";
import { AuthSession, CafeTable } from "../types/cafe";

interface LoginPageProps {
  tables: CafeTable[];
  onLoginSuccess: (session: AuthSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ tables, onLoginSuccess }) => {
  const [selectedTab, setSelectedTab] = useState<"guest" | "manager" | "admin">("guest");

  const [guestName, setGuestName] = useState<string>("Agrim");
  const [tableNumber, setTableNumber] = useState<string>("T-04");

  const [email, setEmail] = useState<string>("manager@o2kota.in");
  const [password, setPassword] = useState<string>("o2manager");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleTabSwitch = (tab: "guest" | "manager" | "admin") => {
    setSelectedTab(tab);
    setErrorMsg("");
    if (tab === "manager") {
      setEmail("manager@o2kota.in");
      setPassword("o2manager");
    } else if (tab === "admin") {
      setEmail("admin@o2kota.in");
      setPassword("o2admin");
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      role: "guest",
      name: guestName.trim() || "Table Guest",
      tableNumber,
    });
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTab === "manager") {
      if (email.trim().toLowerCase() === "manager@o2kota.in" && password === "o2manager") {
        onLoginSuccess({
          role: "manager",
          name: "Rohan Sharma (Floor Manager)",
          email: email.trim(),
        });
      } else {
        setErrorMsg("Invalid Manager credentials. Use manager@o2kota.in / o2manager");
      }
    } else if (selectedTab === "admin") {
      if (email.trim().toLowerCase() === "admin@o2kota.in" && password === "o2admin") {
        onLoginSuccess({
          role: "admin",
          name: "O2 Cafe Owner",
          email: email.trim(),
        });
      } else {
        setErrorMsg("Invalid Admin credentials. Use admin@o2kota.in / o2admin");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#FCFBF9] rounded-[24px] border border-[#EFE9DF] shadow-[0_12px_40px_rgba(44,54,43,0.08)] overflow-hidden">
        <div className="bg-[#EFE9DF] px-6 py-6 text-center border-b border-[#E2D9C8]">
          <div className="w-12 h-12 rounded-full bg-[#4A6B53] text-[#FCFBF9] flex items-center justify-center font-serif font-bold text-xl mx-auto shadow-sm">
            O₂
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2C362B] mt-3">
            Welcome to O2 Portal
          </h1>
          <p className="text-xs text-[#6A7868] mt-1">
            Sign in to order at your table, manage floor service, or view cafe analytics
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 bg-[#EFE9DF] p-1 rounded-full border border-[#E2D9C8] mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch("guest")}
              className={`py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTab === "guest"
                  ? "bg-[#4A6B53] text-white shadow-xs"
                  : "text-[#2C362B] hover:text-[#4A6B53]"
              }`}
            >
              Table Guest
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("manager")}
              className={`py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTab === "manager"
                  ? "bg-[#4A6B53] text-white shadow-xs"
                  : "text-[#2C362B] hover:text-[#4A6B53]"
              }`}
            >
              Cafe Manager
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("admin")}
              className={`py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTab === "admin"
                  ? "bg-[#4A6B53] text-white shadow-xs"
                  : "text-[#2C362B] hover:text-[#4A6B53]"
              }`}
            >
              Owner / Admin
            </button>
          </div>

          {selectedTab === "guest" ? (
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C362B] mb-1.5">
                  Your Name (For Group Cart &amp; Counter Receipt)
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#F7F4EF] border border-[#DCD2C0] rounded-xl px-4 py-2.5 text-sm text-[#2C362B] focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C362B] mb-1.5">
                  Select Your Table Number
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#DCD2C0] rounded-xl px-4 py-2.5 text-sm text-[#2C362B] focus:outline-none focus:border-[#4A6B53] cursor-pointer"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.number}>
                      {t.number} — {t.zone} ({t.seats} Seats) • [{t.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#F7F4EF] p-3.5 rounded-xl border border-[#E5DDD0] text-xs text-[#6A7868]">
                No password needed for table guests. You can pay directly via{" "}
                <strong className="text-[#2C362B]">Pay at Counter</strong> or{" "}
                <strong className="text-[#4A6B53]">UPI</strong> after adding items.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                Enter Table {tableNumber} Menu →
              </button>
            </form>
          ) : (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C362B] mb-1.5">
                  {selectedTab === "manager" ? "Manager Email" : "Owner / Admin Email"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#DCD2C0] rounded-xl px-4 py-2.5 text-sm text-[#2C362B] focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C362B] mb-1.5">
                  Access PIN / Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#DCD2C0] rounded-xl px-4 py-2.5 text-sm text-[#2C362B] focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-[#C86D51] bg-[#C86D51]/10 p-2.5 rounded-xl">
                  {errorMsg}
                </p>
              )}

              <div className="bg-[#F7F4EF] p-3 rounded-xl border border-[#E5DDD0] text-[11px] text-[#6A7868]">
                Demo credentials pre-filled for{" "}
                <strong className="text-[#2C362B]">
                  {selectedTab === "manager" ? "Cafe Floor Manager" : "Cafe Owner / Admin"}
                </strong>
                . Click below to sign in.
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                {selectedTab === "manager"
                  ? "Open Cafe Manager Desk →"
                  : "Open Owner Admin Dashboard →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
