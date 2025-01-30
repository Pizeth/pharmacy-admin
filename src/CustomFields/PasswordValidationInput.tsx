import { useEffect } from "react";
import { useInput, ResettableTextField, FieldTitle } from "react-admin";
import LinearProgressWithLabel from "../CustomComponents/LinearProgessWithLabel";
import usePasswordValidation from "../CustomHooks/UsePasswordValidation";
import { InputAdornment, IconButton, Typography, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconTextInputProps } from "../Types/types";

// const getStrengthColor = (strength: number): string => {
//   switch (strength) {
//     case 0:
//       return "#f44336"; // Red
//     case 1:
//       return "#ff9800"; // Orange
//     case 2:
//       return "#ffeb3b"; // Yellow
//     case 3:
//       return "#4caf50"; // Light Green
//     case 4:
//       return "#2e7d32"; // Dark Green
//     default:
//       return "#e0e0e0"; // Grey
//   }
// };

const getStrengthColor = (strength: number) => {
  const colors = ["#ff0000", "#ff9900", "#ffff00", "#99ff00", "#00ff00"];
  return colors[Math.min(strength, colors.length - 1)];
};

// 3. PasswordInput.tsx (Main component)
export const PasswordValidationInput = (props: IconTextInputProps) => {
  const {
    field,
    fieldState: { invalid, error },
    id,
    isRequired,
  } = useInput({ ...props, type: "password" });

  const { state, actions } = usePasswordValidation(
    field.value as string,
    props.strengthMeter,
  );

  useEffect(() => {
    // Sync with react-admin form
    if (field.value !== state.value) {
      field.onChange(state.value);
    }
  }, [state.value]);

  return (
    <Box width="100%">
      <ResettableTextField
        {...field}
        id={id}
        type={state.visible ? "text" : "password"}
        label={
          <FieldTitle
            label={props.label}
            source={props.source}
            isRequired={isRequired}
          />
        }
        error={invalid || state.shake}
        helperText={error?.message || (state.shake && state.feedback) || ""}
        InputProps={{
          startAdornment: props.iconStart && (
            <InputAdornment position="start">{props.iconStart}</InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={actions.toggleVisibility}
                edge="end"
                aria-label={state.visible ? "Hide password" : "Show password"}
              >
                {state.visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          actions.handleChange(e.target.value)
        }
        onFocus={actions.handleFocus}
        onBlur={actions.handleBlur}
      />

      {props.strengthMeter && (
        <Box mt={1}>
          <LinearProgressWithLabel
            value={(state.strength / 4) * 100}
            sx={{
              backgroundColor: (theme) => theme.palette.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: getStrengthColor(state.strength),
              },
            }}
          />
          <Typography variant="caption" color="textSecondary">
            {state.value ? state.feedback : "Password strength indicator"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PasswordValidationInput;
