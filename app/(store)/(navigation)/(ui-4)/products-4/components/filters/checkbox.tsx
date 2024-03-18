import { InputHTMLAttributes, useId } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  defaultChecked?: boolean;
  label?: string;
}

export const Checkbox = ({ label, ...otherProps }: CheckboxProps) => {
  const id = useId();

  return (
    <div className="w-full flex gap-2">
      <input
        className="peer relative shrink-0 w-5 h-5 accent-primary text-white"
        type="checkbox"
        id={id}
        {...otherProps}
      />

      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
