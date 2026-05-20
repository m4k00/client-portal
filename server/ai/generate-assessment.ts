import Anthropic from "@anthropic-ai/sdk";
import { SCOPE_ASSESSMENT_SYSTEM_PROMPT } from "./prompts";
import { AIAssessment, aiAssessmentSchema } from "@/lib/validators";
import { IntakeFormData } from "@/lib/validators";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

export async function generateAssessment(
  submissionData: IntakeFormData
): Promise<{
  success: boolean;
  assessment?: AIAssessment;
  rawResponse?: string;
  error?: string;
}> {
  try {
    // Format the project data for Claude
    const projectDescription = `
PROJECT TYPE: ${submissionData.projectType}

DESCRIPTION:
${submissionData.description}

${submissionData.technicalPrefs ? `TECHNICAL PREFERENCES:\n${submissionData.technicalPrefs}\n` : ""}

BUDGET RANGE: ${submissionData.budgetRange}
TIMELINE EXPECTATION: ${submissionData.timeline}

Analyze this project and provide a scope assessment as JSON.
    `.trim();

    // Call Claude API
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: SCOPE_ASSESSMENT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: projectDescription,
        },
      ],
    });

    // Extract the response text
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    if (!responseText) {
      return {
        success: false,
        error: "No response from AI",
      };
    }

    // Try to parse JSON from the response
    let jsonData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      jsonData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      return {
        success: false,
        rawResponse: responseText,
        error: "Failed to parse AI response as JSON",
      };
    }

    // Validate against schema
    const validationResult = aiAssessmentSchema.safeParse(jsonData);

    if (!validationResult.success) {
      console.error("AI response validation failed:", validationResult.error);
      return {
        success: false,
        rawResponse: responseText,
        error: "AI response doesn't match expected format",
      };
    }

    return {
      success: true,
      assessment: validationResult.data,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error("Assessment generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
