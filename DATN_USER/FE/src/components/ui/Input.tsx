import * as React from "react";
import { cn } from "../../systems/utils/uploadImage";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "block pl-3 flex-1 w-96 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400   focus:outline-none focus:border-0 sm:text-sm sm:leading-6",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
