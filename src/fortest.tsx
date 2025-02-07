import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import { useFormContext } from "react-hook-form";
import { InputAdornment, IconButton, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import { clsx } from "clsx";
import { IconTextInputProps } from "./Types/types";
import loadZxcvbn, { loadDebounce } from "./Utils/lazyZxcvbn";
import PasswordStrengthMeter from "./CustomComponents/PasswordStrengthMeter";
import StringUtils from "./Utils/StringUtils";
import { matchPassword, validateStrength } from "./Utils/validator";

const zxcvbnAsync = await loadZxcvbn();

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

  // Compute validators with normalization
  const validators = useMemo(() => {
    const normalizedValidate = Array.isArray(validate) ? validate : [validate];
    const baseValidators = [...normalizedValidate];
    if (passwordValue !== undefined) {
      baseValidators.push(matchPassword(passwordValue));
    }
    return baseValidators;
  }, [validate, passwordValue]);

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

  const translate = useTranslate();
  const [visible, setVisible] = useState(initiallyVisible);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(field.value || "");
  // const [errMessage, setErrMessage] = useState(error?.message || "");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  // const [validateError, setValidateError] = useState(false);
  const interval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

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

  useEffect(() => {
    const validateAsync = async () => {
      try {
        const error = await validateStrength(field.value);
        if (error) {
          if (error.invalid) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setError(source, { type: "manual", message: error.message });
          }
          setAsyncError(error.message || "");
          setPasswordStrength(error.score);
          setPasswordFeedback(error.feedbackMsg);
        } else {
          clearErrors(source);
        }
      } catch (err) {
        setError(source, { type: "manual", message: "Validation failed" });
      }
    };

    if (!strengthMeter || !field.value) {
      setPasswordStrength(0);
      return;
    }

    if (typing) {
      const timer = setTimeout(async () => {
        setTyping(false);
        // const debouncedValidation = debounce(validatePassword, interval);
        // debouncedValidation();
        const debounce = await loadDebounce();
        debounce(validateAsync, 500)();
      }, interval);
      return () => clearTimeout(timer);
    }

    // const debounceTimer = setTimeout(validateAsync, 500); // Debounce
    // return () => clearTimeout(debounceTimer);

    // if (strengthMeter) {
    //   if (value === "") {
    //     setPasswordStrength(0);
    //     setValidateError(false);
    //     return;
    //   }

    //   if (typing) {
    //     const timer = setTimeout(async () => {
    //       setTyping(false);
    //       // const debouncedValidation = debounce(validatePassword, interval);
    //       // debouncedValidation();
    //       const debounce = await loadDebounce();
    //       debounce(validatePassword, 500)();
    //     }, interval);
    //     return () => clearTimeout(timer);
    //   }
    // } else {
    //   const result = passwordValue !== value && value !== "";

    //   setValidateError(result);

    //   if (result) {
    //     setErrMessage("Passwords do not match!");
    //     setShake(true);
    //     setTimeout(() => setShake(false), 500);
    //   }
    // }
  }, [
    clearErrors,
    field.value,
    interval,
    setError,
    source,
    strengthMeter,
    typing,
  ]);

  const handleClick = () => setVisible(!visible);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
    setTyping(true);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    field.onBlur(); // Ensure React Admin's onBlur is called
    // if (value === "") {
    //   setValidateError(true);
    //   setShake(true);
    //   setTimeout(() => setShake(false), 500);
    //   const displayLabel = label ? label : StringUtils.capitalize(source);
    //   setErrMessage(`${displayLabel} is required`);
    // }
  };

  // const isError = validateError || invalid;
  // const errMsg = errMessage || error?.message;

  // Combine sync and async errors
  const isError = invalid || !!asyncError;
  const errMsg = error?.message || asyncError;

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
        InputProps={{
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
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
        }}
        InputLabelProps={{
          shrink: focused || value !== "",
          className: clsx({ shake: shake }),
        }}
        label={
          label !== "" && label !== false ? (
            <FieldTitle label={label} source={source} isRequired={isRequired} />
          ) : null
        }
        {...sanitizeInputRestProps(rest)}
      />
      {/* {strengthMeter && (
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
      )} */}
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
