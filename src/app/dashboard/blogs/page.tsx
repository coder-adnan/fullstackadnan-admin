"use client";
import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "@/utils/api";

interface Blog {
  id: string;
  title: string;
  status: string;
  author: { email: string; name: string; avatarUrl?: string };
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedByUser?: { id: string; name: string };
  imageUrl?: string;
  excerpt?: string;
  content?: string;
}

const TABS = [
  { label: "All", value: "ALL" },
  { label: "Approved", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/blog-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch blogs");
      setBlogs(data.data.posts || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    let filtered = blogs;
    if (tab !== "ALL") filtered = filtered.filter((b) => b.status === tab);
    if (search)
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.name.toLowerCase().includes(search.toLowerCase()) ||
          b.author.email.toLowerCase().includes(search.toLowerCase())
      );
    return filtered;
  }, [blogs, tab, search]);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBlogs.slice(start, start + pageSize);
  }, [filteredBlogs, page, pageSize]);

  const stats = useMemo(() => {
    const total = blogs.length;
    const approved = blogs.filter((b) => b.status === "APPROVED").length;
    const pending = blogs.filter((b) => b.status === "PENDING").length;
    const rejected = blogs.filter((b) => b.status === "REJECTED").length;
    return { total, approved, pending, rejected };
  }, [blogs]);

  const statusBadge = (status: string) => {
    let color = "bg-gray-200 text-gray-700";
    if (status === "APPROVED") color = "bg-green-100 text-green-700";
    if (status === "PENDING") color = "bg-yellow-100 text-yellow-700";
    if (status === "REJECTED") color = "bg-red-100 text-red-700";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
        {status}
      </span>
    );
  };

  const renderAvatar = (name: string, avatarUrl?: string) => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return (
      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-700">
        {initials}
      </div>
    );
  };

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);

  const fetchBlogDetails = async (blogId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/admin/blog-posts/${blogId}`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setSelectedBlog(data.data.post);
      setShowModal(true);
    } else {
      alert(data.message || "Failed to fetch blog details");
    }
  };

  const handleMenuAction = async (blogId: string, action: string) => {
    setOpenMenu(null);
    if (action === "View") {
      await fetchBlogDetails(blogId);
      return;
    }
    // Approve or Reject
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/blog-posts/${blogId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ status: action.toUpperCase() }), // "APPROVED" or "REJECTED"
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");
      // Refresh the blog list
      fetchBlogs();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Modal close handler that also refetches blogs
  const handleCloseModal = () => {
    setShowModal(false);
    fetchBlogs();
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-blue-50 pb-4 pt-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-blue-700">Blogs Management</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by title, name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Download
            </button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Total Blogs</span>
            <span className="text-xl font-bold text-blue-700">
              {stats.total}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Approved</span>
            <span className="text-xl font-bold text-green-600">
              {stats.approved}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Pending</span>
            <span className="text-xl font-bold text-yellow-600">
              {stats.pending}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Rejected</span>
            <span className="text-xl font-bold text-red-600">
              {stats.rejected}
            </span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-t-lg font-semibold text-sm border-b-2 transition ${
                tab === t.value
                  ? "border-blue-600 bg-white text-blue-700"
                  : "border-transparent text-gray-500 hover:bg-blue-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : paginatedBlogs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No blogs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 border-b">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Approved By</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4">Updated At</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      {renderAvatar(blog.author.name, blog.author.avatarUrl)}
                      <span className="font-medium">{blog.author.name}</span>
                    </td>
                    <td className="py-3 px-4">{blog.author.email}</td>
                    <td className="py-3 px-4 font-medium">{blog.title}</td>
                    <td className="py-3 px-4">{statusBadge(blog.status)}</td>
                    <td className="py-3 px-4">
                      {blog.reviewedByUser?.name || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(blog.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(blog.updatedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center relative">
                      <button
                        className="p-2 rounded-full hover:bg-blue-100 transition"
                        onClick={() =>
                          setOpenMenu(openMenu === blog.id ? null : blog.id)
                        }
                        aria-label="Actions"
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="19" cy="12" r="1.5" />
                          <circle cx="5" cy="12" r="1.5" />
                        </svg>
                      </button>
                      {openMenu === blog.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-20 animate-fade-in">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700"
                            onClick={() => handleMenuAction(blog.id, "View")}
                          >
                            View
                          </button>
                          {["APPROVED", "PENDING", "REJECTED"]
                            .filter((status) => status !== blog.status)
                            .map((status) => (
                              <button
                                key={status}
                                className={`w-full text-left px-4 py-2 hover:bg-$
                                {status === "APPROVED"
                                  ? "green-50 text-green-700"
                                  : status === "REJECTED"
                                  ? "red-50 text-red-700"
                                  : "yellow-50 text-yellow-700"
                                }`}
                                onClick={() =>
                                  handleMenuAction(
                                    blog.id,
                                    status.charAt(0) +
                                      status.slice(1).toLowerCase()
                                  )
                                }
                              >
                                {status.charAt(0) +
                                  status.slice(1).toLowerCase()}
                              </button>
                            ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination and Show X */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[8, 16, 32, 64].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border text-sm font-semibold disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          <span className="text-sm">
            {page} / {totalPages || 1}
          </span>
          <button
            className="px-3 py-1 rounded border text-sm font-semibold disabled:opacity-50"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Modal for viewing blog details */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col relative">
            {/* Sticky header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto p-4 flex-1">
              {selectedBlog.imageUrl && (
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
              )}
              <div className="mb-2 text-gray-600">
                <span className="font-semibold">Author:</span>{" "}
                {selectedBlog.author?.name}
              </div>
              <div className="mb-2 text-gray-600">
                <span className="font-semibold">Status:</span>{" "}
                {selectedBlog.status}
              </div>
              <div className="mb-2 text-gray-600">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedBlog.createdAt).toLocaleString()}
              </div>
              <div className="mb-4 text-gray-600">
                <span className="font-semibold">Excerpt:</span>{" "}
                {selectedBlog.excerpt}
              </div>
              <div
                className="prose max-w-none"
                style={{ whiteSpace: "pre-line" }}
              >
                {selectedBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
