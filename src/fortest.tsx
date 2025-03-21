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
import { IconTextInputProps, TogglePasswordEvent } from "./Types/types";
import PasswordStrengthMeter from "./CustomComponents/PasswordStrengthMeter";
import { useMatchPassword, usePasswordValidator } from "./Utils/validator";
import { InputHelper } from "./CustomComponents/InputHelper";
import ResettableIconInputField from "./Utils/ResettableIconInputField";
import { useFormContext } from "react-hook-form";
import { EventHandlers } from "./Utils/EventHandlers";

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
  // const { setError, clearErrors } = useFormContext();
  // const [asyncError, setAsyncError] = useState<string | undefined>();

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

  // const [passwordStrength, setPasswordStrength] = useState(0);
  // const [passwordFeedback, setPasswordFeedback] = useState("");
  // const [value, setValue] = useState(field.value || "");
  // const [errMessage, setErrMessage] = useState(error?.message || "");
  // const [typing, setTyping] = useState(false);
  // const [validateError, setValidateError] = useState(false);
  // const interval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  // Async validation effect
  // useEffect(() => {
  //   if (!strengthMeter || !field.value) return;

  //   const validateAsync = async () => {
  //     try {
  //       const error = await validateStrength(field.value);
  //       setAsyncError(error?.message);
  //       if (error) {
  //         setError(source, { type: "manual", message: error.message });
  //       } else {
  //         clearErrors(source);
  //       }
  //     } catch (err) {
  //       setError(source, { type: "manual", message: "Validation failed" });
  //     }
  //   };

  //   const debounceTimer = setTimeout(validateAsync, 500); // Debounce
  //   return () => clearTimeout(debounceTimer);
  // }, [field.value, strengthMeter, source, setError, clearErrors]);

  // Remove local error states (validateError, errMessage)
  // Keep UI-focused states (shake, passwordStrength, etc.)

  // Update password strength (for UI only)
  // useEffect(() => {
  //   if (strengthMeter && value) {
  //     zxcvbnAsync(value).then((result) => {
  //       setPasswordStrength(result.score);
  //       setPasswordFeedback(result.feedback.suggestions?.join(" ") || "");
  //     });
  //   }
  // }, [value, strengthMeter]);

  // const validatePassword = useCallback(async () => {
  //   const result = await zxcvbnAsync(value);
  //   const warningMsg = result.feedback.warning;
  //   const suggestMsg = result.feedback.suggestions.join(" ");
  //   const isValid = result.score <= 0;

  //   setValidateError(isValid);
  //   setErrMessage(warningMsg || "");
  //   setPasswordStrength(result.score);
  //   setPasswordFeedback(
  //     result ? suggestMsg : (warningMsg ?? "").concat(` ${suggestMsg}`),
  //   );
  //   if (result) {
  //     setShake(true);
  //     setTimeout(() => setShake(false), 500);
  //   }
  // }, [value]);

  // Async validation effect
  // useEffect(() => {
  //   const validateAsync = async () => {
  //     setIsValidating(true); // Start validation
  //     try {
  //       const result = await validateStrength(field.value);
  //       if (result.invalid) {
  //         setShake(true);
  //         setTimeout(() => setShake(false), 500);
  //         setError(source, {
  //           type: "validate",
  //           message: result.message,
  //         }); // Error message is already translated in validateStrength
  //       } else {
  //         clearErrors(source);
  //       }
  //       setAsyncError(result.message || "");
  //       setPasswordStrength(result.score);
  //       setPasswordFeedback(result.feedbackMsg);
  //     } catch (err) {
  //       setError(source, { type: "validate", message: "Validation failed" });
  //     } finally {
  //       setIsValidating(false); // End validation
  //     }
  //   };

  //   if (!strengthMeter) {
  //     // const result = passwordValue !== value && value !== "";
  //     const result = passwordValue && value && passwordValue !== value;
  //     console.log(result);
  //     if (result) {
  //       setError(source, {
  //         type: "validate",
  //         message: "razeth.validation.notmatch",
  //       });
  //       setShake(true);
  //       setTimeout(() => setShake(false), 500);
  //     } else {
  //       clearErrors(source);
  //     }
  //     return;
  //   }
  //   if (!field.value) {
  //     setPasswordStrength(0);
  //     return;
  //   }

  //   if (typing) {
  //     const timer = setTimeout(async () => {
  //       setTyping(false);
  //       // const debouncedValidation = debounce(validatePassword, interval);
  //       // debouncedValidation();
  //       const debounce = await zxcvbn.loadDebounce();
  //       debounce(validateAsync, 500)();
  //     }, interval);
  //     return () => clearTimeout(timer);
  //   }

  //   // const debounceTimer = setTimeout(validateAsync, 500); // Debounce
  //   // return () => clearTimeout(debounceTimer);

  //   // if (strengthMeter) {
  //   //   if (value === "") {
  //   //     setPasswordStrength(0);
  //   //     setValidateError(false);
  //   //     return;
  //   //   }

  //   //   if (typing) {
  //   //     const timer = setTimeout(async () => {
  //   //       setTyping(false);
  //   //       // const debouncedValidation = debounce(validatePassword, interval);
  //   //       // debouncedValidation();
  //   //       const debounce = await loadDebounce();
  //   //       debounce(validatePassword, 500)();
  //   //     }, interval);
  //   //     return () => clearTimeout(timer);
  //   //   }
  //   // } else {
  //   //   const result = passwordValue !== value && value !== "";

  //   //   setValidateError(result);

  //   //   if (result) {
  //   //     setErrMessage("Passwords do not match!");
  //   //     setShake(true);
  //   //     setTimeout(() => setShake(false), 500);
  //   //   }
  //   // }
  // }, [
  //   clearErrors,
  //   field.value,
  //   interval,
  //   passwordValue,
  //   setError,
  //   source,
  //   strengthMeter,
  //   typing,
  //   value,
  // ]);

  // Handle shake effect without useState
  // console.log("Field state for", source, { invalid, error, isValidating });
  // useEffect(() => {
  //   // console.log("Validation state:", { isValidating, invalid });
  //   // console.log("Password Value", passwordValue);
  //   if (!isValidating && invalid && inputRef.current) {
  //     console.log("Applying shake effect");
  //     shakeRef.current = inputRef.current.querySelector(".MuiInputLabel-root");
  //     // console.log("Label found:", shakeRef.current, source);
  //     if (shakeRef.current) {
  //       shakeRef.current.classList.add("shake");
  //       setTimeout(() => {
  //         if (shakeRef.current) {
  //           shakeRef.current.classList.remove("shake");
  //         }
  //       }, 500); // Matches animation duration
  //     }
  //   } else {
  //     // console.log("Label not found in:", inputRef.current, source);
  //     clearErrors(source);
  //   }
  // }, [isValidating, invalid, source, passwordValue, clearErrors]);

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

  // const handleClick = () => setVisible(!visible);

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

