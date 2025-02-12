import React, { useState } from "react";
import { useInput } from "react-admin";
import { IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import {
  ResettableTextField,
  FieldTitle,
  sanitizeInputRestProps,
} from "react-admin";
import "../Styles/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import { CircularProgress } from "@mui/material";
import { InputHelper } from "../CustomComponents/InputHelper";

const ValidationInput = (props: IconTextInputProps) => {
  const {
    className,
    defaultValue,
    helperText,
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

  const [isValidating, setIsValidating] = useState(false);

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
    const isInvalid = isRequired && !value;
    // setValidateError(isInvalid);
    if (isInvalid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      // const displayLabel = label ? label : StringUtils.capitalize(source);
      // setErrMessage(`${displayLabel} is required`);
    }
    // if (isError || (isRequired && value == "")) {
    //   setShake(true);
    //   setTimeout(() => setShake(false), 500);
    // }
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
    setFocused(false);
    field.onBlur();
    validteResult();
  };

  const isError = validateError || invalid;
  const errMsg = errMessage || error?.message;
  const renderHelperText = helperText !== false || invalid;

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
      // InputProps={{
      //   startAdornment: iconStart ? (
      //     <InputAdornment position="start">{iconStart}</InputAdornment>
      //   ) : null,
      //   endAdornment: iconEnd ? (
      //     <InputAdornment position="end">{iconEnd}</InputAdornment>
      //   ) : null,
      // }}
      // InputLabelProps={{
      //   shrink: focused || value !== "",
      //   className: clsx({ shake: shake }),
      // }}
      slotProps={{
        input: {
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
          endAdornment: isValidating ? (
            <CircularProgress size={20} /> // Show loading spinner
          ) : iconEnd ? (
            <InputAdornment position="end">{iconEnd}</InputAdornment>
          ) : null,
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
      helperText={
        renderHelperText ? (
          <InputHelper error={errMsg} helperText={helperText} />
        ) : null
      }
      resource={resource}
      error={isError}
      // helperText={isError ? errMsg : ""}
      {...sanitizeInputRestProps(rest)}
    />
  );
};

export default ValidationInput;
