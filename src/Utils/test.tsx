// update: async <T extends RaRecord>(
//   resource: string,
//   params: UpdateParams<T>,
// ) => {
//   const hasFile = Object.values(params.data).some(
//     (value) => value instanceof File || (value && typeof value === 'object' && 'rawFile' in value)
//   );

//   let body: any;
//   let headers: any = {};

//   if (hasFile) {
//     body = createPostFormData(params);
//   } else {
//     body = JSON.stringify(params.data);
//     headers['Content-Type'] = 'application/json';
//   }

//   const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
//     method: "PUT",
//     body,
//     headers,
//   });

//   return {
//     data: response.json.data,
//   };
// },

// // const appendFormData = (
// //   formData: FormData,
// //   key: string,
// //   value: any,
// // ): FormData => serialize(value, {}, formData, key);

// // export default appendFormData;

// const hasFileField = (data: any): boolean => {
//   return Object.values(data).some(value =>
//     value instanceof File ||
//     (value && typeof value === 'object' && ('rawFile' in value || 'file' in value))
//   );
// };

// update: async <T extends RaRecord>(
//   resource: string,
//   params: UpdateParams<T>,
// ) => {
//   const config: RequestInit = {
//     method: 'PUT',
//   };

//   if (hasFileField(params.data)) {
//     config.body = createPostFormData(params);
//   } else {
//     config.body = JSON.stringify(params.data);
//     config.headers = {
//       'Content-Type': 'application/json',
//     };
//   }

//   const response = await fetchUtils.fetchJson(
//     `${API_URL}/${resource}`,
//     config
//   );

//   if (!response.ok) {
//     throw new Error(`Error updating ${resource}`);
//   }

//   return {
//     data: response.json.data,
//   };
// },

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import { InputAdornment, IconButton, Typography, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import clsx from "clsx";
import { IconTextInputProps } from "../CustomFields/LiveValidationInput";
import LinearProgressWithLabel from "../CustomComponents/LinearProgessWithLabel";
import loadZxcvbn from "../Utils/lazyZxcvbn";

const MESSAGE = import.meta.env.VITE_PASSWORD_HINT;

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
  const interval = import.meta.env.VITE_DELAY_CALL || 2500;

  const validatePassword = useCallback(async () => {
    const zxcvbnAsync = await loadZxcvbn();
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
    const loadDebounce = async () => {
      const debounceModule = await import("@zxcvbn-ts/core");
      return debounceModule.debounce;
    };

    if (strengthMeter) {
      if (value === "") {
        setValidateError(false);
        return;
      }

      if (typing) {
        const timer = setTimeout(async () => {
          setTyping(false);
          const debounce = await loadDebounce();
          debounce(validatePassword, interval)();
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      const result = passwordValue !== value && value !== "";
      setValidateError(result);
      setErrMessage(result ? "Passwords do not match!" : "");
      if (result) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  }, [passwordValue, typing, value, interval, strengthMeter, validatePassword]);

  const handleClick = () => setVisible(!visible);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue);
    field.onChange(newValue);
    setTyping(true);
  };
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const isError = validateError || invalid;
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

export default RepasswordInput;
