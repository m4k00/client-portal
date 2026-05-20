import { db } from "@/server/db";
import { submissions, assessments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ComplexityIndicator } from "@/components/shared/complexity-indicator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, CheckCircle2, Mail } from "lucide-react";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch submission with assessment
  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
    with: {
      assessment: true,
    },
  });

  if (!submission) {
    notFound();
  }

  const assessment = submission.assessment;

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
        <div className="container max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Assessment is being generated... Please refresh in a moment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const suggestedStack = JSON.parse(assessment.suggestedStack) as string[];
  const keyConsiderations = JSON.parse(assessment.keyConsiderations) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Project Assessment</h1>
          <p className="text-muted-foreground">
            AI-generated scope analysis for {submission.clientName}
          </p>
        </div>

        {/* Complexity Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Project Complexity</span>
              <ComplexityIndicator rating={assessment.complexityRating} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Estimated Timeline
                  </p>
                  <p className="text-lg font-semibold">{assessment.estimatedWeeks}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cost Tier
                  </p>
                  <p className="text-lg font-semibold capitalize">{assessment.costTier}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Submitted
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Stack */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recommended Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestedStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Considerations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Key Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {keyConsiderations.map((consideration, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Project Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </p>
              <p className="text-sm whitespace-pre-wrap">{submission.description}</p>
            </div>
            {submission.technicalPrefs && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Technical Preferences
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {submission.technicalPrefs}
                  </p>
                </div>
              </>
            )}
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                <p className="text-sm">{submission.budgetRange}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                <p className="text-sm">{submission.timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90">
              Let's discuss your project in detail and create a customized proposal.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-primary"
            >
              <a href="mailto:hello@example.com?subject=Project Discussion - {submission.clientName}">
                Schedule a Call
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          This assessment was generated using AI and serves as an initial estimate.
          Final scope and pricing will be determined during our consultation.
        </p>
      </div>
    </div>
  );
}
