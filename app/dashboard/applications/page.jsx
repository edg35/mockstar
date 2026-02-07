"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import ApplicationCard from "@/components/dashboard/ApplicationCard";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Wishlist", value: "wishlist" },
  { label: "Applied", value: "applied" },
  { label: "Phone Screen", value: "phone_screen" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

function ApplicationsPage() {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingApp, setUpdatingApp] = useState(null);

  useEffect(() => {
    user && fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setIsLoading(true);
    const userId = user?.primaryEmailAddress?.emailAddress;
    const res = await fetch(
      `/api/applications?userId=${encodeURIComponent(userId)}`
    );
    const result = await res.json();

    if (result.success) {
      setApplications(result.data);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (application, newStatus) => {
    const userId = user?.primaryEmailAddress?.emailAddress;
    const res = await fetch(`/api/applications/${application.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    const result = await res.json();
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === application.id ? { ...a, applicationStatus: newStatus } : a
        )
      );
    }
    setUpdatingApp(null);
  };

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.applicationStatus !== statusFilter) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          app.companyName.toLowerCase().includes(q) ||
          app.jobTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  return (
    <div className="p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl">Applications</h2>
          <p className="text-gray-500">Track and manage your job applications</p>
        </div>
        <Link href="/dashboard/applications/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Application
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by company or job title..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[140px] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="font-semibold text-lg text-gray-700">
            {applications.length === 0
              ? "No applications yet"
              : "No matching applications"}
          </h3>
          <p className="text-gray-500 mt-1 max-w-md">
            {applications.length === 0
              ? "Start tracking your job search by adding your first application."
              : "Try adjusting your search or filter to find what you're looking for."}
          </p>
          {applications.length === 0 && (
            <Link href="/dashboard/applications/new" className="mt-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Application
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusUpdate={(app) => setUpdatingApp(app)}
            />
          ))}
        </div>
      )}
      <Dialog open={!!updatingApp} onOpenChange={() => setUpdatingApp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {STATUS_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
              <Button
                key={opt.value}
                variant={
                  updatingApp?.applicationStatus === opt.value
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => handleStatusUpdate(updatingApp, opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApplicationsPage;
