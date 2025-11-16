"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RadioGroupCustomProps {
  label: string
  options: string[]
  selected: string
  onChange: (value: string) => void
  required?: boolean
}

export function RadioGroupCustom({
  label,
  options,
  selected,
  onChange,
  required = false
}: RadioGroupCustomProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <RadioGroup value={selected} onValueChange={onChange}>
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}