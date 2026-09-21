"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyTickets } from "@/lib/api";


export default function CustomerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // Fetch customer's tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyTickets();

        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch your tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  // Calculate statistics
  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  // Priority breakdown
  const highPriority = tickets.filter((t) => t.priority === "High").length;
  const mediumPriority = tickets.filter((t) => t.priority === "Medium").length;
  const lowPriority = tickets.filter((t) => t.priority === "Low").length;

  // Tickets created per day for the last 7 days
  const last7DaysData = getLast7DaysCounts(tickets);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>

            <div>
              <h1 className="font-bold text-slate-900">SupportDesk</h1>
              <p className="text-xs text-slate-500">Customer Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h2>
            <p className="mt-2 text-slate-500">
              Manage your support requests and track their progress.
            </p>
          </div>
          <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard/tickets/my")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-sm transition"
          >
            View Ticket's
          </button>

          <button
            onClick={() => router.push("/dashboard/tickets")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-sm transition"
          >
            + Create New Ticket
          </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Tickets"
            value={totalTickets}
            description="All your tickets"
          />

          <StatCard
            title="Open"
            value={openTickets}
            description="Waiting for support"
          />

          <StatCard
            title="In Progress"
            value={inProgressTickets}
            description="Currently being handled"
          />

          <StatCard
            title="Resolved"
            value={resolvedTickets}
            description="Successfully resolved"
          />
        </div>

        {/* Analytics */}
        {!loading && !error && totalTickets > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            {/* Status breakdown donut */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Distribution of your tickets by status
              </p>

              <StatusDonutChart
                open={openTickets}
                inProgress={inProgressTickets}
                resolved={resolvedTickets}
                total={totalTickets}
              />
            </div>

            {/* Priority breakdown bar chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Priority Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                How your tickets are prioritized
              </p>

              <PriorityBarChart
                high={highPriority}
                medium={mediumPriority}
                low={lowPriority}
              />
            </div>

            {/* Tickets over time */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Tickets Created
              </h3>
              <p className="text-xs text-slate-500 mb-5">Last 7 days</p>

              <TrendLineChart data={last7DaysData} />
            </div>
          </section>
        )}

        {/* Tickets */}
        <section className="bg-white border border-slate-200 rounded-xl">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                My Tickets
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                View and track your support requests.
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard/tickets/my")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-500">Loading tickets...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-6 py-10 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && tickets.length === 0 && (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-500">
                You haven't created any tickets yet.
              </p>

              <button
                onClick={() => router.push("/dashboard/tickets")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Create Your First Ticket
              </button>
            </div>
          )}

          {/* Ticket list */}
       
{!loading && !error && tickets.length > 0 && (
  <div className="divide-y divide-slate-100">
    {tickets.slice(0, 2).map((ticket) => (
      <TicketRow
        key={ticket._id}
        ticket={ticket}
        onView={() =>
          router.push(`/customer/tickets/${ticket._id}`)
        }
      />
    ))}
  </div>
)}
        </section>
      </main>
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

/* ──────────────────────────────────────────
   Statistics Card
────────────────────────────────────────── */

function StatCard({ title, value, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      <p className="text-xs text-slate-400 mt-2">{description}</p>
    </div>
  );
}

/* ──────────────────────────────────────────
   Status Donut Chart (pure SVG, no deps)
────────────────────────────────────────── */

function StatusDonutChart({ open, inProgress, resolved, total }) {
  const size = 160;
  const radius = 60;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segments = [
    { label: "Open", value: open, color: "#2563eb" },
    { label: "In Progress", value: inProgress, color: "#9333ea" },
    { label: "Resolved", value: resolved, color: "#16a34a" },
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
          <div key={seg.label} className="flex items-center justify-between text-xs">
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
    const y =
      height - padding - (d.count / max) * (height - padding * 2);
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
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill="url(#trendFill)" />
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

/* ──────────────────────────────────────────
   Ticket Row
────────────────────────────────────────── */

function TicketRow({ ticket, onView }) {
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-slate-50 transition">
      <div>
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-slate-900">{ticket.title}</h4>

          <span className="text-xs text-slate-400">
            #{ticket._id.slice(-6)}
          </span>
        </div>

        <p className="text-sm text-slate-500 mt-1">
          Created on {formattedDate}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />

       
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Priority Badge
────────────────────────────────────────── */

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-yellow-50 text-yellow-600",
    Low: "bg-green-50 text-green-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[priority] || "bg-slate-50 text-slate-600"
      }`}
    >
      {priority}
    </span>
  );
}

/* ──────────────────────────────────────────
   Status Badge
────────────────────────────────────────── */

function StatusBadge({ status }) {
  const styles = {
    Open: "bg-blue-50 text-blue-600",
    "In Progress": "bg-purple-50 text-purple-600",
    Resolved: "bg-green-50 text-green-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}