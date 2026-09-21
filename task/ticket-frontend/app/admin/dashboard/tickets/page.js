"use client";

import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus } from "@/lib/api";

const STATUS_ORDER = ["Open", "In Progress", "Resolved", "Closed"];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [updatingTicket, setUpdatingTicket] = useState(null);

  const fetchTickets = async (page, searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllTickets(
        page,
        5,
        searchValue
      );

      setTickets(response.data.tickets || []);

      setCurrentPage(
        response.data.pagination?.currentPage || page
      );

      setTotalPages(
        response.data.pagination?.totalPages || 1
      );
    } catch (error) {
      console.error("Get all tickets error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to fetch tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(currentPage, search);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      setUpdatingTicket(ticketId);

      await updateTicketStatus(ticketId, status);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? {
                ...ticket,
                status,
              }
            : ticket
        )
      );

      setSelectedTicket((prevTicket) =>
        prevTicket && prevTicket._id === ticketId
          ? {
              ...prevTicket,
              status,
            }
          : prevTicket
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

  // Has this ticket ever reached "In Progress" or beyond?
  const hasStartedProgress = (status) => {
    const index = STATUS_ORDER.indexOf(status || "Open");
    return index >= STATUS_ORDER.indexOf("In Progress");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        {/* Header */}
<div className="mb-8">
  {/* Error */}
  {error && (
    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
      {error}
    </div>
  )}

  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        All Tickets
      </h1>

      <p className="text-slate-500 mt-1">
        View and manage all customer support tickets.
      </p>
    </div>

    <div className="w-full md:w-80 shrink-0">
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search tickets..."
          className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {search && (
          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xl"
          >
            ×
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 mt-2">
        Search by title, description, or category.
      </p>
    </div>
  </div>
</div>

        {/* Tickets */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          {loading ? (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                Loading tickets...
              </p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                No tickets found.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <div className="col-span-3">
                  Ticket
                </div>

                <div className="col-span-2">
                  Customer
                </div>

                <div className="col-span-2">
                  Category
                </div>

                <div className="col-span-1">
                  Priority
                </div>

                <div className="col-span-2">
                  Status
                </div>

                <div className="col-span-2">
                  Action
                </div>
              </div>

              {/* Ticket Rows */}
              <div className="divide-y divide-slate-100">
                {tickets.map((ticket) => {
                  const status = ticket.status || "Open";
                  const isUpdating = updatingTicket === ticket._id;
                  const canResolve = hasStartedProgress(status);
                  const isTerminal = status === "Resolved" || status === "Closed";

                  return (
                    <div
                      key={ticket._id}
                      className="px-6 py-5 hover:bg-slate-50 transition"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                        {/* Ticket */}
                        <div className="md:col-span-3">
                          <p className="font-semibold text-slate-900">
                            {ticket.title}
                          </p>

                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {ticket.description}
                          </p>

                          <p className="text-xs text-slate-400 mt-2">
                            {ticket.createdAt
                              ? new Date(
                                  ticket.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>

                        {/* Customer */}
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-slate-700">
                            {ticket.customer?.name || "N/A"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1 break-all">
                            {ticket.customer?.email || "N/A"}
                          </p>
                        </div>

                        {/* Category */}
                        <div className="md:col-span-2">
                          <span className="text-sm text-slate-700">
                            {ticket.category || "N/A"}
                          </span>
                        </div>

                        {/* Priority */}
                        <div className="md:col-span-1">
                          <span
                            className={`text-sm font-medium ${getPriorityClass(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority || "Medium"}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                          {!isTerminal && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(ticket._id, "In Progress")
                                }
                                disabled={isUpdating || status === "In Progress"}
                                className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white text-xs font-medium hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                In Progress
                              </button>

                              <button
                                onClick={() =>
                                  canResolve &&
                                  handleStatusChange(ticket._id, "Resolved")
                                }
                                disabled={!canResolve || isUpdating}
                                title={
                                  !canResolve
                                    ? "Mark as In Progress before resolving"
                                    : undefined
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                  canResolve
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-green-600/40 text-white/70 blur-[0.5px] cursor-not-allowed"
                                }`}
                              >
                                Resolve
                              </button>
                            </>
                          )}

                          <button
                            onClick={() =>
                              setSelectedTicket(ticket)
                            }
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
                          >
                            View
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="px-6 py-5 border-t border-slate-200 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev - 1
                      )
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) => prev + 1
                      )
                    }
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>

                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Ticket Details
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  ID: {selectedTicket._id}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedTicket(null)
                }
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Title */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Title
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {selectedTicket.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Description
                </p>

                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase mb-2">
                  Customer
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-900">
                    {selectedTicket.customer?.name ||
                      "N/A"}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedTicket.customer?.email ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {/* Ticket Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">
                    Category
                  </p>

                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTicket.category || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">
                    Priority
                  </p>

                  <p
                    className={`text-sm font-medium mt-1 ${getPriorityClass(
                      selectedTicket.priority
                    )}`}
                  >
                    {selectedTicket.priority ||
                      "Medium"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">
                    Created At
                  </p>

                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTicket.createdAt
                      ? new Date(
                          selectedTicket.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">
                    Updated At
                  </p>

                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTicket.updatedAt
                      ? new Date(
                          selectedTicket.updatedAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase mb-2">
                  Update Status
                </p>

                <select
                  value={
                    selectedTicket.status || "Open"
                  }
                  disabled={
                    updatingTicket ===
                    selectedTicket._id
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedTicket._id,
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option
                    value="Resolved"
                    disabled={!hasStartedProgress(selectedTicket.status)}
                  >
                    Resolved{!hasStartedProgress(selectedTicket.status) ? " (mark In Progress first)" : ""}
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>

                {updatingTicket ===
                  selectedTicket._id && (
                  <p className="text-xs text-slate-400 mt-2">
                    Updating status...
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() =>
                  setSelectedTicket(null)
                }
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}