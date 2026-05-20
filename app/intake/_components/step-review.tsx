"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IntakeFormData } from "@/lib/validators";
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINE_OPTIONS, REFERRAL_SOURCES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

interface StepReviewProps {
  data: IntakeFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepReview({ data, onBack, onSubmit, isSubmitting }: StepReviewProps) {
  const projectType = PROJECT_TYPES.find((t) => t.value === data.projectType);
  const budgetRange = BUDGET_RANGES.find((b) => b.value === data.budgetRange);
  const timeline = TIMELINE_OPTIONS.find((t) => t.value === data.timeline);
  const referral = REFERRAL_SOURCES.find((r) => r.value === data.referralSource);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Review Your Submission</h2>
        <p className="text-muted-foreground mt-2">
          Please review your information before submitting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Project Type</p>
            <p className="text-lg">
              {projectType?.icon} {projectType?.label}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">{data.description}</p>
          </div>
          {data.technicalPrefs && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Technical Preferences
                </p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{data.technicalPrefs}</p>
              </div>
            </>
          )}
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Budget</p>
              <p>{budgetRange?.label}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Timeline</p>
              <p>{timeline?.label}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{data.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{data.clientEmail}</p>
            </div>
          </div>
          {data.companyName && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <p>{data.companyName}</p>
              </div>
            </>
          )}
          {data.referralSource && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  How you found us
                </p>
                <p>{referral?.label}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={onSubmit} size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Assessment...
            </>
          ) : (
            "Submit & Get Assessment"
          )}
        </Button>
      </div>
    </div>
  );
}
