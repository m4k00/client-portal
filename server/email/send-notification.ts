import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationData {
  submissionId: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  complexityRating?: string;
}

export async function sendAdminNotification(data: NotificationData) {
  if (!process.env.ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL not set, skipping email notification");
    return { success: false, error: "ADMIN_EMAIL not configured" };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email notification");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const detailUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/admin/leads/${data.submissionId}`;

  try {
    await resend.emails.send({
      from: "Client Portal <notifications@yourdomain.com>",
      to: process.env.ADMIN_EMAIL,
      subject: `New Project Submission: ${data.clientName}`,
      text: `
New Project Submission

Client: ${data.clientName}
Email: ${data.clientEmail}
Project Type: ${data.projectType}
${data.complexityRating ? `Complexity: ${data.complexityRating}` : ""}

View full details:
${detailUrl}
      `.trim(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
