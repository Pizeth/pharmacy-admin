import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box } from "@mui/material";
import {
  FieldTitle,
  useTranslate,
  sanitizeInputRestProps,
  isEmpty,
  useInput,
} from "react-admin";
import { clsx } from "clsx";

import { useFormContext } from "react-hook-form";
import { IconTextInputProps, TogglePasswordEvent } from "../Types/types";
import { useMatchPassword, usePasswordValidator } from "./validator";
import { EventHandlers } from "./EventHandlers";
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
    passwordValue,
    ...rest
  } = props;

  const translate = useTranslate();

  // Use refs for transient UI states
  const initialValueRef = useRef("");
  const inputRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLLabelElement | null>(null); // Ref for shake effect
  const { clearErrors } = useFormContext();

  // Get password validators
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

  useEffect(() => {
    if (!isValidating && invalid && inputRef.current) {
      shakeRef.current = inputRef.current.querySelector(".MuiInputLabel-root");
      if (shakeRef.current) {
        // Remove the class to reset the animation state
        shakeRef.current.classList.remove("shake");
        // Add it back after a 0ms delay to ensure the browser registers a new animation
        setTimeout(() => {
          if (shakeRef.current) {
            shakeRef.current.classList.add("shake");
            // Remove it after the animation completes (500ms)
            setTimeout(() => {
              if (shakeRef.current) {
                shakeRef.current.classList.remove("shake");
              }
            }, 500);
          }
        }, 0);
      }
    } else {
      clearErrors(source);
    }
  }, [isValidating, invalid, passwordValue, clearErrors, source]);

  // Handle mouse release (global)
  const handleMouseUp = useCallback(() => {
    setVisible(false);
    document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Handle touch release (global)
  const handleTouchEnd = useCallback(() => {
    setVisible(false);
    document.removeEventListener("touchend", handleTouchEnd);
  }, []);

  // Consolidated togglePassword function
  const togglePassword = useCallback(
    (event: TogglePasswordEvent) => {
      console.log("Toggle Password", event.type);
      event.preventDefault();

      switch (event.type) {
        // Handle mouse press
        case "mousedown":
          setVisible(true);
          document.addEventListener("mouseup", handleMouseUp);
          break;
        // Handle touch press
        case "touchstart":
          setVisible(true);
          document.addEventListener("touchend", handleTouchEnd);
          break;
        // Handle key press (space or enter)
        case "keydown":
          EventHandlers.handleKeyboardEvent(
            EventHandlers.toKeyboardEvent(event),
            true,
            setVisible,
          );
          break;
        // Handle key release
        case "keyup":
          EventHandlers.handleKeyboardEvent(
            EventHandlers.toKeyboardEvent(event),
            false,
            setVisible,
          );
          break;
        default:
          // Do nothing for unhandled event types
          break;
      }
    },
    [handleMouseUp, handleTouchEnd],
  );

  // Cleanup global event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseUp, handleTouchEnd]);

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
      field.onBlur(); // Ensure React Admin's onBlur is called
    }
  };

  // Combine sync and async errors
  const errMsg = error?.message;
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    result.feedbackMsg ||
    isValidating ||
    invalid
  );
  // const helper = !!(helperText || errMsg || isValidating);

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
        togglePassword={togglePassword}
        fullWidth={true}
        className={clsx("ra-input", `ra-input-${source}`, className)}
        isValidating={isValidating}
        isFocused={focused}
        isPassword={true}
        helper={renderHelperText}
        isVisible={visible}
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
