import React, { useState, useMemo } from "react";
import {
  ActivityLog,
  AuthSession,
  CafeTable,
  CartItem,
  HourlyMetric,
  InventoryItem,
  OrderRecord,
  PageRoute,
  PaymentMethod,
  TableStatus,
} from "./types/cafe";
import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_HOURLY_METRICS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  MENU_ITEMS,
} from "./data/seedData";
import { Navbar } from "./components/Navbar";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./components/LoginPage";
import { MenuOrderingPage } from "./components/MenuOrderingPage";
import { ManagerDashboardPage } from "./components/ManagerDashboardPage";
import { AdminDashboardPage } from "./components/AdminDashboardPage";

export function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>("welcome");
  const [session, setSession] = useState<AuthSession>({
    role: null,
    name: "Guest",
    tableNumber: "T-04",
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [tables, setTables] = useState<CafeTable[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [hourlyMetrics, setHourlyMetrics] = useState<HourlyMetric[]>(INITIAL_HOURLY_METRICS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const logActivity = (actor: string, role: string, action: string) => {
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setActivityLogs((prev) => [
      { id: `log-${Date.now()}`, time: now, actor, role, action },
      ...prev,
    ]);
  };

  const handleStartTableOrder = (tableNumber: string) => {
    setSession({
      role: "guest",
      name: session.role === "guest" && session.name ? session.name : "Table Guest",
      tableNumber,
    });
    setCurrentPage("menu");
    showToast(`Connected to ${tableNumber} digital menu`);
  };

  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    if (newSession.role === "guest") {
      setCurrentPage("menu");
      showToast(`Welcome ${newSession.name}! Ordering for ${newSession.tableNumber}`);
    } else if (newSession.role === "manager") {
      setCurrentPage("manager");
      showToast(`Signed in as ${newSession.name}`);
    } else if (newSession.role === "admin") {
      setCurrentPage("admin");
      showToast(`Signed in to Owner Admin Suite`);
    }
  };

  const handleLogout = () => {
    setSession({ role: null, name: "Guest", tableNumber: "T-04" });
    setCurrentPage("login");
  };

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    showToast(`Added ${item.menuItem.name} to cart`);
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  };

  const handlePlaceOrder = (
    paymentMethod: PaymentMethod,
    whatsappReceipt: boolean
  ): OrderRecord | null => {
    if (cart.length === 0) return null;

    const activeTable = session.tableNumber || "T-04";
    const customerName = session.name || "Table Guest";
    const subtotal = cart.reduce((sum, c) => sum + c.unitPrice * c.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + gst;
    const isCounterPay = paymentMethod === "Pay at Counter";

    const newOrder: OrderRecord = {
      id: `ORD-${1043 + orders.length}`,
      tableNumber: activeTable,
      customerName,
      items: cart.map((c) => {
        const mods: string[] = [];
        if (c.milk !== "Regular") mods.push(c.milk.split(" ")[0] + " Milk");
        if (c.sugar !== "Normal") mods.push(c.sugar);
        if (c.extraShot) mods.push("Extra Shot");
        if (c.notes) mods.push(c.notes);
        return {
          name: c.menuItem.name,
          qty: c.quantity,
          station: c.menuItem.station,
          modifiers: mods,
          price: c.unitPrice * c.quantity,
        };
      }),
      subtotal,
      gst,
      totalAmount,
      kitchenStatus: "Preparing",
      paymentMethod,
      paymentStatus: isCounterPay ? "Pending at Counter" : "Paid",
      createdAtTime: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      minutesAgo: 0,
      timestampHour: "7 PM",
    };

    setOrders((prev) => [newOrder, ...prev]);

    setInventory((prevInv) =>
      prevInv.map((inv) => {
        let used = 0;
        cart.forEach((c) => {
          c.menuItem.recipe.forEach((rec) => {
            if (rec.ingredientId === inv.id) used += rec.amount * c.quantity;
          });
          if (inv.id === "ing-oatmilk" && c.milk.startsWith("Oat")) {
            used += 180 * c.quantity;
          }
        });
        return { ...inv, currentStock: Math.max(0, inv.currentStock - used) };
      })
    );

    setTables((prevTables) =>
      prevTables.map((t) =>
        t.number === activeTable
          ? {
              ...t,
              status: isCounterPay ? "Counter Bill Pending" : "Preparing",
              guestName: customerName,
              occupiedMinutes: t.occupiedMinutes || 1,
              pendingBill: isCounterPay ? t.pendingBill + totalAmount : t.pendingBill,
              paidBill: !isCounterPay ? t.paidBill + totalAmount : t.paidBill,
            }
          : t
      )
    );

    setHourlyMetrics((prev) =>
      prev.map((m) =>
        m.hour === "7 PM"
          ? { ...m, orders: m.orders + 1, revenue: m.revenue + totalAmount }
          : m
      )
    );

    logActivity(
      customerName,
      `Guest (${activeTable})`,
      `Placed ${newOrder.id} (₹${totalAmount} • ${paymentMethod})${
        whatsappReceipt ? " + WhatsApp Bill" : ""
      }`
    );

    setCart([]);
    showToast(
      isCounterPay
        ? `Order ${newOrder.id} confirmed! Pay ₹${totalAmount} at Counter.`
        : `Paid ₹${totalAmount}! Order ${newOrder.id} sent to Bar & Kitchen.`
    );
    return newOrder;
  };

  const handleSettleCounterPayment = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "Paid" } : o))
    );

    setTables((prev) =>
      prev.map((t) =>
        t.number === target.tableNumber
          ? {
              ...t,
              status: "Served",
              pendingBill: Math.max(0, t.pendingBill - target.totalAmount),
              paidBill: t.paidBill + target.totalAmount,
            }
          : t
      )
    );

    logActivity(
      session.name || "Manager",
      "Cafe Manager",
      `Settled Counter Payment of ₹${target.totalAmount} for ${orderId} (${target.tableNumber})`
    );
    showToast(`Settled ₹${target.totalAmount} counter payment for ${target.tableNumber}`);
  };

  const handleUpdateKitchenStatus = (orderId: string, status: "Ready" | "Served") => {
    const target = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, kitchenStatus: status } : o))
    );
    if (target && status === "Served") {
      setTables((prev) =>
        prev.map((t) =>
          t.number === target.tableNumber && t.pendingBill === 0
            ? { ...t, status: "Served" }
            : t
        )
      );
    }
    logActivity(
      session.name || "Manager",
      "Cafe Manager",
      `Marked ${orderId} (${target?.tableNumber}) as ${status}`
    );
    showToast(`Order ${orderId} marked ${status}`);
  };

  const handleUpdateTableStatus = (tableId: string, status: TableStatus) => {
    const tbl = tables.find((t) => t.id === tableId);
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status,
              guestName: status === "Vacant" ? undefined : t.guestName,
              occupiedMinutes: status === "Vacant" ? 0 : t.occupiedMinutes || 5,
              pendingBill: status === "Vacant" ? 0 : t.pendingBill,
              paidBill: status === "Vacant" ? 0 : t.paidBill,
            }
          : t
      )
    );
    logActivity(
      session.name || "Manager",
      "Cafe Manager",
      `Updated ${tbl?.number} status to ${status}`
    );
    showToast(`${tbl?.number} updated to ${status}`);
  };

  const handleAssignWalkInTable = (tableId: string, guestName: string) => {
    const tbl = tables.find((t) => t.id === tableId);
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status: "Ordering", guestName, occupiedMinutes: 1 }
          : t
      )
    );
    logActivity(
      session.name || "Manager",
      "Cafe Manager",
      `Seated walk-in guest "${guestName}" at ${tbl?.number}`
    );
    showToast(`Seated ${guestName} at ${tbl?.number}`);
  };

  const handleRestockIngredient = (id: string) => {
    const ing = inventory.find((i) => i.id === id);
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentStock: item.maxCapacity } : item
      )
    );
    logActivity(
      session.name || "Admin",
      "Admin Owner",
      `Restocked ${ing?.name} to 100% capacity`
    );
    showToast(`Restocked ${ing?.name} to full capacity`);
  };

  const pendingCounterCount = useMemo(
    () => orders.filter((o) => o.paymentStatus === "Pending at Counter").length,
    [orders]
  );
  const preparingTicketsCount = useMemo(
    () => orders.filter((o) => o.kitchenStatus === "Preparing").length,
    [orders]
  );

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2C362B] flex flex-col">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        session={session}
        onLogout={handleLogout}
        cartCount={cart.length}
        pendingCounterCount={pendingCounterCount}
        preparingTicketsCount={preparingTicketsCount}
      />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2C362B] text-[#FCFBF9] px-4 py-3 rounded-2xl shadow-xl border border-[#4A6B53] flex items-center gap-2.5 text-xs font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B53]" />
          <span>{toast}</span>
        </div>
      )}

      {currentPage === "welcome" && (
        <WelcomePage
          tables={tables}
          featuredItems={MENU_ITEMS.filter((m) => m.featured)}
          onStartTableOrder={handleStartTableOrder}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === "login" && (
        <LoginPage tables={tables} onLoginSuccess={handleLoginSuccess} />
      )}

      {currentPage === "menu" && (
        <MenuOrderingPage
          session={session}
          tables={tables}
          menuItems={MENU_ITEMS}
          inventory={inventory}
          cart={cart}
          orders={orders}
          onChangeTable={(tbl) => setSession((prev) => ({ ...prev, tableNumber: tbl }))}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {currentPage === "manager" && (
        <ManagerDashboardPage
          tables={tables}
          orders={orders}
          onSettleCounterPayment={handleSettleCounterPayment}
          onUpdateKitchenStatus={handleUpdateKitchenStatus}
          onUpdateTableStatus={handleUpdateTableStatus}
          onAssignWalkInTable={handleAssignWalkInTable}
        />
      )}

      {currentPage === "admin" && (
        <AdminDashboardPage
          orders={orders}
          tables={tables}
          inventory={inventory}
          hourlyMetrics={hourlyMetrics}
          activityLogs={activityLogs}
          onRestockIngredient={handleRestockIngredient}
        />
      )}
    </div>
  );
}

export default App;
