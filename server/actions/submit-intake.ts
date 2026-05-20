"use server";

import { db } from "@/server/db";
import { submissions } from "@/server/db/schema";
import { IntakeFormData, intakeFormSchema } from "@/lib/validators";
import { headers } from "next/headers";

export async function submitIntake(data: IntakeFormData) {
  try {
    // Validate input
    const validatedData = intakeFormSchema.parse(data);

    // Get IP address for rate limiting (will implement in Phase 7)
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Store submission
    const [submission] = await db
      .insert(submissions)
      .values({
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        companyName: validatedData.companyName || null,
        projectType: validatedData.projectType,
        description: validatedData.description,
        budgetRange: validatedData.budgetRange,
        timeline: validatedData.timeline,
        technicalPrefs: validatedData.technicalPrefs || null,
        referralSource: validatedData.referralSource || null,
        ipAddress,
        status: "new",
      })
      .returning();

    // TODO Phase 3: Generate AI assessment here
    // TODO Phase 7: Add rate limiting check
    // TODO Phase 7: Send email notification

    return {
      success: true,
      submissionId: submission.id,
    };
  } catch (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      error: "Failed to submit. Please try again.",
    };
  }
}
