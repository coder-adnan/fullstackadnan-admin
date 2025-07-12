"use client";
import { useState } from "react";

export default function CreateCampaignPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://api.fullstackadnan.com/api/admin/campaigns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, subject, template }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create campaign");
      setSuccess("Campaign created successfully!");
      setName("");
      setSubject("");
      setTemplate("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Create Email Campaign
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            Campaign Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-200 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="border border-gray-200 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Template
          </label>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            required
            rows={8}
            className="border border-gray-200 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
            placeholder="Write your email HTML or text here..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition mt-2"
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}
