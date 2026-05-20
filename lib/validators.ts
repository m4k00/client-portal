import { z } from "zod";

// Step 1: Project Type
export const projectTypeSchema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
});

// Step 2: Project Details
export const projectDetailsSchema = z.object({
  description: z.string().min(20, "Please provide at least 20 characters describing your project"),
  technicalPrefs: z.string().optional(),
});

// Step 3: Budget & Timeline
export const budgetTimelineSchema = z.object({
  budgetRange: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  referralSource: z.string().optional(),
});

// Step 4: Contact Info
export const contactInfoSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  companyName: z.string().optional(),
});

// Complete form schema
export const intakeFormSchema = z.object({
  projectType: z.string().min(1),
  description: z.string().min(20),
  technicalPrefs: z.string().optional(),
  budgetRange: z.string().min(1),
  timeline: z.string().min(1),
  referralSource: z.string().optional(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  companyName: z.string().optional(),
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;

// AI Assessment Response Schema
export const aiAssessmentSchema = z.object({
  complexity_rating: z.enum(["straightforward", "moderate", "complex", "enterprise"]),
  estimated_weeks: z.string(),
  cost_tier: z.enum(["standard", "complex", "enterprise"]),
  suggested_stack: z.array(z.string()),
  key_considerations: z.array(z.string()),
});

export type AIAssessment = z.infer<typeof aiAssessmentSchema>;
