import React, { useEffect, useState } from "react";
import { PasswordInputProps, useInput, useNotify } from "react-admin";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { FieldError, serverValidator } from "../Utils/validator";
import {
  ResettableTextField,
  FieldTitle,
  InputHelperText,
  sanitizeInputRestProps,
} from "react-admin";
import "../Styles/style.css";
import InputAdornment from "@mui/material/InputAdornment";

export const StyledTextField = styled(ResettableTextField)(
  ({ theme, error }) => ({
    "& .MuiInputBase-root": {
      borderColor: error ? theme.palette.error.main : "inherit",
    },
    "& .MuiInputBase-input::placeholder": {
      color: error ? theme.palette.error.main : "inherit",
      transition: "color 0.5s",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiSvgIcon-root": {
        color: theme.palette.primary.main, //theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-outlined": {
      marginLeft: "2em", // Adjust label position when start icon is present
      "&.MuiInputLabel-shrink": { marginLeft: "0" },
    },
  }),
);

// export type IconTextInputProps = PasswordInputProps & {
//   iconStart?: React.ReactNode;
//   iconEnd?: React.ReactNode;
// };

export interface IconTextInputProps extends PasswordInputProps {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

const ValidationInput = (props: IconTextInputProps) => {
  const {
    className,
    defaultValue,
    label,
    format,
    helperText,
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

  const notify = useNotify();
  const [value, setValue] = useState(field.value || "");
  const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [validateError, setValidateError] = useState<FieldError | null>(null);
  const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // const validateInput = async () => {
  //   const result = await serverValidator(value, `validate/${source}`);
  //   setValidateError(result);
  //   if (result?.error) {
  //     notify(result.message, { type: "warning" });
  //     setShake(true);
  //     setTimeout(() => setShake(false), 500);
  //   }
  // };
  useEffect(() => {
    const validateInput = async () => {
      const result = await serverValidator(value, `validate/${source}`);
      setValidateError(result);
      if (result?.error) {
        notify(result.message, { type: "warning" });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    };

    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
        validateInput();
      }, typingInterval);
      return () => clearTimeout(timer);
    }
  }, [typing, value, source, notify, typingInterval]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value ?? e);
    setTyping(true);
  };

  const renderHelperText = helperText !== false || invalid;
  const isError = validateError?.error || invalid;

  return (
    <ResettableTextField
      id={id}
      {...field}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // placeholder={error?.message}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      // variant="outlined"
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
      helperText={
        renderHelperText ? (
          <InputHelperText
            error={validateError?.message || error?.message}
            helperText={helperText}
          />
        ) : null
      }
      {...sanitizeInputRestProps(rest)}
    />
  );
};

export default ValidationInput;
