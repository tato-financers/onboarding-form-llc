export function OnboardingNavbar() {
  return (
    <nav className="w-full bg-[#023e80]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <img src="/financers-logo.svg" alt="FINANCERS" className="h-8 w-auto" />
          </div>
          <div className="hidden sm:block text-white font-medium">Formulario de incorporación</div>
        </div>
      </div>
    </nav>
  )
}
