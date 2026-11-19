import React from "react";
import { AuthSession, PageRoute } from "../types/cafe";

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  session: AuthSession;
  onLogout: () => void;
  cartCount: number;
  pendingCounterCount: number;
  preparingTicketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  session,
  onLogout,
  cartCount,
  pendingCounterCount,
  preparingTicketsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-[#EFE9DF] px-4 sm:px-6 py-3 shadow-[0_4px_24px_rgba(44,54,43,0.04)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo -> Returns to Welcome Page */}
        <button
          onClick={() => onNavigate("welcome")}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#4A6B53] text-[#FCFBF9] flex items-center justify-center font-serif font-bold text-lg shadow-sm group-hover:bg-[#3A5541] transition-colors">
            O₂
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-tight text-[#2C362B]">
                O2 Coffee Brewery & Eatery
              </span>
            </div>
            <p className="text-[11px] text-[#6A7868]">
              A-1331, R.K. Puram • Near Chawla Circle, Kota
            </p>
          </div>
        </button>

        {/* Primary Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => onNavigate("welcome")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentPage === "welcome"
                ? "bg-[#4A6B53] text-[#FCFBF9] shadow-xs"
                : "text-[#2C362B] hover:bg-[#EFE9DF]"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate("menu")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentPage === "menu"
                ? "bg-[#4A6B53] text-[#FCFBF9] shadow-xs"
                : "text-[#2C362B] hover:bg-[#EFE9DF]"
            }`}
          >
            <span>Menu & Order</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C86D51] text-white font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Manager Portal Link */}
          {(session.role === "manager" || session.role === "admin") && (
            <button
              onClick={() => onNavigate("manager")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentPage === "manager"
                  ? "bg-[#4A6B53] text-[#FCFBF9] shadow-xs"
                  : "bg-[#EFE9DF] text-[#2C362B] hover:bg-[#E4DCCE]"
              }`}
            >
              <span>Manager Desk</span>
              {(pendingCounterCount > 0 || preparingTicketsCount > 0) && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C86D51] text-white font-bold">
                  {pendingCounterCount + preparingTicketsCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Portal Link */}
          {session.role === "admin" && (
            <button
              onClick={() => onNavigate("admin")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentPage === "admin"
                  ? "bg-[#4A6B53] text-[#FCFBF9] shadow-xs"
                  : "bg-[#EFE9DF] text-[#2C362B] hover:bg-[#E4DCCE]"
              }`}
            >
              Admin Analytics
            </button>
          )}

          {/* Session / Login Status Pill */}
          {session.role ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E2D9C8]">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-bold text-[#2C362B] block leading-none">
                  {session.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4A6B53]">
                  {session.role === "guest"
                    ? `Table ${session.tableNumber}`
                    : session.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-full bg-[#EFE9DF] hover:bg-[#C86D51] hover:text-white text-[#2C362B] text-xs font-semibold transition-colors cursor-pointer"
              >
                Switch / Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentPage === "login"
                  ? "bg-[#C86D51] text-white"
                  : "bg-[#EFE9DF] hover:bg-[#4A6B53] hover:text-white text-[#2C362B]"
              }`}
            >
              Table / Staff Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
