// types.ts
import { ChangeEvent, ReactNode } from "react";
import { PasswordInputProps } from "react-admin";

export interface IconTextInputProps extends PasswordInputProps {
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  strengthMeter?: boolean;
  passwordValue?: string; // Props for RepasswordInput to receive the password field value
}

export interface PasswordStrengthMeterProps {
  passwordStrength: number;
  passwordFeedback: string;
  value: string;
}

// export interface PasswordValidationResults {
//   visible: boolean;
//   value: string;
//   focused: boolean;
//   shake: boolean;
//   validateError: boolean;
//   errMessage: string;
//   passwordStrength: number;
//   passwordFeedback: string;
//   handleClick: () => void;
//   handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   handleFocus: () => void;
//   handleBlur: () => void;
// }

// types.ts
export interface PasswordValidationResults {
  // Remove validateError and errMessage from here
  visible: boolean;
  value: string;
  focused: boolean;
  shake: boolean;
  passwordStrength: number;
  passwordFeedback: string;
  handleClick: () => void;
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

// export interface PasswordInputUIProps extends IconTextInputProps {
//   id?: string;
//   validateError: boolean;
//   errMessage: string;
//   // Add validation results as a separate prop
//   validation: Omit<PasswordValidationResults, "value">;
// }

// export interface PasswordInputUIProps extends IconTextInputProps {
//   id?: string;
//   focused: boolean;
//   value: string;
//   shake: boolean;
//   visible: boolean;
//   validateError: boolean;
//   errMessage: string;
//   // Add validation results as a separate prop
//   validation: Omit<PasswordValidationResults, "value">;
//   handleClick: () => void;
//   handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   handleFocus: () => void;
//   handleBlur: () => void;
// }

// export interface IconTextInputProps {
//   className?: string;
//   defaultValue?: any;
//   label?: string | boolean;
//   format?: (value: any) => any;
//   onBlur?: (e: React.FocusEvent) => void;
//   onChange?: (e: React.ChangeEvent | any) => void;
//   parse?: (value: any) => any;
//   resource?: string;
//   source?: string;
//   validate?: any;
//   iconStart?: ReactNode;
//   initiallyVisible?: boolean;
//   strengthMeter?: boolean;
//   passwordValue?: string;
// }

// export interface PasswordInputUIProps {
//   id?: string;
//   field: UseInputValue["field"];
//   source?: string;
//   className?: string;
//   iconStart?: ReactNode;
//   label?: string | boolean;
//   isRequired?: boolean;
//   focused: boolean;
//   value: string;
//   shake: boolean;
//   visible: boolean;
//   validateError: boolean;
//   errMessage: string;
//   handleClick: () => void;
//   handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   handleFocus: () => void;
//   handleBlur: () => void;
//   [key: string]: any;
// }

// 1. types.ts
export interface PasswordValidationState {
  visible: boolean;
  value: string;
  focused: boolean;
  shake: boolean;
  strength: number;
  feedback: string;
}

export interface PasswordInputUIProps {
  id?: string;
  source: string;
  label?: string | boolean;
  className?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  error: boolean;
  helperText: string;
  validation: {
    visible: boolean;
    focused: boolean;
    shake: boolean;
    handleVisibility: () => void;
    handleFocus: () => void;
    handleBlur: () => void;
  };
  strengthMeter?: boolean;
  strength?: number;
  feedback?: string;
}
