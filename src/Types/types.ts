// types.ts
import { ChangeEvent, ReactNode } from "react";
import {
  LinearProgressProps,
  PasswordInputProps,
  Translate,
  ValidationErrorMessage,
} from "react-admin";

export const DEFAULT_DEBOUNCE = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds
// export type FieldError = {
//   error?: boolean;
//   message?: string;
// };
// export type MsgObj = {
//   message: string;
//   args?: object;
// };

export type FieldError = {
  invalid: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: ValidationErrorMessage | any;
  feedbackMsg?: string;
  score?: number;
  args?: object;
};

export type Memoize = <T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: any[]) => any,
) => T;

export type MessageFunc = (
  params: MessageFuncParams,
) => AsyncValidationErrorMessage;
interface MessageFuncParams {
  args: any;
  value: any;
  values: any;
}

export interface GetEndAdornmentParams {
  props: IconTextInputProps;
  classess: {
    clearIcon: string;
    visibleClearIcon: string;
    clearButton: string;
    selectAdornment: string;
    inputAdornedEnd: string;
  };
  endAdornment?: React.ReactNode;
  translate: Translate;
  handleClickClearButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleMouseDownClearButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export type UseFieldOptions = {
  // resource?: string;
  source?: string;
  message?: string;
  debounce?: number;
  translate?: Translate;
  // timeOut?: MutableRefObject<NodeJS.Timeout | undefined>;
  // abortController?: MutableRefObject<AbortController | null>;
  options?: { endpoint?: string; successMessage?: string };
};

// New type that includes isRequired
export type AsyncValidationErrorMessage = ValidationErrorMessage & {
  isRequired?: boolean;
  status?: boolean | number;
};

export type zxcvbnFeedBack = {
  score: number;
  feedbackMsg: string;
  warning?: string;
};

export type PasswordFieldProps = {
  className: string;
  iconStart: ReactNode;
  password: string;
  rePassword: string;
};

// export type ValidationResult =
//   | string
//   | { message: string; args?: Record<string, any> }
//   | undefined;
// export type ValidationResult1 = {
//   status: "success" | "error" | "pending";
//   message?: string;
// };
export interface IconTextInputProps extends PasswordInputProps {
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  isValidating?: boolean;
  isSuccess?: boolean;
  isFocused?: boolean;
  isPassword?: boolean;
  helper?: boolean;
  isVisible?: boolean;
  togglePassword?: (event: TogglePasswordEvent) => void;
  toggleTouchStartPassword?: [];
  toggleMouseDownPassword?: [];
  strengthMeter?: boolean;
  passwordValue?: string; // Props for RepasswordInput to receive the password field value
}

export type TogglePasswordEvent =
  | React.MouseEvent<HTMLElement>
  | React.TouchEvent<HTMLElement>
  | React.KeyboardEvent<HTMLElement>;

export interface PasswordStrengthMeterProps {
  passwordStrength: number;
  passwordFeedback: string;
}

export interface LinearProgressWithLabelProps extends LinearProgressProps {
  strength: number;
  value: number;
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

export interface ArrayLike {
  length: number;
}

/**
 * A custom function to determine if an object is empty.
 * This function is called after standard checks for Maps, Sets, ArrayBuffers,
 * but before checks for plain objects or array-like objects.
 * @param value - The object value to check.
 * @returns `true` if the custom logic considers the value empty, `false` otherwise.
 */
export interface IsEmptyOptions {
  customIsEmpty?: (value: object) => boolean;
}

export interface WithIsEmpty {
  isEmpty(): boolean;
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
