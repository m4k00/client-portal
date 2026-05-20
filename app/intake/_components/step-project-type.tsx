"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROJECT_TYPES } from "@/lib/constants";
import { IntakeFormData, projectTypeSchema } from "@/lib/validators";
import { useState } from "react";

interface StepProjectTypeProps {
  data: Partial<IntakeFormData>;
  onUpdate: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
}

export function StepProjectType({ data, onUpdate, onNext }: StepProjectTypeProps) {
  const [error, setError] = useState("");

  const handleSelect = (projectType: string) => {
    onUpdate({ projectType });
    setError("");
  };

  const handleNext = () => {
    const result = projectTypeSchema.safeParse({ projectType: data.projectType });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">What type of project do you need?</h2>
        <p className="text-muted-foreground mt-2">
          Select the option that best describes your project
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PROJECT_TYPES.map((type) => (
          <Card
            key={type.value}
            className={`cursor-pointer transition-all hover:border-primary ${
              data.projectType === type.value
                ? "border-primary bg-primary/5"
                : ""
            }`}
            onClick={() => handleSelect(type.value)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{type.icon}</span>
                <div>
                  <h3 className="font-semibold">{type.label}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleNext} size="lg" className="w-full md:w-auto">
        Continue
      </Button>
    </div>
  );
}
