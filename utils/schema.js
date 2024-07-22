import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockRes: text("jsonMockRes").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDescription: varchar("jobDescription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  mockId: varchar("mockId").notNull(),
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

// TODO: make and eport schema to db for cover letters

export const CoverLetter = pgTable("coverLetter", {
  id: serial("id").primaryKey(),
  jsonCoverLetter: text("jsonCoverLetter").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDescription: varchar("jobDescription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  userEmail: varchar("userEmail").notNull(),
  createdAt: varchar("createdAt").notNull(),
  letterId: varchar("letterId").notNull(),
});
