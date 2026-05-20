"use server";

import { db } from "@/server/db";
import { submissions, assessments } from "@/server/db/schema";
import { IntakeFormData, intakeFormSchema } from "@/lib/validators";
import { headers } from "next/headers";
import { generateAssessment } from "@/server/ai/generate-assessment";

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

    // Generate AI assessment
    const assessmentResult = await generateAssessment(validatedData);

    if (!assessmentResult.success) {
      console.error("AI assessment failed:", assessmentResult.error);
      // Continue anyway - we have the submission, can generate assessment later
    } else if (assessmentResult.assessment) {
      // Store the assessment
      await db.insert(assessments).values({
        submissionId: submission.id,
        complexityRating: assessmentResult.assessment.complexity_rating,
        estimatedWeeks: assessmentResult.assessment.estimated_weeks,
        costTier: assessmentResult.assessment.cost_tier,
        suggestedStack: JSON.stringify(assessmentResult.assessment.suggested_stack),
        keyConsiderations: JSON.stringify(assessmentResult.assessment.key_considerations),
        fullResponse: assessmentResult.rawResponse || "",
        modelUsed: "claude-sonnet-4-20250514",
      });
    }

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
