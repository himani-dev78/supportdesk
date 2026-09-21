"use client";

import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus } from "@/lib/api";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTicket, setUpdatingTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllTickets();

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Get all tickets error:", error);

      setError(
        error.response?.data?.message || "Unable to fetch tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    try {
      setUpdatingTicket(ticketId);

      await updateTicketStatus(ticketId, status);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status } : ticket
        )
      );
    } catch (error) {
      console.error("Update ticket status error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update ticket status"
      );
    } finally {
      setUpdatingTicket(null);
    }
  };

  // ==================== TICKET COUNTS ====================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "in progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "resolved"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "closed"
  ).length;

  const highPriority = tickets.filter(
    (t) => t.priority?.toLowerCase() === "high"
  ).length;
  const mediumPriority = tickets.filter(
    (t) => t.priority?.toLowerCase() === "medium"
  ).length;
  const lowPriority = tickets.filter(
    (t) => t.priority?.toLowerCase() === "low"
  ).length;

  const last7DaysData = getLast7DaysCounts(tickets);
  const topCategories = getTopCategories(tickets);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-700";

      case "in progress":
        return "bg-yellow-100 text-yellow-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      case "closed":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600";

      case "medium":
        return "text-yellow-600";

      case "low":
        return "text-green-600";

      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading admin dashboard...</p>
      </div>
    );
  }

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ==================== HEADER ==================== */}
<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      Admin Dashboard
    </h1>

    <p className="text-slate-500 mt-1">
      Manage and monitor all customer support tickets.
    </p>
  </div>

<div className="flex justify-between gap-2">
  <button
    onClick={() => {
      window.location.href = "/admin/dashboard/tickets";
    }}
    className="text-base bg-blue-600 px-6 py-3 rounded-xl font-medium text-white"
  >
    View Tickets
  </button>
     <button
      onClick={handleLogout}
      className="px-6 py-2 rounded-lg bg-red-600 text-white text-base font-medium hover:bg-red-700 transition"
    >
      Logout
    </button>
    </div>
