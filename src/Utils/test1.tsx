import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import { useFormContext } from "react-hook-form";
import {
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import { clsx } from "clsx";
import { IconTextInputProps } from "../Types/types";
import zxcvbn from "../Utils/lazyZxcvbn";
import PasswordStrengthMeter from "../CustomComponents/PasswordStrengthMeter";
import { matchPassword, validateStrength } from "../Utils/validator";

export const PasswordValidationInput = (props: IconTextInputProps) => {
  const {
    className,
    defaultValue,
    label,
    format,
    onBlur,
    onChange,
    parse,
    resource,
    source,
    validate = [],
    iconStart,
    initiallyVisible = false,
    strengthMeter = false,
    passwordValue,
    ...rest
  } = props;

  const { setError, clearErrors } = useFormContext();
  const [asyncError, setAsyncError] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  const translate = useTranslate();

  // ... inside the useMemo for validators
  const validators = useMemo(() => {
    const normalizedValidate = Array.isArray(validate) ? validate : [validate];
    const baseValidators = [...normalizedValidate];
    if (passwordValue !== undefined) {
      baseValidators.push(matchPassword(passwordValue)); // Pass the translate function
    }
    return baseValidators;
  }, [validate, passwordValue, translate]); // add translate to the dependencies

  const {
    field,
    fieldState: { invalid, error },
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

  // const translate = useTranslate();
  const [visible, setVisible] = useState(initiallyVisible);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(field.value || "");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const interval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  // Async validation effect
  useEffect(() => {
    const validateAsync = async () => {
      setIsValidating(true); // Start validation
      try {
        const result = await validateStrength(field.value);
        if (result.invalid) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setError(source, { type: "async", message: result.message });
        } else {
          clearErrors(source);
        }
        setAsyncError(result.message || "");
        setPasswordStrength(result.score);
        setPasswordFeedback(result.feedbackMsg);
      } catch (err) {
        setError(source, { type: "async", message: "Validation failed" });
      } finally {
        setIsValidating(false); // End validation
      }
    };

    if (!strengthMeter) {
      const result = passwordValue !== value && value !== "";
      if (result) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      return;
    }
    if (!field.value) {
      setPasswordStrength(0);
      return;
    }

    if (typing) {
      const timer = setTimeout(async () => {
        setTyping(false);
        const debounce = await zxcvbn.loadDebounce();
        debounce(validateAsync, 500)();
      }, interval);
      return () => clearTimeout(timer);
    }
  }, [
    clearErrors,
    field.value,
    interval,
    passwordValue,
    setError,
    source,
    strengthMeter,
    typing,
    value,
  ]);

  // Combine sync and async errors
  const isError = invalid || !!asyncError;
  const errMsg = translate(error?.message || asyncError || "");

  const handleClick = () => setVisible(!visible);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setTyping(true);
    setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    field.onBlur(); // Ensure React Admin's onBlur is called
    if (isError || (isRequired && value == "")) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <Box width="100%">
      <ResettableTextField
        id={id}
        {...field}
        source={source}
        type={visible ? "text" : "password"}
        size="small"
        onChange={handlePasswordChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        fullWidth={true}
        className={clsx("ra-input", `ra-input-${source}`, className)}
        error={isError}
        helperText={isError ? errMsg : ""}
        slotProps={{
          input: {
            startAdornment: iconStart ? (
              <InputAdornment position="start">{iconStart}</InputAdornment>
            ) : null,
            endAdornment: isValidating ? (
              <CircularProgress size={20} /> // Show loading spinner
            ) : (
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
          inputLabel: {
            shrink: focused || value !== "",
            className: clsx({ shake: shake }),
          },
        }}
        label={
          label !== "" && label !== false ? (
            <FieldTitle label={label} source={source} isRequired={isRequired} />
          ) : null
        }
        {...sanitizeInputRestProps(rest)}
      />
      {props.strengthMeter && (
        <PasswordStrengthMeter
          passwordStrength={passwordStrength}
          passwordFeedback={passwordFeedback}
          value={field.value}
        />
      )}
    </Box>
  );
};

export default PasswordValidationInput;
