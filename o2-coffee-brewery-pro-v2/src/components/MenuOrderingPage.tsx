import React, { useState, useMemo } from "react";
import {
  AuthSession,
  CafeTable,
  CartItem,
  InventoryItem,
  MenuItem,
  OrderRecord,
  PaymentMethod,
} from "../types/cafe";

interface MenuOrderingPageProps {
  session: AuthSession;
  tables: CafeTable[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  cart: CartItem[];
  orders: OrderRecord[];
  onChangeTable: (tableNumber: string) => void;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (cartId: string) => void;
  onPlaceOrder: (paymentMethod: PaymentMethod, whatsappReceipt: boolean) => OrderRecord | null;
}

export const MenuOrderingPage: React.FC<MenuOrderingPageProps> = ({
  session,
  tables,
  menuItems,
  inventory,
  cart,
  orders,
  onChangeTable,
  onAddToCart,
  onRemoveFromCart,
  onPlaceOrder,
}) => {
  const activeTable = session.tableNumber || "T-04";
  const guestName = session.name || "Guest";

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customMilk, setCustomMilk] = useState<"Regular" | "Oat (+₹40)" | "Almond (+₹45)">("Regular");
  const [customSugar, setCustomSugar] = useState<"Normal" | "Less Sugar" | "No Sugar">("Normal");
  const [customExtraShot, setCustomExtraShot] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Pay at Counter");
  const [whatsappReceipt, setWhatsappReceipt] = useState<boolean>(true);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<OrderRecord | null>(null);

