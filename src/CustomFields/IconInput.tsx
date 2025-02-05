import React, { useState } from "react";
import { required, useInput } from "react-admin";
import { IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import {
  ResettableTextField,
  FieldTitle,
  sanitizeInputRestProps,
} from "react-admin";
import "../Styles/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import StringUtils from "../Utils/StringUtils";

const ValidationInput = (props: IconTextInputProps) => {
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
    iconEnd,
    ...rest
  } = props;

  const {
    field,
    fieldState: { error, invalid },
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

  const [value, setValue] = useState(field.value || "");
  const [shake, setShake] = useState(false);
  const [errMessage, setErrMessage] = useState(error?.message || "");
  const [validateError, setValidateError] = useState(false);
  const [focused, setFocused] = useState(false);

  const validteResult = () => {
    const isValid = required() && !value;
    console.log("isValid", isValid);
    setValidateError(isValid);
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const displayLabel = label ? label : StringUtils.capitalize(source);
      setErrMessage(`${displayLabel} is required`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
  };

  const handleKeyUp = () => {
    validteResult();
  };
  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    validteResult();
    setFocused(false);
  };
  console.log("validateError", validateError);
  const isError = validateError || invalid;
  console.log("invalid", invalid);
  console.log("error", error);
  console.log("isError", isError);
  const errMsg = errMessage || error?.message;

  return (
    <ResettableTextField
      id={id}
      {...field}
      value={value}
      onKeyUp={handleKeyUp}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      InputProps={{
        startAdornment: iconStart ? (
          <InputAdornment position="start">{iconStart}</InputAdornment>
        ) : null,
        endAdornment: iconEnd ? (
          <InputAdornment position="end">{iconEnd}</InputAdornment>
        ) : null,
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
      resource={resource}
      error={isError}
      helperText={isError ? errMsg : ""}
      {...sanitizeInputRestProps(rest)}
    />
  );
};

export default ValidationInput;
