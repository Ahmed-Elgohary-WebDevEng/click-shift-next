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
        className="peer relative appearance-none shrink-0 w-6 h-6 "
        type="checkbox"
        id={id}
        {...otherProps}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6 absolute pointer-events-none stroke-white fill-gray-400 dark:fill-gray-bold peer-checked:!hidden "
      >
        <g clipPath="url(#clip0_1_8118)">
          <path
            d="M11.0002 20.1666C5.93741 20.1666 1.8335 16.0627 1.8335 10.9999C1.8335 5.93717 5.93741 1.83325 11.0002 1.83325C16.0629 1.83325 20.1668 5.93717 20.1668 10.9999C20.1668 16.0627 16.0629 20.1666 11.0002 20.1666ZM11.0002 18.3333C12.9451 18.3333 14.8103 17.5606 16.1856 16.1854C17.5609 14.8101 18.3335 12.9448 18.3335 10.9999C18.3335 9.055 17.5609 7.18974 16.1856 5.81447C14.8103 4.4392 12.9451 3.66659 11.0002 3.66659C9.05524 3.66659 7.18998 4.4392 5.81471 5.81447C4.43945 7.18974 3.66683 9.055 3.66683 10.9999C3.66683 12.9448 4.43945 14.8101 5.81471 16.1854C7.18998 17.5606 9.05524 18.3333 11.0002 18.3333Z"
            fill="#A0A09C"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_8118">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <svg
        className="h-6 w-6 absolute pointer-events-none stroke-white fill-none peer-checked:!fill-red-500 !hidden peer-checked:!block dark:peer-checked:!fill-white"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M10.0002 19.1666C4.93741 19.1666 0.833496 15.0627 0.833496 9.99992C0.833496 4.93717 4.93741 0.833252 10.0002 0.833252C15.0629 0.833252 19.1668 4.93717 19.1668 9.99992C19.1668 15.0627 15.0629 19.1666 10.0002 19.1666ZM9.08625 13.6666L15.5671 7.18484L14.2709 5.88867L9.08625 11.0743L6.493 8.481L5.19683 9.77717L9.08625 13.6666Z" />
      </svg>
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
