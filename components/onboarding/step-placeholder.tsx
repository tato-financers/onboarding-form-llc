import { Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StepPlaceholderProps {
  stepNumber: number
  title: string
  description: string
}

export function StepPlaceholder({ stepNumber, title, description }: StepPlaceholderProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Paso {stepNumber}: {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Completa los pasos anteriores para desbloquear esta sección
        </p>
      </CardContent>
    </Card>
  )
}