</div>

        {/* ==================== ERROR ==================== */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* ==================== STATISTICS ==================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Tickets */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">Total Tickets</p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {totalTickets}
            </h2>
          </div>

          {/* Open Tickets */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">Open Tickets</p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {openTickets}
            </h2>
          </div>

          {/* In Progress */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">In Progress</p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {inProgressTickets}
            </h2>
          </div>

          {/* Resolved */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">Resolved</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {resolvedTickets}
            </h2>
          </div>
        </div>

        {/* ==================== ANALYTICS ==================== */}

        {totalTickets > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Status breakdown donut */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                All tickets across the platform
              </p>

              <StatusDonutChart
                open={openTickets}
                inProgress={inProgressTickets}
                resolved={resolvedTickets}
                closed={closedTickets}
                total={totalTickets}
              />
            </div>

            {/* Priority breakdown bar chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Priority Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                How incoming tickets are prioritized
              </p>

              <PriorityBarChart
                high={highPriority}
                medium={mediumPriority}
                low={lowPriority}
              />

              {topCategories.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-3">
                    Top Categories
                  </p>
                  <div className="flex flex-col gap-2">
                    {topCategories.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-600">{c.label}</span>
                        <span className="font-semibold text-slate-900">
                          {c.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tickets over time */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Tickets Created
              </h3>
              <p className="text-xs text-slate-500 mb-5">Last 7 days</p>

              <TrendLineChart data={last7DaysData} />
            </div>
          </div>
        )}

        {/* ==================== RECENT TICKETS ==================== */}

        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Tickets
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View and manage customer support tickets.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/admin/dashboard/tickets";
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          {/* No Tickets */}

          {tickets.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-500">No tickets found.</p>
            </div>
          )}

          {/* Tickets */}

          {tickets.length > 0 && (
            <div className="divide-y divide-slate-100">
              {tickets.slice(0, 2).map((ticket) => (
                <div
                  key={ticket._id}
                  className="px-6 py-5 hover:bg-slate-50 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Ticket */}

                    <div className="md:col-span-4">
                      <p className="font-semibold text-slate-900">
                        {ticket.title}
                      </p>

                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {ticket.description}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    {/* Customer */}

                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-400">Customer</p>

                      <p className="text-sm text-slate-700 mt-1">
                        {ticket.customer?.name || "N/A"}
                      </p>
                    </div>

                    {/* Priority */}

                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-400">Priority</p>

                      <p
                        className={`text-sm font-medium mt-1 ${getPriorityClass(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority || "Medium"}
                      </p>
                    </div>

                    {/* Status */}

                    <div className="md:col-span-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status || "Open"}
                      </span>
                    </div>

                    {/* Update Status */}

                    <div className="md:col-span-2">
                      <select
                        value={ticket.status || "Open"}
                        disabled={updatingTicket === ticket._id}
                        onChange={(e) =>
                          handleStatusChange(ticket._id, e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="Open">Open</option>

                        <option value="In Progress">In Progress</option>

                        <option value="Resolved">Resolved</option>

                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Helpers
────────────────────────────────────────── */

function getLast7DaysCounts(tickets) {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      count: 0,
    });
  }

  tickets.forEach((ticket) => {
    if (!ticket.createdAt) return;
    const key = new Date(ticket.createdAt).toISOString().slice(0, 10);
    const day = days.find((d) => d.key === key);
    if (day) day.count += 1;
  });

  return days;
}

function getTopCategories(tickets, limit = 3) {
  const counts = {};

  tickets.forEach((t) => {
    const cat = t.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/* ──────────────────────────────────────────
   Status Donut Chart (pure SVG, no deps)
────────────────────────────────────────── */

function StatusDonutChart({ open, inProgress, resolved, closed, total }) {
  const size = 160;
  const radius = 60;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segments = [
    { label: "Open", value: open, color: "#2563eb" },
    { label: "In Progress", value: inProgress, color: "#eab308" },
    { label: "Resolved", value: resolved, color: "#16a34a" },
    { label: "Closed", value: closed, color: "#94a3b8" },
  ];

  let offsetAccumulated = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />

        {total > 0 &&
          segments.map((seg) => {
            const fraction = seg.value / total;
            const dash = fraction * circumference;
            const gap = circumference - dash;
            const rotation = (offsetAccumulated / total) * 360 - 90;
            offsetAccumulated += seg.value;

            if (seg.value === 0) return null;

            return (
              <circle
                key={seg.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeLinecap="butt"
                transform={`rotate(${rotation} ${center} ${center})`}
              />
            );
          })}

        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="fill-slate-900"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          className="fill-slate-400"
          style={{ fontSize: 11 }}
        >
          Total
        </text>
      </svg>

      <div className="flex flex-col gap-2 mt-4 w-full">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-slate-600">{seg.label}</span>
            </div>
            <span className="font-semibold text-slate-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Priority Bar Chart (pure SVG, no deps)
────────────────────────────────────────── */

function PriorityBarChart({ high, medium, low }) {
  const bars = [
    { label: "High", value: high, color: "#ef4444" },
    { label: "Medium", value: medium, color: "#eab308" },
    { label: "Low", value: low, color: "#22c55e" },
  ];

  const max = Math.max(high, medium, low, 1);

  return (
    <div className="flex flex-col gap-4">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 font-medium">{bar.label}</span>
            <span className="text-slate-900 font-semibold">{bar.value}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(bar.value / max) * 100}%`,
                backgroundColor: bar.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   7-day Trend Line Chart (pure SVG, no deps)
────────────────────────────────────────── */

function TrendLineChart({ data }) {
  const width = 260;
  const height = 140;
  const padding = 20;

  const max = Math.max(...data.map((d) => d.count), 1);
  const stepX = (width - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.count / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    height - padding
  } L ${points[0].x} ${height - padding} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="adminTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill="url(#adminTrendFill)" />
      <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2" />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2563eb" />
      ))}

      {points.map((p, i) => (
        <text
          key={`label-${i}`}
          x={p.x}
          y={height - 4}
          textAnchor="middle"
          className="fill-slate-400"
          style={{ fontSize: 9 }}
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}