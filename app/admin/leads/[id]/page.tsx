"use client";

import { use } from "react";
import { trpc } from "@/lib/trpc-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { ComplexityIndicator } from "@/components/shared/complexity-indicator";
import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Mail, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const utils = trpc.useUtils();

  const { data: submission, isLoading } = trpc.submissions.getById.useQuery({ id });
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Update local state when data loads
  if (submission && !adminNotes && submission.adminNotes) {
    setAdminNotes(submission.adminNotes);
  }
  if (submission && !selectedStatus) {
    setSelectedStatus(submission.status);
  }

  const updateNotesMutation = trpc.submissions.updateNotes.useMutation({
    onSuccess: () => {
      utils.submissions.getById.invalidate({ id });
      toast.success("Notes saved");
    },
  });

  const updateStatusMutation = trpc.submissions.updateStatus.useMutation({
    onSuccess: () => {
      utils.submissions.getById.invalidate({ id });
      utils.submissions.getAll.invalidate();
      utils.submissions.getStats.invalidate();
      toast.success("Status updated");
    },
  });

  const handleSaveNotes = () => {
    updateNotesMutation.mutate({ id, adminNotes });
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    updateStatusMutation.mutate({
      id,
      status: newStatus as "new" | "reviewed" | "contacted" | "archived",
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!submission) {
    return <p>Submission not found</p>;
  }

  const assessment = submission.assessment;
  const suggestedStack = assessment
    ? (JSON.parse(assessment.suggestedStack) as string[])
    : [];
  const keyConsiderations = assessment
    ? (JSON.parse(assessment.keyConsiderations) as string[])
    : [];

  return (
    <div>
      <Link href="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{submission.clientName}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4" />
              {submission.clientEmail}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={submission.status} />
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assessment */}
        {assessment && (
          <Card>
            <CardHeader>
              <CardTitle>AI Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Complexity:
                  </span>
                  <ComplexityIndicator rating={assessment.complexityRating} />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{assessment.estimatedWeeks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tier:
                  </span>
                  <span className="text-sm capitalize">{assessment.costTier}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Suggested Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedStack.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Key Considerations
                </p>
                <ul className="space-y-2">
                  {keyConsiderations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Project Type</p>
              <p className="capitalize">{submission.projectType.replace("-", " ")}</p>
            </div>
            <Separator />
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
              {submission.companyName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm">{submission.companyName}</p>
                </div>
              )}
              {submission.referralSource && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Referral Source
                  </p>
                  <p className="text-sm capitalize">
                    {submission.referralSource.replace("-", " ")}
                  </p>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Submitted {format(new Date(submission.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Private Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your notes about this lead..."
                className="mt-2 min-h-[120px]"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSaveNotes}
              disabled={updateNotesMutation.isPending}
            >
              {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
