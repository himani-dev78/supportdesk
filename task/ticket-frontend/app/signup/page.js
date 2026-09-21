"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import GoogleLoginButton from "@/components/GoogleLoginButton";
import { signupUser } from "@/lib/api";


export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    await signupUser(formData);

    router.push("/login");

  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Unable to create account"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-slate-50 flex">

      {/* LEFT SIDE */}
      <section className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 xl:p-20 flex-col justify-between">

        <div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl">
              S
            </div>

            <span className="text-xl font-semibold">
              SupportDesk
            </span>
          </div>

          <div className="mt-24 max-w-lg">

            <h2 className="text-5xl font-bold leading-tight">
              Get help.
              <br />
              <span className="text-blue-500">
                Stay informed.
              </span>
            </h2>

            <p className="mt-6 text-slate-400 text-lg leading-8">
              Join our support platform and keep track
              of every request from creation to resolution.
            </p>

            <div className="mt-10 space-y-5">

              <Feature text="Create support requests in seconds" />

              <Feature text="Track your ticket status" />

              <Feature text="Keep your support history organized" />

            </div>

          </div>

        </div>

        <p className="text-sm text-slate-500">
          © 2026 SupportDesk. All rights reserved.
        </p>

      </section>

      {/* RIGHT SIDE */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              S
            </div>

            <span className="text-xl font-semibold text-slate-900">
              SupportDesk
            </span>

          </div>

          <div className="mb-7">

            <h1 className="text-3xl font-bold text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-slate-500">
              Start managing your support requests.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* EMAIL */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* PHONE */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone number
              </label>

              <input
                type="tel"
                name="phoneNumber"
                placeholder="10 digit phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 mt-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">

            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />

          </div>

          {/* GOOGLE */}
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          {/* LOGIN */}
          <p className="text-center text-sm text-slate-500 mt-7">

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-sm">
        ✓
      </div>

      <span className="text-slate-300">
        {text}
      </span>

    </div>
  );
}