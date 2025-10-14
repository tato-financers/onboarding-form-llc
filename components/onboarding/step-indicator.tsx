import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  completedSteps: number[]
  steps: { number: number; label: string }[]
}

export function StepIndicator({ currentStep, completedSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full flex items-center gap-4">
      {/* Progress bar with sections */}
      <div className="flex-1 flex items-center gap-1">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              currentStep === step.number && "bg-primary",
              completedSteps.includes(step.number) && currentStep !== step.number && "bg-primary/60",
              !completedSteps.includes(step.number) && currentStep !== step.number && "bg-border",
            )}
          />
        ))}
      </div>

      {/* Step counter */}
      <div className="text-sm font-medium text-muted-foreground whitespace-nowrap data-hj-allow">
        {currentStep}/{steps.length}
      </div>
    </div>
  )
}