  const isItemInStock = (item: MenuItem): boolean => {
    return item.recipe.every((req) => {
      const inv = inventory.find((i) => i.id === req.ingredientId);
      return inv ? inv.currentStock >= req.amount : true;
    });
  };

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const tableOrders = useMemo(
    () => orders.filter((o) => o.tableNumber === activeTable),
    [orders, activeTable]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0),
    [cart]
  );
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const openCustomizer = (item: MenuItem) => {
    if (!isItemInStock(item)) return;
    setCustomizingItem(item);
    setCustomMilk("Regular");
    setCustomSugar("Normal");
    setCustomExtraShot(false);
    setCustomNotes("");
  };

  const confirmAddToCart = () => {
    if (!customizingItem) return;
    let unitPrice = customizingItem.price;
    if (customMilk === "Oat (+₹40)") unitPrice += 40;
    if (customMilk === "Almond (+₹45)") unitPrice += 45;
    if (customExtraShot) unitPrice += 50;

    onAddToCart({
      cartId: `cart-${Date.now()}`,
      menuItem: customizingItem,
      quantity: 1,
      milk: customMilk,
      sugar: customSugar,
      extraShot: customExtraShot,
      notes: customNotes.trim(),
      addedBy: guestName,
      unitPrice,
    });
    setCustomizingItem(null);
  };

  const submitOrder = () => {
    const created = onPlaceOrder(paymentMethod, whatsappReceipt);
    if (created) {
      setLatestPlacedOrder(created);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
      <div className="bg-[#EFE9DF] rounded-2xl p-4 sm:p-5 border border-[#E2D9C8] mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#4A6B53] text-white text-xs font-semibold">
              Table {activeTable}
            </span>
            <span className="text-xs font-semibold text-[#6A7868]">
              Guest: <strong className="text-[#2C362B]">{guestName}</strong>
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2C362B] mt-2">
            Botanical Brewery &amp; All-Day Menu
          </h1>
        </div>

        <div className="flex items-center gap-2.5 bg-[#FCFBF9] px-3.5 py-2 rounded-xl border border-[#DCD2C0]">
          <span className="text-xs font-semibold text-[#6A7868]">Switch Table:</span>
          <select
            value={activeTable}
            onChange={(e) => onChangeTable(e.target.value)}
            className="text-xs font-bold text-[#2C362B] bg-transparent focus:outline-none cursor-pointer"
          >
            {tables.map((t) => (
              <option key={t.id} value={t.number}>
                {t.number} ({t.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {(latestPlacedOrder || tableOrders.length > 0) && (
        <div className="mb-6 bg-[#FCFBF9] rounded-2xl p-4 border border-[#4A6B53]/30 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#4A6B53]">
                Active Orders for {activeTable}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2C362B]">
                {tableOrders[0]?.id} • {tableOrders[0]?.kitchenStatus}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tableOrders[0]?.paymentStatus === "Paid"
                    ? "bg-[#4A6B53]/15 text-[#4A6B53]"
                    : "bg-[#C86D51]/15 text-[#C86D51]"
                }`}
              >
                {tableOrders[0]?.paymentStatus === "Paid"
                  ? `Paid (₹${tableOrders[0]?.totalAmount})`
                  : `Pay at Counter: ₹${tableOrders[0]?.totalAmount} Pending`}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {["All", "Signature Brews", "Study Fuel", "Boho Bakes", "All-Day Eatery"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#4A6B53] text-white shadow-xs"
                        : "bg-[#EFE9DF] text-[#2C362B] hover:bg-[#E4DCCE]"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <input
              type="text"
              placeholder="Search brews, sourdough..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FCFBF9] border border-[#DCD2C0] rounded-full px-4 py-2 text-xs text-[#2C362B] placeholder-[#6A7868] focus:outline-none focus:border-[#4A6B53] sm:w-56"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map((item) => {
              const available = isItemInStock(item);
              return (
                <div
                  key={item.id}
                  className={`bg-[#FCFBF9] rounded-2xl p-3.5 border border-[#EFE9DF] shadow-[0_6px_20px_rgba(44,54,43,0.04)] flex gap-3.5 ${
                    !available ? "opacity-60" : ""
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 bg-[#EFE9DF]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border border-[#4A6B53] flex items-center justify-center rounded-[3px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B53]" />
                        </span>
                        <span className="text-[10px] font-medium text-[#6A7868]">
                          ~{item.prepTime} mins • {item.station}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm text-[#2C362B] mt-1 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[#6A7868] line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-bold text-sm text-[#2C362B]">₹{item.price}</span>
                      {available ? (
                        <button
                          onClick={() => openCustomizer(item)}
                          className="px-3.5 py-1.5 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          + Add to Cart
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#C86D51]/15 text-[#C86D51] text-[11px] font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-20 bg-[#FCFBF9] rounded-2xl p-5 border border-[#EFE9DF] shadow-[0_8px_28px_rgba(44,54,43,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C362B]">
                {activeTable} Order Cart
              </h2>
              <p className="text-[11px] text-[#6A7868]">
                Review items &amp; choose payment mode
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#2C362B] text-xs font-bold">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-serif text-base font-semibold text-[#2C362B]">
                Your table cart is empty
              </p>
              <p className="text-xs text-[#6A7868] mt-1">
                Select brews or plates from the menu to start your order.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#EFE9DF] max-h-64 overflow-y-auto my-2 pr-1">
                {cart.map((entry) => (
                  <div key={entry.cartId} className="py-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-[#2C362B]">
                        {entry.quantity}× {entry.menuItem.name}
                      </p>
                      <p className="text-[10px] text-[#6A7868] mt-0.5">
                        {entry.milk} • {entry.sugar}
                        {entry.extraShot ? " • Extra Shot" : ""}
                      </p>
                      {entry.notes && (
                        <p className="text-[10px] italic text-[#C86D51] mt-0.5">
                          Note: "{entry.notes}"
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold block">
                        ₹{entry.unitPrice * entry.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(entry.cartId)}
                        className="text-[10px] font-semibold text-[#C86D51] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[#EFE9DF]">
                <label className="block text-xs font-bold text-[#2C362B] mb-2">
                  Select Payment Option
                </label>
                <div className="space-y-2">
                  {(
                    [
                      {
                        id: "Pay at Counter",
                        title: "Pay at Counter (Cash / Card / QR at Desk)",
                        desc: "Order goes straight to kitchen; pay manager before leaving",
                      },
                      {
                        id: "Instant UPI",
                        title: "Pay Now via Instant UPI",
                        desc: "Zero-wait digital settlement",
                      },
                      {
                        id: "Split UPI",
                        title: "Split Bill via UPI",
                        desc: "Divide equally with your table group",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        paymentMethod === opt.id
                          ? "bg-[#4A6B53]/10 border-[#4A6B53]"
                          : "bg-[#F7F4EF] border-[#E5DDD0] hover:border-[#DCD2C0]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2C362B]">{opt.title}</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentMethod === opt.id ? "border-[#4A6B53]" : "border-[#6A7868]"
                          }`}
                        >
                          {paymentMethod === opt.id && (
                            <span className="w-2 h-2 rounded-full bg-[#4A6B53]" />
                          )}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6A7868] mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between bg-[#F7F4EF] px-3 py-2 rounded-xl border border-[#E5DDD0]">
                <span className="text-[11px] font-medium text-[#2C362B]">
                  Send digital bill on WhatsApp
                </span>
                <input
                  type="checkbox"
                  checked={whatsappReceipt}
                  onChange={(e) => setWhatsappReceipt(e.target.checked)}
                  className="w-4 h-4 accent-[#4A6B53] cursor-pointer"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-[#EFE9DF] text-xs space-y-1 text-[#6A7868]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2C362B] pt-1">
                  <span>Total Payable</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={submitOrder}
                className="w-full mt-4 py-3.5 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                {paymentMethod === "Pay at Counter"
                  ? `Confirm Order • Pay ₹${grandTotal} at Counter`
                  : `Pay ₹${grandTotal} & Send to Kitchen`}
              </button>
            </>
          )}
        </aside>
      </div>

      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-[#2C362B]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FCFBF9] rounded-[24px] p-6 border border-[#EFE9DF] shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#C86D51]">
                  Customize Dish / Brew
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C362B]">
                  {customizingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="w-8 h-8 rounded-full bg-[#EFE9DF] text-[#2C362B] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {customizingItem.station === "Coffee Bar" && (
              <>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#2C362B] mb-2">Milk Choice</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Regular", "Oat (+₹40)", "Almond (+₹45)"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setCustomMilk(m)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                          customMilk === m
                            ? "bg-[#4A6B53] text-white border-[#4A6B53]"
                            : "bg-[#F7F4EF] text-[#2C362B] border-[#E2D9C8]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#2C362B] mb-2">Sweetness</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Normal", "Less Sugar", "No Sugar"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCustomSugar(s)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                          customSugar === s
                            ? "bg-[#4A6B53] text-white border-[#4A6B53]"
                            : "bg-[#F7F4EF] text-[#2C362B] border-[#E2D9C8]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between bg-[#F7F4EF] p-3 rounded-xl border border-[#E2D9C8]">
                  <div>
                    <p className="text-xs font-semibold text-[#2C362B]">Extra Arabica Shot</p>
                    <p className="text-[10px] text-[#6A7868]">+18g fresh espresso (+₹50)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={customExtraShot}
                    onChange={(e) => setCustomExtraShot(e.target.checked)}
                    className="w-4 h-4 accent-[#4A6B53] cursor-pointer"
                  />
                </div>
              </>
            )}

            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#2C362B] mb-1">
                Kitchen / Barista Note (Optional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g., Extra hot, less ice, serve together..."
                className="w-full bg-[#F7F4EF] border border-[#DCD2C0] rounded-xl px-3.5 py-2 text-xs text-[#2C362B]"
              />
            </div>

            <button
              onClick={confirmAddToCart}
              className="w-full mt-5 py-3 rounded-full bg-[#4A6B53] hover:bg-[#3A5541] text-white font-semibold text-sm shadow-md cursor-pointer"
            >
              Add to {activeTable} Cart • ₹
              {customizingItem.price +
                (customMilk === "Oat (+₹40)" ? 40 : customMilk === "Almond (+₹45)" ? 45 : 0) +
                (customExtraShot ? 50 : 0)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
