import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Admin Users table
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  projectType: varchar("project_type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  budgetRange: varchar("budget_range", { length: 50 }).notNull(),
  timeline: varchar("timeline", { length: 50 }).notNull(),
  technicalPrefs: text("technical_prefs"),
  referralSource: varchar("referral_source", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  adminNotes: text("admin_notes"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessments table
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .unique()
    .references(() => submissions.id, { onDelete: "cascade" }),
  complexityRating: varchar("complexity_rating", { length: 20 }).notNull(),
  estimatedWeeks: varchar("estimated_weeks", { length: 20 }).notNull(),
  costTier: varchar("cost_tier", { length: 20 }).notNull(),
  suggestedStack: text("suggested_stack").notNull(), // JSON array stored as text
  keyConsiderations: text("key_considerations").notNull(), // JSON array stored as text
  fullResponse: text("full_response").notNull(),
  modelUsed: varchar("model_used", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const submissionsRelations = relations(submissions, ({ one }) => ({
  assessment: one(assessments, {
    fields: [submissions.id],
    references: [assessments.submissionId],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  submission: one(submissions, {
    fields: [assessments.submissionId],
    references: [submissions.id],
  }),
}));
