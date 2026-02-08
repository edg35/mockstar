"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "Wishlist", value: "wishlist" },
  { label: "Applied", value: "applied" },
  { label: "Phone Screen", value: "phone_screen" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().optional().default(""),
  jobUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  location: z.string().optional().default(""),
  salary: z.string().optional().default(""),
  applicationStatus: z.string().default("wishlist"),
  priority: z.number().min(0).max(5).default(0),
  contactPerson: z.string().optional().default(""),
  contactEmail: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional().default(""),
  dateApplied: z.string().optional().default(""),
});

function ApplicationForm({ onSubmit, onCancel, initialData = null }) {
  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      companyName: initialData?.companyName ?? "",
      jobTitle: initialData?.jobTitle ?? "",
      jobDescription: initialData?.jobDescription ?? "",
      jobUrl: initialData?.jobUrl ?? "",
      location: initialData?.location ?? "",
      salary: initialData?.salary ?? "",
      applicationStatus: initialData?.applicationStatus ?? "wishlist",
      priority: initialData?.priority ?? 0,
      contactPerson: initialData?.contactPerson ?? "",
      contactEmail: initialData?.contactEmail ?? "",
      notes: initialData?.notes ?? "",
      dateApplied: initialData?.dateApplied
        ? new Date(initialData.dateApplied).toISOString().split("T")[0]
        : "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleFormSubmit(data) {
    await onSubmit(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Company & Job Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Frontend Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Job URL & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jobUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/job/123"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Salary & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $120k - $150k" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Priority & Date Applied */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority: {field.value}/5</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={([val]) => field.onChange(val)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateApplied"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Applied</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Person & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g. jane@acme.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Job Description */}
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste or type the job description..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any notes about this application..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ApplicationForm;
