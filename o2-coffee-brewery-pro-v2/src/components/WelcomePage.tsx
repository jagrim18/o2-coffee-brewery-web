import React from "react";
import { CafeTable, MenuItem, PageRoute } from "../types/cafe";

interface WelcomePageProps {
  tables: CafeTable[];
  featuredItems: MenuItem[];
  onStartTableOrder: (tableNumber: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  tables,
  featuredItems,
  onStartTableOrder,
  onNavigate,
}) => {
  const vacantTables = tables.filter((t) => t.status === "Vacant");

  return (
    <div className="flex-1">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#EFE9DF] bg-[#F7F4EF] py-12 sm:py-20 px-4 sm:px-6">
        <svg
          className="absolute right-0 top-0 w-96 h-96 text-[#4A6B53]/[0.06] pointer-events-none"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 10C45 45 25 110 100 190C175 110 155 45 100 10ZM100 38C126 68 132 110 100 162C68 110 74 68 100 38Z" />
        </svg>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] border border-[#E2D9C8] text-xs font-semibold text-[#4A6B53]">
              <span className="w-2 h-2 rounded-full bg-[#4A6B53] animate-pulse" />
              Open Daily • 10:00 AM – 11:00 PM • A-1331, R.K. Puram, Kota
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C362B] leading-[1.12]">
              Slow-Brewed Coffee &amp; Botanical Calm in the Heart of Kota.
            </h1>

            <p className="text-base sm:text-lg text-[#6A7868] max-w-2xl leading-relaxed">
              Welcome to <strong className="text-[#2C362B]">O2 Coffee Brewery &amp; Eatery</strong>.
              Settle into our indoor greenery or breezy boho patio, scan your table QR to order
              freshly roasted specialty brews and artisanal sourdough, and choose{" "}
              <strong className="text-[#4A6B53]">Instant UPI</strong> or{" "}
              <strong className="text-[#C86D51]">Pay at Counter</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate("login")}
                className="px-6 py-3.5 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-[#FCFBF9] font-semibold text-sm shadow-[0_8px_24px_rgba(74,107,83,0.28)] transition-all cursor-pointer"
              >
                Start Table Order →
              </button>
              <button
                onClick={() => onNavigate("menu")}
                className="px-6 py-3.5 rounded-full bg-[#EFE9DF] hover:bg-[#E4DCCE] text-[#2C362B] font-semibold text-sm border border-[#DCD2C0] transition-all cursor-pointer"
              >
                Explore Full Menu
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="px-5 py-3.5 rounded-full text-xs font-semibold text-[#6A7868] hover:text-[#2C362B] underline underline-offset-4 cursor-pointer"
              >
                Manager / Owner Portal
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EFE9DF] max-w-lg">
              <div>
                <span className="font-serif text-2xl font-bold text-[#2C362B] block">
                  {vacantTables.length} / {tables.length}
                </span>
                <span className="text-xs text-[#6A7868]">Tables Available Now</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#4A6B53] block">100%</span>
                <span className="text-xs text-[#6A7868]">Single-Origin Arabica</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#C86D51] block">~8 min</span>
                <span className="text-xs text-[#6A7868]">Avg. Brew &amp; Plate Time</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#FCFBF9] rounded-[24px] p-6 border border-[#EFE9DF] shadow-[0_12px_36px_rgba(44,54,43,0.07)] space-y-5">
              <div className="relative rounded-2xl overflow-hidden h-52 bg-[#EFE9DF]">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
                  alt="O2 Coffee Brewery & Eatery Interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C362B]/75 via-transparent to-transparent flex items-end p-4">
                  <div className="text-[#FCFBF9]">
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#4A6B53] px-2.5 py-0.5 rounded-full">
                      Near Chawla Circle, Kota
                    </span>
                    <p className="font-serif text-lg font-bold mt-1">
                      Three Distinct Boho Seating Zones
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-serif text-base font-bold text-[#2C362B]">
                    Quick-Select Your Table QR
                  </h3>
                  <span className="text-[11px] font-medium text-[#4A6B53]">
                    Instant Digital Menu
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {tables.slice(0, 8).map((tbl) => (
                    <button
                      key={tbl.id}
                      onClick={() => onStartTableOrder(tbl.number)}
                      className="py-2 px-2 rounded-xl bg-[#F7F4EF] hover:bg-[#4A6B53] hover:text-white border border-[#E2D9C8] text-center transition-all cursor-pointer group"
                    >
                      <span className="font-serif font-bold text-xs block">{tbl.number}</span>
                      <span className="text-[9px] text-[#6A7868] group-hover:text-[#D8E6DC] block truncate">
                        {tbl.zone.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE CRAFT PREVIEW */}
      <section className="max-w-7xl mx-auto py-14 px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#C86D51]">
              House Favorites
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C362B] mt-1">
              Crafted Fresh at O2 Brewery
            </h2>
          </div>
          <button
            onClick={() => onNavigate("menu")}
            className="px-5 py-2.5 rounded-full bg-[#EFE9DF] hover:bg-[#4A6B53] hover:text-white text-xs font-semibold text-[#2C362B] transition-colors cursor-pointer"
          >
            View All 8 Menu Items →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#FCFBF9] rounded-2xl border border-[#EFE9DF] overflow-hidden shadow-[0_8px_24px_rgba(44,54,43,0.05)] flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden bg-[#EFE9DF]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#4A6B53] mb-1">
                    <span>{item.category}</span>
                    <span>~{item.prepTime} mins</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2C362B]">{item.name}</h3>
                  <p className="text-xs text-[#6A7868] mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between">
                <span className="font-bold text-base text-[#2C362B]">₹{item.price}</span>
                <button
                  onClick={() => onNavigate("menu")}
                  className="px-4 py-2 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white text-xs font-semibold cursor-pointer"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLE ACCESS FOOTER BANNER */}
      <section className="bg-[#EFE9DF] border-t border-[#E2D9C8] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2C362B]">
              O2 Coffee Brewery &amp; Eatery — Integrated Cafe Operations
            </h3>
            <p className="text-xs text-[#6A7868] mt-1">
              A-1331, R.K. Puram (near Chawla Circle), Kota, Rajasthan • Seamless Guest Ordering,
              Counter Billing &amp; Owner Analytics
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("login")}
              className="px-5 py-2.5 rounded-full bg-[#FCFBF9] hover:bg-[#4A6B53] hover:text-white text-[#2C362B] text-xs font-semibold border border-[#DCD2C0] transition-colors cursor-pointer"
            >
              Cafe Manager Login
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="px-5 py-2.5 rounded-full bg-[#2C362B] hover:bg-[#4A6B53] text-[#FCFBF9] text-xs font-semibold transition-colors cursor-pointer"
            >
              Owner / Admin Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
