"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import ApplicationForm from "@/components/dashboard/ApplicationForm";

function EditApplicationPage({ params }) {
  const { id } = params;
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setError("You must be signed in to edit this application.");
      setIsLoading(false);
      return;
    }
    fetchApplication();
  }, [isLoaded, userId]);

  async function fetchApplication() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/applications/${id}?userId=${encodeURIComponent(userId)}`
      );
      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "Application not found.");
        return;
      }

      setApplication(result.data);
    } catch {
      setError("Failed to load application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(data) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      toast({
        variant: "destructive",
        title: "Failed to update application",
        description: result.error || "Something went wrong. Please try again.",
      });
      return;
    }

    toast({
      title: "Application updated",
      description: `${data.jobTitle} at ${data.companyName} has been saved.`,
    });

    router.push(`/dashboard/applications/${id}`);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-10">
        <Skeleton className="h-4 w-72 mb-6" />
        <Skeleton className="h-8 w-56 mb-6" />
        <div className="max-w-3xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[80px] w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-10">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/dashboard/applications" className="hover:text-foreground transition-colors">
            Applications
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="font-semibold text-lg text-gray-700">{error}</h3>
          <Link href="/dashboard/applications" className="mt-4">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/applications" className="hover:text-foreground transition-colors">
          Applications
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/dashboard/applications/${id}`}
          className="hover:text-foreground transition-colors truncate max-w-[200px]"
        >
          {application.companyName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Edit</span>
      </nav>

      {/* Title */}
      <h2 className="font-bold text-2xl mb-6">Edit Application</h2>

      {/* Form */}
      <div className="max-w-3xl">
        <ApplicationForm
          initialData={application}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/dashboard/applications/${id}`)}
        />
      </div>
    </div>
  );
}

export default EditApplicationPage;
