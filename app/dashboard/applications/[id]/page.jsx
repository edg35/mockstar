"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Mic,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  User,
  Mail,
  Star,
  Calendar,
  Clock,
  Loader2,
  ExternalLink,
  Plus,
} from "lucide-react";
import AddNewInterview from "../../_components/AddNewInterview";
import InterviewItemCard from "../../_components/InterviewItemCard";

const STATUS_CONFIG = {
  wishlist: { label: "Wishlist", bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  applied: { label: "Applied", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  phone_screen: { label: "Phone Screen", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  interview: { label: "Interview", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  offer: { label: "Offer", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PriorityStars({ priority }) {
  const level = Math.max(0, Math.min(5, priority || 0));
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < level
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function ApplicationDetailPage({ params }) {
  const { id } = params;
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  const userId = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setError("You must be signed in to view this application.");
      setIsLoading(false);
      return;
    }
    fetchApplication();
    fetchInterviews();
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

  const fetchInterviews = useCallback(async () => {
    if (!userId) return;
    setInterviewsLoading(true);
    try {
      const res = await fetch(
        `/api/applications/${id}/interviews?userId=${encodeURIComponent(userId)}`
      );
      const result = await res.json();
      if (res.ok && result.success) {
        setInterviews(result.data);
      }
    } catch {
      // silently fail -- interviews are supplementary
    } finally {
      setInterviewsLoading(false);
    }
  }, [id, userId]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/applications/${id}?userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
      const result = await res.json();

      if (!res.ok || !result.success) {
        toast({
          variant: "destructive",
          title: "Failed to delete",
          description: result.error || "Something went wrong.",
        });
        setIsDeleting(false);
        return;
      }

      toast({
        title: "Application deleted",
        description: `${application.jobTitle} at ${application.companyName} has been removed.`,
      });
      router.push("/dashboard/applications");
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "Something went wrong. Please try again.",
      });
      setIsDeleting(false);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-10">
        <Skeleton className="h-4 w-64 mb-6" />
        <Skeleton className="h-8 w-80 mb-2" />
        <Skeleton className="h-5 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[100px] w-full rounded-lg" />
          </div>
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

  const status = STATUS_CONFIG[application.applicationStatus] || STATUS_CONFIG.wishlist;

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
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {application.companyName}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-bold text-2xl">{application.companyName}</h2>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${status.bg} ${status.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <p className="text-muted-foreground text-lg">{application.jobTitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/applications/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={() => setShowInterviewDialog(true)}
          >
            <Mic className="h-4 w-4 mr-2" />
            Practice Interview
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your application for{" "}
                  <strong>{application.jobTitle}</strong> at{" "}
                  <strong>{application.companyName}</strong>. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow icon={MapPin} label="Location">
                {application.location}
              </DetailRow>
              <DetailRow icon={Briefcase} label="Salary">
                {application.salary}
              </DetailRow>
              <DetailRow icon={LinkIcon} label="Job URL">
                {application.jobUrl && (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View posting
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </DetailRow>
              <DetailRow icon={Star} label="Priority">
                <PriorityStars priority={application.priority} />
              </DetailRow>
              <DetailRow icon={User} label="Contact Person">
                {application.contactPerson}
              </DetailRow>
              <DetailRow icon={Mail} label="Contact Email">
                {application.contactEmail && (
                  <a
                    href={`mailto:${application.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {application.contactEmail}
                  </a>
                )}
              </DetailRow>
              <DetailRow icon={Calendar} label="Date Applied">
                {formatDate(application.dateApplied)}
              </DetailRow>
            </CardContent>
          </Card>

          {/* Job Description Card */}
          {application.jobDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {application.jobDescription}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Mock Interviews Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Mock Interviews</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInterviewDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Practice
              </Button>
            </CardHeader>
            <CardContent>
              {interviewsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[80px] w-full rounded-lg" />
                  <Skeleton className="h-[80px] w-full rounded-lg" />
                </div>
              ) : interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No mock interviews yet. Click Practice Interview to start one.
                </p>
              ) : (
                <div className="space-y-3">
                  {interviews.map((interview) => (
                    <InterviewItemCard
                      key={interview.id}
                      interview={interview}
                      onDelete={fetchInterviews}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {application.notes ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {application.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No notes yet. Click Edit to add some.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Timestamps Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DetailRow icon={Calendar} label="Added">
                {formatDate(application.dateAdded)}
              </DetailRow>
              <DetailRow icon={Clock} label="Last Updated">
                {formatDate(application.dateUpdated)}
              </DetailRow>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link href="/dashboard/applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
      </div>

      {/* Interview Dialog */}
      <AddNewInterview
        application={application}
        open={showInterviewDialog}
        onOpenChange={setShowInterviewDialog}
      />
    </div>
  );
}

export default ApplicationDetailPage;
