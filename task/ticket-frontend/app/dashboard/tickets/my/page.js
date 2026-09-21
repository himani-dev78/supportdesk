"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyTickets } from "@/lib/api";


export default function CustomerTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 const fetchTickets = async (page, searchValue = "") => {
  try {
    setError("");

    if (initialLoading) {
      setLoading(true);
    }

    const response = await getMyTickets(page, 5, searchValue);

    setTickets(response.data.tickets || []);

    setCurrentPage(
      response.data.pagination?.currentPage || page
    );

    setTotalPages(
      response.data.pagination?.totalPages || 1
    );
  } catch (error) {
    console.error("Get tickets error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to fetch your tickets"
    );
  } finally {
    setLoading(false);
    setInitialLoading(false);
  }
};

useEffect(() => { 
  fetchTickets(currentPage, search); 
}, [currentPage, search]);

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
        <p className="text-gray-600">
          Loading your tickets...
        </p>
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

          {/* Search */}
<div className="mb-6">
  <div className="relative max-w-md">
    <input
      type="text"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      placeholder="Search your tickets..."
      className="w-full border border-gray-700 rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
    />

    {search && (
      <button
        onClick={() => {
          setSearch("");
          setCurrentPage(1);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
      >
        ×
      </button>
    )}
  </div>
</div>

         
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
          <>
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
                        ? new Date(
                            ticket.createdAt
                          ).toLocaleDateString()
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
                    <button
                      onClick={() =>
                        setSelectedTicket(ticket)
                      }
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Ticket →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">

                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev - 1
                    )
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev + 1
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="px-4 py-2 border rounded-lg bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>

              </div>
            )}
          </>
        )}

        {/* ================= MODAL ================= */}

        {selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Ticket Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    Ticket ID: {selectedTicket._id}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedTicket(null)
                  }
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">

                {/* Title */}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Title
                  </p>

                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedTicket.title}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>

                  <div className="mt-2 bg-gray-50 border rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>

                {/* Ticket Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Category */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Category
                    </p>

                    <p className="text-gray-900 mt-1">
                      {selectedTicket.category || "Other"}
                    </p>
                  </div>

                  {/* Priority */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Priority
                    </p>

                    <p
                      className={`mt-1 font-medium ${getPriorityClass(
                        selectedTicket.priority
                      )}`}
                    >
                      {selectedTicket.priority || "Medium"}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Status
                    </p>

                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        selectedTicket.status
                      )}`}
                    >
                      {selectedTicket.status || "Open"}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Created At
                    </p>

                    <p className="text-gray-900 mt-1">
                      {selectedTicket.createdAt
                        ? new Date(
                            selectedTicket.createdAt
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* Updated Date */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Updated
                    </p>

                    <p className="text-gray-900 mt-1">
                      {selectedTicket.updatedAt
                        ? new Date(
                            selectedTicket.updatedAt
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Customer
                    </p>

                    <p className="text-gray-900 mt-1">
                      {selectedTicket.customer?.name ||
                        "N/A"}
                    </p>

                    {selectedTicket.customer?.email && (
                      <p className="text-sm text-gray-500">
                        {selectedTicket.customer.email}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() =>
                    setSelectedTicket(null)
                  }
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}