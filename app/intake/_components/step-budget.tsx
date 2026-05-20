"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUDGET_RANGES, TIMELINE_OPTIONS, REFERRAL_SOURCES } from "@/lib/constants";
import { IntakeFormData, budgetTimelineSchema } from "@/lib/validators";
import { useState } from "react";

interface StepBudgetProps {
  data: Partial<IntakeFormData>;
  onUpdate: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBudget({ data, onUpdate, onNext, onBack }: StepBudgetProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = budgetTimelineSchema.safeParse({
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      referralSource: data.referralSource,
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
        <h2 className="text-3xl font-bold">Budget & Timeline</h2>
        <p className="text-muted-foreground mt-2">
          Help us understand your constraints and expectations
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="budgetRange">What's your budget range? *</Label>
          <Select
            value={data.budgetRange}
            onValueChange={(value) => onUpdate({ budgetRange: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetRange && (
            <p className="text-sm text-destructive mt-1">{errors.budgetRange}</p>
          )}
        </div>

        <div>
          <Label htmlFor="timeline">When do you need this delivered? *</Label>
          <Select
            value={data.timeline}
            onValueChange={(value) => onUpdate({ timeline: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a timeline" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && (
            <p className="text-sm text-destructive mt-1">{errors.timeline}</p>
          )}
        </div>

        <div>
          <Label htmlFor="referralSource">How did you find me? (Optional)</Label>
          <Select
            value={data.referralSource}
            onValueChange={(value) => onUpdate({ referralSource: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a source" />
            </SelectTrigger>
            <SelectContent>
              {REFERRAL_SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
