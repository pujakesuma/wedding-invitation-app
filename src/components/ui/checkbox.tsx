// src/components/ui/checkbox.tsx
import * as React from "react";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary",
          className
        )}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };