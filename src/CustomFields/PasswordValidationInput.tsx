import { useInput, useTranslate, FieldTitle } from "ra-core";
import { InputAdornment, IconButton, Typography, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import { clsx } from "clsx";
import { IconTextInputProps } from "../CustomFields/LiveValidationInput";
import LinearProgressWithLabel from "../CustomComponents/LinearProgessWithLabel";
import usePasswordInput from "../CustomHooks/UsePasswordInput";

const MESSAGE = import.meta.env.VITE_PASSWORD_HINT;

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

  const {
    visible,
    passwordStrength,
    passwordFeedback,
    value,
    errMessage,
    focused,
    shake,
    validateError,
    isError,
    handleClick,
    handlePasswordChange,
    handleFocus,
    handleBlur,
  } = usePasswordInput({
    initialPassword: field.value || "",
    initiallyVisible,
    passwordValue,
    strengthMeter,
  });

  const errMsg = errMessage || error?.message;

  const getColor = (score: number) => {
    switch (score) {
      case 0:
        return "darkred";
      case 1:
        return "orange";
      case 2:
        return "yellow";
      case 3:
        return "blue";
      case 4:
        return "green";
      default:
        return "#dd741d";
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
      {strengthMeter && (
        <Box>
          <LinearProgressWithLabel
            variant="determinate"
            value={(passwordStrength / 4) * 100}
            style={{ backgroundColor: getColor(passwordStrength) }}
          />
          <Typography variant="caption" color="textSecondary">
            {field.value ? passwordFeedback : MESSAGE}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PasswordValidationInput;
