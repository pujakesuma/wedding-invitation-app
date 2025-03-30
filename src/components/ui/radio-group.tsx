import * as React from "react";
import { cn } from "@/lib/utils/cn";

type RadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

interface RadioItemElement extends React.ReactElement {
  props: {
    value: string;
    [key: string]: unknown;
  };
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    const handleChildChange = (childValue: string) => {
      if (onValueChange) {
        onValueChange(childValue);
      }
    };

    // Clone children and add selected state and onChange handler
    const enhancedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      const childElement = child as RadioItemElement;
      return React.cloneElement(childElement, {
        checked: childElement.props.value === value,
        onChange: () => handleChildChange(childElement.props.value),
      });
    });

    return (
      <div 
        ref={ref} 
        className={cn("grid gap-2", className)}
        role="radiogroup"
        {...props}
      >
        {enhancedChildren}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

type RadioGroupItemProps = {
  value: string;
  id?: string;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
};

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, checked, onChange, ...props }, ref) => {
    return (
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem }; 