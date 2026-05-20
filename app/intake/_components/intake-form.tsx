"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepProjectType } from "./step-project-type";
import { StepDetails } from "./step-details";
import { StepBudget } from "./step-budget";
import { StepContact } from "./step-contact";
import { StepReview } from "./step-review";
import { submitIntake } from "@/server/actions/submit-intake";
import { IntakeFormData } from "@/lib/validators";
import { toast } from "sonner";

export function IntakeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IntakeFormData>>({});

  const totalSteps = 5;

  const updateFormData = (data: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitIntake(formData as IntakeFormData);
      
      if (result.success && result.submissionId) {
        router.push(`/assessment/${result.submissionId}`);
      } else {
        toast.error(result.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {currentStep === 1 && (
        <StepProjectType
          data={formData}
          onUpdate={updateFormData}
          onNext={nextStep}
        />
      )}
      {currentStep === 2 && (
        <StepDetails
          data={formData}
          onUpdate={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {currentStep === 3 && (
        <StepBudget
          data={formData}
          onUpdate={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {currentStep === 4 && (
        <StepContact
          data={formData}
          onUpdate={updateFormData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {currentStep === 5 && (
        <StepReview
          data={formData as IntakeFormData}
          onBack={prevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
