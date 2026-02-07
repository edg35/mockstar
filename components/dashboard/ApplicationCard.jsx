"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Star, Eye, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  wishlist: { label: "Wishlist", bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  applied: { label: "Applied", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  phone_screen: { label: "Phone Screen", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  interview: { label: "Interview", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  offer: { label: "Offer", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function getDaysText(application) {
  if (application.applicationStatus === "wishlist" && !application.dateApplied) {
    return "Added to wishlist";
  }
  const reference = application.dateApplied || application.dateAdded;
  const days = Math.floor(
    (Date.now() - new Date(reference).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "Applied today";
  if (days === 1) return "Applied 1 day ago";
  return `Applied ${days} days ago`;
}

function PriorityStars({ priority }) {
  const level = Math.max(0, Math.min(5, priority || 0));
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < level
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function ApplicationCard({ application, onStatusUpdate }) {
  const router = useRouter();
  const status = STATUS_CONFIG[application.applicationStatus] || STATUS_CONFIG.wishlist;

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
      onClick={() => router.push(`/dashboard/applications/${application.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-base leading-tight truncate">
              {application.companyName}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {application.jobTitle}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${status.bg} ${status.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-2">
        {application.location && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
        )}

        {application.salary && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{application.salary}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <PriorityStars priority={application.priority} />
          <span className="text-xs text-muted-foreground">
            {getDaysText(application)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/applications/${application.id}`);
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Details
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate?.(application);
          }}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Status
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ApplicationCard;
