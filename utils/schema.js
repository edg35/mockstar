import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const JobApplications = pgTable("jobApplications", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  companyName: varchar("companyName").notNull(),
  jobTitle: varchar("jobTitle").notNull(),
  jobDescription: text("jobDescription"),
  jobUrl: varchar("jobUrl"),
  location: varchar("location"),
  salary: varchar("salary"),
  applicationStatus: varchar("applicationStatus").default("wishlist").notNull(),
  dateApplied: timestamp("dateApplied"),
  dateAdded: timestamp("dateAdded").defaultNow().notNull(),
  dateUpdated: timestamp("dateUpdated").defaultNow().notNull(),
  notes: text("notes"),
  priority: integer("priority"),
  contactPerson: varchar("contactPerson"),
  contactEmail: varchar("contactEmail"),
});

export const InterviewSessions = pgTable("interviewSessions", {
  id: serial("id").primaryKey(),
  applicationId: integer("applicationId")
    .references(() => JobApplications.id)
    .notNull(),
  userId: varchar("userId").notNull(),
  scheduledDate: timestamp("scheduledDate").notNull(),
  interviewType: varchar("interviewType").notNull(),
  status: varchar("status").default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  notes: text("notes"),
});

export const Documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  applicationId: integer("applicationId")
    .references(() => JobApplications.id)
    .notNull(),
  documentType: varchar("documentType").notNull(),
  fileName: varchar("fileName").notNull(),
  fileUrl: varchar("fileUrl").notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export const ActivityLog = pgTable("activityLog", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  applicationId: integer("applicationId")
    .references(() => JobApplications.id)
    .notNull(),
  activityType: varchar("activityType").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockRes: text("jsonMockRes").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDescription: varchar("jobDescription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  mockId: varchar("mockId").notNull(),
  applicationId: integer("applicationId")
    .references(() => JobApplications.id)
    .notNull(),
});

export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockId: varchar("mockId").notNull(),
  question: varchar("question").notNull(),
  correctAnswer: text("correctAnswer").notNull(),
  userAnswer: text("userAnswer").notNull(),
  rating: varchar("rating").notNull(),
  feedback: text("feedback").notNull(),
  userEmail: varchar("userEmail").notNull(),
  createdAt: varchar("createdAt").notNull(),
});
