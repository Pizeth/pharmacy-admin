import * as React from "react";
import { useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import {
  InputAdornment,
  IconButton,
  LinearProgress,
  Typography,
  Box,
  styled,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useInput, TextInputProps } from "react-admin";
// import { TextInput, TextInputProps } from "./TextInput";
import zxcvbn from "zxcvbn";
import {
  PasswordInputProps,
  ResettableTextField,
  TextInput,
} from "react-admin";
import { IconTextInputProps, StyledTextField } from "./LiveValidationInput";
import { clsx } from "clsx";

const MESSAGE = import.meta.env.VITE_PASSWORD_HINT;

const PasswordInputMeter = (props: IconTextInputProps) => {
  const {
    initiallyVisible = false,
    iconStart,
    onChange,
    label,
    className,
    source,
    ...rest
  } = props;
  const {
    field,
    fieldState: { invalid, error },
    isRequired,
  } = useInput(props);
  const [visible, setVisible] = useState(initiallyVisible);
  const translate = useTranslate();

  const handleClick = () => {
    setVisible(!visible);
  };

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(field.value || "");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    const result = zxcvbn(newValue);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback.suggestions.join(" "));
    setValue(e?.target?.value ?? e);
    setTyping(true);
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);

        if (result.score <= 0) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  // const notify = useNotify();

  // const [validateError, setValidateError] = useState<FieldError | null>(null);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // useEffect(() => {
  //   const validateInput = async () => {
  //     const result = await serverValidator(value, `validate/${source}`);
  //     setValidateError(result);
  //     if (result?.error) {
  //       notify(result.message, { type: "warning" });
  //       setShake(true);
  //       setTimeout(() => setShake(false), 500);
  //     }
  //   };

  //   if (typing) {
  //     const timer = setTimeout(() => {
  //       setTyping(false);
  //       validateInput();
  //     }, typingInterval);
  //     return () => clearTimeout(timer);
  //   }
  // }, [typing, value, source, notify, typingInterval]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(e?.target?.value ?? e);
  //   setTyping(true);
  // };

  // const renderHelperText = helperText !== false || invalid;
  // const isError = validateError?.error || invalid;

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
        return "#dc3545";
    }
  };

  return (
    <Box width="100%">
      <TextInput
        source={source}
        type={visible ? "text" : "password"}
        size="small"
        onChange={handlePasswordChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={!!invalid}
        helperText={invalid ? error?.message : ""}
        fullWidth={true}
        className={clsx("ra-input", `ra-input-${source}`, className)}
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
        // label={
        //   label !== "" && label !== false ? (
        //     <FieldTitle label={label} source={source} isRequired={isRequired} />
        //   ) : null
        // }
        // {...rest}
      />
      <Box>
        <LinearProgress
          variant="determinate"
          value={(passwordStrength / 4) * 100}
          style={{ backgroundColor: getColor(passwordStrength) }}
        />
        <Typography variant="caption" color="textSecondary">
          {/* {passwordFeedback} */}
          {field.value ? passwordFeedback : MESSAGE}
        </Typography>
      </Box>
    </Box>
  );

  //   return (
  //     <Box>
  //       <TextField
  //         {...rest}
  //         id={id}
  //         name={name}
  //         type="password"
  //         label={props.label}
  //         required={isRequired}
  //         value={value}
  //         onChange={handlePasswordChange}
  //         error={!!(touched && error)}
  //         helperText={touched && error ? error : ""}
  //         fullWidth
  //       />
  //       <Box mt={2}>
  //         <LinearProgress
  //           variant="determinate"
  //           value={(passwordStrength / 4) * 100}
  //           style={{ backgroundColor: getColor(passwordStrength) }}
  //         />
  //         <Typography variant="caption" color="textSecondary">
  //           {passwordFeedback}
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
};

export default PasswordInputMeter;
