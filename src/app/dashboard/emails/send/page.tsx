"use client";
import { useState, useEffect } from "react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  template: string;
}

export default function SendCampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      setFetching(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://api.fullstackadnan.com/api/admin/campaigns",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch campaigns");
        setCampaigns(data.data.campaigns || []);
        if (data.data.campaigns && data.data.campaigns.length > 0) {
          setSelected(data.data.campaigns[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchCampaigns();
  }, []);

  const campaign = campaigns.find((c) => c.id === selected);

  const handleSend = async () => {
    setLoading(true);
    // TODO: Integrate with backend to send campaign
    alert(`Sending campaign: ${campaign?.name}`);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Send Email Campaign
      </h2>
      {fetching ? (
        <div className="text-gray-500">Loading campaigns...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-gray-500">
          No campaigns found. Please create one first.
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Select Campaign
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="border border-gray-200 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.subject}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Preview</label>
            <div
              className="border border-gray-200 rounded p-4 bg-gray-50 min-h-[100px]"
              dangerouslySetInnerHTML={{ __html: campaign?.template || "" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition mt-2 w-full"
          >
            {loading ? "Sending..." : "Send Campaign"}
          </button>
        </>
      )}
    </div>
  );
}
