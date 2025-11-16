"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CheckboxGroupProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  required?: boolean
}

export function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  required = false
}: CheckboxGroupProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, option])
    } else {
      onChange(selected.filter(item => item !== option))
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selected.includes(option)}
              onCheckedChange={(checked) => 
                handleChange(option, checked as boolean)
              }
            />
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}