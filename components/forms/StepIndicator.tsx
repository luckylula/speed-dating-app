interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${
              index + 1 === currentStep
                ? "text-pink-600 font-semibold"
                : index + 1 < currentStep
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            <div className="text-xs sm:text-sm">{title}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index + 1 <= currentStep
                ? "bg-pink-600"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="text-center mt-2 text-sm text-gray-600">
        Paso {currentStep} de {totalSteps}
      </div>
    </div>
  )
}