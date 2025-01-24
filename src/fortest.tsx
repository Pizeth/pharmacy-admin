import { ChangeEvent, useEffect, useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import { InputAdornment, IconButton, Typography, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";

import { clsx } from "clsx";
import { IconTextInputProps } from "./CustomFields/LiveValidationInput";

export const RepasswordInput = (props: IconTextInputProps) => {
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
  const [value, setValue] = useState(field.value || "");
  const [errMessage, setErrMessage] = useState(error?.message || "");
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [validateError, setValidateError] = useState(false);

  useEffect(() => {
    const result = passwordValue !== value && value !== "";
    setValidateError(result);
    setErrMessage(result ? "Passwords do not match!" : "");
    if (result) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    // if (passwordValue !== value && value !== "") {
    //   setErrMessage("Passwords do not match!");
    //   setShake(true);
    //   setTimeout(() => setShake(false), 500);
    // } else {
    //   setErrMessage("");
    // }
  }, [passwordValue, value]);

  const handleClick = () => {
    setVisible(!visible);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // const isError = validateError || invalid;
  // const errMsg = errMessage || error?.message;

  return (
    <ResettableTextField
      id={id}
      {...field}
      source={source}
      type={visible ? "text" : "password"}
      size="small"
      onChange={handlePasswordChange}
      fullWidth={true}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      error={Boolean(errMessage) || invalid}
      helperText={errMessage}
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
        shrink: field.value !== undefined && field.value !== "",
        className: clsx({ shake: shake }),
      }}
      label={
        label !== "" && label !== false ? (
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        ) : null
      }
      {...sanitizeInputRestProps(rest)}
    />
  );
};

export default RepasswordInput;
