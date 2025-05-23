import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import { InputAdornment, IconButton, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import { clsx } from "clsx";
import { IconTextInputProps } from "../Types/types";
import zxcvbn from "../Utils/lazyZxcvbn";
import PasswordStrengthMeter from "../CustomComponents/PasswordStrengthMeter";
import StringUtils from "../Utils/Utils";

const zxcvbnAsync = await zxcvbn.loadZxcvbn();

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
    validate,
    iconStart,
    initiallyVisible = false,
    strengthMeter = false,
    passwordValue,
    ...rest
  } = props;

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
    validate,
    onBlur,
    onChange,
    ...rest,
  });

  const translate = useTranslate();
  const [visible, setVisible] = useState(initiallyVisible);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(field.value || "");
  const [errMessage, setErrMessage] = useState(error?.message || "");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [validateError, setValidateError] = useState(false);
  const interval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  const validatePassword = useCallback(async () => {
    const result = await zxcvbnAsync(value);
    const warningMsg = result.feedback.warning;
    const suggestMsg = result.feedback.suggestions.join(" ");
    const isValid = result.score <= 0;

    setValidateError(isValid);
    setErrMessage(warningMsg || "");
    setPasswordStrength(result.score);
    setPasswordFeedback(
      result ? suggestMsg : (warningMsg ?? "").concat(` ${suggestMsg}`),
    );
    if (result) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [value]);

  useEffect(() => {
    if (strengthMeter) {
      if (value === "") {
        setPasswordStrength(0);
        setValidateError(false);
        return;
      }

      if (typing) {
        const timer = setTimeout(async () => {
          setTyping(false);
          const debounce = await zxcvbn.loadDebounce();
          debounce(validatePassword, 500)();
        }, interval);
        return () => clearTimeout(timer);
      }
    } else {
      const result = passwordValue !== value && value !== "";

      setValidateError(result);

      if (result) {
        setErrMessage("Passwords do not match!");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  }, [passwordValue, typing, value, interval, strengthMeter, validatePassword]);

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
    if (value === "") {
      setValidateError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const displayLabel = label ? label : StringUtils.capitalize(source);
      setErrMessage(`${displayLabel} is required`);
    }
  };
  const isError = validateError || invalid;
  const errMsg = errMessage || error?.message;

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
