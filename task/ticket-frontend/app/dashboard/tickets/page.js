"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/lib/api";

export default function NewTicket() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await createTicket(formData);

      console.log("Ticket created:", response.data);

      setSuccess("Ticket created successfully!");

      // Clear form
      setFormData({
        title: "",
        description: "",
        category: "Other",
        priority: "Medium",
      });

      // Go back to customer dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Create ticket error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Create New Ticket
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us about your issue and our support team
            will help you.
          </p>

        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
        >

          {/* Title */}
          <div className="mb-6">

            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Ticket Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your issue"
              required
              minLength={5}
              maxLength={150}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>


          {/* Description */}
          <div className="mb-6">

            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
              required
              minLength={10}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>


          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

            {/* Category */}
            <div>

              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="Billing">
                  Billing
                </option>

                <option value="Account">
                  Account
                </option>

                <option value="Payment">
                  Payment
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            {/* Priority */}
            <div>

              <label
                htmlFor="priority"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>

            </div>

          </div>


          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}


          {/* Success */}
          {success && (
            <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">
                {success}
              </p>
            </div>
          )}


          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

