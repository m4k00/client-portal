"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IntakeFormData, contactInfoSchema } from "@/lib/validators";
import { useState } from "react";

interface StepContactProps {
  data: Partial<IntakeFormData>;
  onUpdate: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepContact({ data, onUpdate, onNext, onBack }: StepContactProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = contactInfoSchema.safeParse({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      companyName: data.companyName,
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
        <h2 className="text-3xl font-bold">Let's get in touch</h2>
        <p className="text-muted-foreground mt-2">
          Almost done! Just need your contact information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="clientName">Your Name *</Label>
          <Input
            id="clientName"
            type="text"
            placeholder="John Doe"
            className="mt-2"
            value={data.clientName || ""}
            onChange={(e) => onUpdate({ clientName: e.target.value })}
          />
          {errors.clientName && (
            <p className="text-sm text-destructive mt-1">{errors.clientName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="clientEmail">Email Address *</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="john@example.com"
            className="mt-2"
            value={data.clientEmail || ""}
            onChange={(e) => onUpdate({ clientEmail: e.target.value })}
          />
          {errors.clientEmail && (
            <p className="text-sm text-destructive mt-1">{errors.clientEmail}</p>
          )}
        </div>

        <div>
          <Label htmlFor="companyName">Company Name (Optional)</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Acme Inc."
            className="mt-2"
            value={data.companyName || ""}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} size="lg">
          Review & Submit
        </Button>
      </div>
    </div>
  );
}
