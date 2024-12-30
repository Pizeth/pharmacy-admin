import * as React from "react";
import { useState } from "react";
import { useInput, useTranslate } from "ra-core";
import {
  InputAdornment,
  IconButton,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useInput, TextInputProps } from "react-admin";
// import { TextInput, TextInputProps } from "./TextInput";
import zxcvbn from "zxcvbn";
import { PasswordInputProps, TextInput } from "react-admin";

const MESSAGE = import.meta.env.VITE_PASSWORD_HINT;

const PasswordInputMeter = (props: PasswordInputProps) => {
  const { initiallyVisible = false, onChange, ...rest } = props;
  const {
    field,
    fieldState: { invalid, error },
  } = useInput(props);
  const [visible, setVisible] = useState(initiallyVisible);
  const translate = useTranslate();

  const handleClick = () => {
    setVisible(!visible);
  };

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    const result = zxcvbn(newValue);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback.suggestions.join(" "));
  };

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
        return "red";
    }
  };

  return (
    <Box width="100%">
      <TextInput
        type={visible ? "text" : "password"}
        size="small"
        onChange={handlePasswordChange}
        error={!!invalid}
        helperText={invalid ? error?.message : ""}
        fullWidth={true}
        InputProps={{
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
        {...rest}
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
