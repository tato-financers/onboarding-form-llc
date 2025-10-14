import { CheckCircle } from "lucide-react"

export default function ThanksPage() {
  return (
    <div className="text-center py-8">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-accent/10 p-3">
          <CheckCircle className="h-16 w-16 text-accent" />
        </div>
      </div>
      <h2 className="mb-3 text-xl font-semibold text-foreground text-balance">¡Gracias por completar el formulario!</h2>
      <p className="text-muted-foreground">
        Hemos recibido tu información. Nos pondremos en contacto contigo pronto para continuar con el proceso de
        incorporación.
      </p>
    </div>
  )
}
