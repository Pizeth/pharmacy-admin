import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { InputAdornment, IconButton, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FieldTitle,
  useTranslate,
  sanitizeInputRestProps,
  isEmpty,
  useInput,
} from "react-admin";
import { clsx } from "clsx";
import { IconTextInputProps } from "../Types/types";
import { useMatchPassword, usePasswordValidator } from "./validator";
import ResettableIconInputField from "./ResettableIconInputField";
import { InputHelper } from "../CustomComponents/InputHelper";
import PasswordStrengthMeter from "../CustomComponents/PasswordStrengthMeter";

export const PasswordValidationInput = (props: IconTextInputProps) => {
  const {
    className,
    defaultValue,
    label,
    helperText,
    format,
    onBlur,
    onChange,
    parse,
    resource,
    source,
    validate = [],
    initiallyVisible = false,
    strengthMeter = false,
    ...rest
  } = props;

  const translate = useTranslate();

  // Use refs for transient UI states
  const initialValueRef = useRef("");
  const inputRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLLabelElement | null>(null); // Ref for shake effect
  const { clearErrors } = useFormContext();

  // Get required and password validators
  const matchPassword = useMatchPassword();
  const { passwordValidator, result } = usePasswordValidator();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(initiallyVisible);

  // Compute validators with normalization
  const validators = useMemo(() => {
    const normalizedValidate = Array.isArray(validate) ? validate : [validate];
    const baseValidators = [...normalizedValidate];
    baseValidators.push(strengthMeter ? passwordValidator() : matchPassword());
    return baseValidators;
  }, [validate, strengthMeter]);

  const {
    field,
    fieldState: { invalid, error, isValidating },
    id,
    isRequired,
  } = useInput({
    defaultValue,
    format,
    parse,
    resource,
    source,
    type: "text",
    validate: validators,
    onBlur,
    onChange,
    ...rest,
  });

  // Handle shake effect without useState
  useEffect(() => {
    if (!isValidating && invalid && inputRef.current) {
      shakeRef.current = inputRef.current.querySelector(".MuiInputLabel-root");
      if (shakeRef.current) {
        shakeRef.current.classList.add("shake");
        setTimeout(() => {
          if (shakeRef.current) {
            shakeRef.current.classList.remove("shake");
          }
        }, 500); // Matches animation duration
      }
    } else {
      // clearErrors(source);
    }
  }, [isValidating, invalid, source, clearErrors]);

  const handleClick = () => setVisible(!visible);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    initialValueRef.current = newValue;
    field.onChange(newValue); // Ensure form data is in sync
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    if (
      field.value !== initialValueRef.current ||
      (isRequired && isEmpty(field.value)) /*&& isEmpty(passwordValue)*/
    ) {
      field.onBlur();
    }
  };

  const errMsg = error?.message;
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    result.feedbackMsg ||
    isValidating ||
    invalid
  );
  const helper = !!(helperText || errMsg || isValidating);

  return (
    <Box width="100%">
      <ResettableIconInputField
        id={id}
        {...field}
        type={visible ? "text" : "password"}
        size="small"
        ref={inputRef}
        onChange={handlePasswordChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        fullWidth={true}
        className={clsx("ra-input", `ra-input-${source}`, className)}
        isValidating={isValidating}
        isFocused={focused}
        helper={helper}
        label={
          label !== "" && label !== false ? (
            <FieldTitle label={label} source={source} isRequired={isRequired} />
          ) : null
        }
        resource={resource}
        error={invalid}
        helperText={
          renderHelperText && (
            <InputHelper
              error={
                // Show validation message only when NOT in validating state
                isValidating ? undefined : errMsg
              }
              helperText={
                // Show "Validating..." text during async validation
                isValidating
                  ? translate("razeth.validation.validating")
                  : helperText
              }
            />
          )
        }
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={translate(
                    visible
                      ? "ra.input.password.toggle_visible"
                      : "ra.input.password.toggle_hidden",
                  )}
                  onClick={handleClick}
                  size="large"
                >
                  {visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...sanitizeInputRestProps(rest)}
      />
      {props.strengthMeter && (
        <PasswordStrengthMeter
          passwordStrength={result.score}
          passwordFeedback={result.feedbackMsg}
        />
      )}
    </Box>
  );
};

export default PasswordValidationInput;
