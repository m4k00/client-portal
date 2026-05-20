"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IntakeFormData, projectDetailsSchema } from "@/lib/validators";
import { useState } from "react";

interface StepDetailsProps {
  data: Partial<IntakeFormData>;
  onUpdate: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDetails({ data, onUpdate, onNext, onBack }: StepDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = projectDetailsSchema.safeParse({
      description: data.description,
      technicalPrefs: data.technicalPrefs,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Tell us about your project</h2>
        <p className="text-muted-foreground mt-2">
          The more details you provide, the better we can assess your needs
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what you want to build, who it's for, and what problems it solves..."
            className="mt-2 min-h-[150px]"
            value={data.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <Label htmlFor="technicalPrefs">
            Technical Preferences (Optional)
          </Label>
          <Textarea
            id="technicalPrefs"
            placeholder="Any specific technologies, platforms, or integrations you need? (e.g., 'Must integrate with Stripe', 'Need mobile app support')"
            className="mt-2"
            value={data.technicalPrefs || ""}
            onChange={(e) => onUpdate({ technicalPrefs: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