// slotProps={{
//   input: {
//     endAdornment: (
//       <InputAdornment position="end">
//         <IconButton
//           aria-label={translate(
//             visible
//               ? "ra.input.password.toggle_visible"
//               : "ra.input.password.toggle_hidden",
//           )}
//           onClick={handleClick}
//           size="large"
//         >
//           {visible ? <Visibility /> : <VisibilityOff />}
//         </IconButton>
//       </InputAdornment>
//     ),
//   },
// //   // inputLabel: {
// //   //   shrink: focused || value !== "",
// //   //   className: clsx({ shake: shake }),
// //   // },
// //   // formHelperText: CustomFormHelperTextProps,
// }}
// InputProps={{
//   startAdornment: iconStart ? (
//     <InputAdornment position="start">{iconStart}</InputAdornment>
//   ) : null,
//   endAdornment: isValidating ? (
//     <CircularProgress size={20} /> // Show loading spinner
//   ) : (
//     <InputAdornment position="end">
//       <IconButton
//         aria-label={translate(
//           visible
//             ? "ra.input.password.toggle_visible"
//             : "ra.input.password.toggle_hidden",
//         )}
//         onClick={handleClick}
//         size="large"
//       >
//         {visible ? <Visibility /> : <VisibilityOff />}
//       </IconButton>
//     </InputAdornment>
//   ),
// }}
// InputLabelProps={{
//   shrink: focused || value !== "",
//   className: clsx({ shake: shake }),
// }}

{
  /* {strengthMeter && (
        <Box>
          <LinearProgressWithLabel
            variant="determinate"
            value={(passwordStrength / 4) * 100}
            // style={{ backgroundColor: getColor(passwordStrength) }}
            sx={{
              backgroundColor: (theme) => theme.palette.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: getColor(passwordStrength),
              },
            }}
          />
          <Typography variant="caption" color="textSecondary">
            {field.value ? passwordFeedback : MESSAGE}
          </Typography>
        </Box>
      )} */
}
