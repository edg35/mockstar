"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ApplicationForm from "@/components/dashboard/ApplicationForm";

function NewApplicationPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(data) {
    const userId = user?.primaryEmailAddress?.emailAddress;
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be signed in to create an application.",
      });
      return;
    }

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      toast({
        variant: "destructive",
        title: "Failed to create application",
        description: result.error || "Something went wrong. Please try again.",
      });
      return;
    }

    toast({
      title: "Application created",
      description: `${data.jobTitle} at ${data.companyName} has been added.`,
    });

    router.push("/dashboard/applications");
  }

  return (
    <div className="p-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/dashboard/applications"
          className="hover:text-foreground transition-colors"
        >
          Applications
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">New</span>
      </nav>

      {/* Title */}
      <h2 className="font-bold text-2xl mb-6">Add New Job Application</h2>

      {/* Form */}
      <div className="max-w-3xl">
        <ApplicationForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/dashboard/applications")}
        />
      </div>
    </div>
  );
}

export default NewApplicationPage;
