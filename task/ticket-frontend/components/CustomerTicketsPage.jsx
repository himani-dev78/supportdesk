"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyTickets } from "@/lib/api";


export default function CustomerTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyTickets();

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Get tickets error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to fetch your tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Tickets
            </h1>

            <p className="text-gray-500 mt-1">
              View and track your support tickets
            </p>
          </div>

          <Link
            href="/customer/tickets/new"
            className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            + Create Ticket
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* No tickets */}
        {!error && tickets.length === 0 && (
          <div className="bg-white rounded-xl border p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No tickets found
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't created any support tickets yet.
            </p>

            <Link
              href="/customer/tickets/new"
              className="inline-block mt-5 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Create Your First Ticket
            </Link>
          </div>
        )}

        {/* Tickets */}
        {tickets.length > 0 && (
          <div className="bg-white rounded-xl border overflow-hidden">

            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 border-b text-sm font-semibold text-gray-600">
              <div className="col-span-4">Ticket</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Action</div>
            </div>

            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                {/* Ticket */}
                <div className="md:col-span-4">
                  <p className="font-semibold text-gray-900">
                    {ticket.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {ticket.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Category */}
                <div className="md:col-span-2 flex items-center">
                  <span className="text-sm text-gray-700">
                    {ticket.category || "Other"}
                  </span>
                </div>

                {/* Priority */}
                <div className="md:col-span-2 flex items-center">
                  <span
                    className={`text-sm font-medium ${getPriorityClass(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority || "Medium"}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status || "Open"}
                  </span>
                </div>

                {/* Action */}
                <div className="md:col-span-2 flex items-center">
                  <Link
                    href={`/customer/tickets/${ticket._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Ticket →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}