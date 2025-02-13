// // import React, { useEffect } from "react";
// import { TextInput, useNotify, InputProps } from "react-admin";
// // import validator from "../Utils/validator";

// import * as React from "react";
// import clsx from "clsx";
// import { useInput, FieldTitle } from "ra-core";
// import validator from "../Utils/validator";
// import {
//   InputHelperText,
//   ResettableTextField,
//   sanitizeInputRestProps,
//   TextInputProps,
// } from "react-admin";

// // import { CommonInputProps } from "./CommonInputProps";
// // import {
// //   ResettableTextField,
// //   ResettableTextFieldProps,
// // } from "./ResettableTextField";
// // import { InputHelperText } from "./InputHelperText";
// // import { sanitizeInputRestProps } from "./sanitizeInputRestProps";

// /**
//  * An Input component for a string
//  *
//  * @example
//  * <TextInput source="first_name" />
//  *
//  * You can customize the `type` props (which defaults to "text").
//  * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
//  * @example
//  * <TextInput source="email" type="email" />
//  * <NumberInput source="nb_views" />
//  *
//  */
// const UsernameInput = (props: TextInputProps) => {
//   // const {
//   //   field: { value },
//   // } = useInput(props);
//   const {
//     className,
//     defaultValue,
//     label,
//     format,
//     helperText,
//     onBlur,
//     onChange,
//     parse,
//     resource,
//     source,
//     validate,
//     ...rest
//   } = props;
//   const {
//     field,
//     fieldState: { error, invalid },
//     id,
//     isRequired,
//   } = useInput({
//     defaultValue,
//     format,
//     parse,
//     resource,
//     source,
//     type: "text",
//     validate,
//     onBlur,
//     onChange,
//     ...rest,
//   });

//   console.log(field);
//   const renderHelperText = helperText !== false || invalid;
//   const isError = validator(field.value as string | undefined); //!== false || invalid;
//   console.log(renderHelperText);
//   console.log(isError);

//   const notify = useNotify();

//   React.useEffect(() => {
//     if (isError) {
//       notify(isError, { type: "warning" });
//     }
//   }, [isError, notify]);

//   return (
//     <ResettableTextField
//       id={id}
//       {...field}
//       className={clsx("ra-input", `ra-input-${source}`, className)}
//       label={
//         label !== "" && label !== false ? (
//           <FieldTitle
//             label={label}
//             source={source}
//             resource={resource}
//             isRequired={isRequired}
//           />
//         ) : null
//       }
//       error={invalid}
//       helperText={
//         renderHelperText ? (
//           <InputHelperText error={error?.message} helperText={helperText} />
//         ) : null
//       }
//       validate={isError ? () => ({ message: isError, args: {} }) : undefined}
//       {...sanitizeInputRestProps(rest)}
//     />
//   );

//   return (
// <TextInput
//       {...props}
//       error={!!error}
//       helperText={error ? error : " "}
//       validate={error ? () => ({ message: error, args: {} }) : undefined}
//     />
//   );
// };

// export default UsernameInput;

// import React, { useEffect, useState } from "react";
// import { TextInputProps, useInput, useNotify } from "react-admin";
// import clsx from "clsx";
// import validator, { FieldError } from "../Utils/validator";
// import {
//   ResettableTextField,
//   FieldTitle,
//   InputHelperText,
//   sanitizeInputRestProps,
// } from "react-admin";

// const ValidationInput = (props: TextInputProps) => {
//   const {
//     className,
//     defaultValue,
//     label,
//     format,
//     helperText,
//     onBlur,
//     onChange,
//     parse,
//     resource,
//     source,
//     validate,
//     ...rest
//   } = props;

//   const {
//     field,
//     fieldState: { error, invalid },
//     id,
//     isRequired,
//   } = useInput({
//     defaultValue,
//     format,
//     parse,
//     resource,
//     source,
//     type: "text",
//     validate,
//     onBlur,
//     onChange,
//     ...rest,
//   });

//   const validateError = validator(
//     field.value as string | undefined,
//     `validate/${source}`,
//   );

//   const notify = useNotify();
//   const [value, setValue] = useState(field.value || "");
//   const [typing, setTyping] = useState(false);
//   const typingInterval = 1000; // Time in milliseconds

//   // useEffect(() => {
//   //   if (validateError?.error) {
//   //     notify(validateError.message, { type: "warning" });
//   //   }
//   // }, [validateError, notify]);

//   useEffect(() => {
//     console.log(typing);
//     if (typing) {
//       const timer = setTimeout(() => {
//         setTyping(false);
//         const validateError = validator(value, `validate/${source}`);
//         console.log(validateError);
//         if (validateError?.error) {
//           notify(validateError.message, { type: "warning" });
//         }
//       }, typingInterval);
//       return () => clearTimeout(timer);
//     }
//   }, [typing, value, notify, source]);
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//     setTyping(true);
//   };

//   const renderHelperText = helperText !== false || invalid;
//   // const isError = validateError?.error || invalid;
//   const isError = validator(value, `validate/${source}`)?.error || invalid;
//   // console.log(usernameError?.error);
//   return (
//     <ResettableTextField
//       id={id}
//       {...field}
//       className={clsx("ra-input", `ra-input-${source}`, className)}
//       value={value}
//       onChange={handleChange}
//       label={
//         label !== "" && label !== false ? (
//           <FieldTitle label={label} source={source} isRequired={isRequired} />
//         ) : null
//       }
//       // resource={resource}
//       error={isError}
//       helperText={
//         renderHelperText ? (
//           <InputHelperText
//             error={validateError?.message || error?.message}
//             helperText={helperText}
//           />
//         ) : null
//       }
//       {...sanitizeInputRestProps(rest)}
//     />
//   );
// };

// export default ValidationInput;

import React, { useEffect, useMemo, useState } from "react";
import { useInput, useTranslate } from "react-admin";
import { FieldError, IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { serverValidator, useRequired } from "../Utils/validator";
import {
  ResettableTextField,
  FieldTitle,
  sanitizeInputRestProps,
} from "react-admin";
import "../Styles/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import { CircularProgress } from "@mui/material";
import { InputHelper } from "../CustomComponents/InputHelper";
import { useFormContext } from "react-hook-form";
// export interface IconTextInputProps extends PasswordInputProps {
//   iconStart?: React.ReactNode;
//   iconEnd?: React.ReactNode;
//   strengthMeter?: boolean;
//   passwordValue?: string; // Props for RepasswordInput to receive the password field value
// }

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
    validate = [],
    iconStart,
    iconEnd,
    ...rest
  } = props;

  const { setError, clearErrors } = useFormContext();
  // const translate = useTranslate();
  // Get required validator
  const require = useRequired();

  // Compute validators with normalization
  const validators = useMemo(() => {
    const normalizedValidate = Array.isArray(validate) ? validate : [validate];
    const baseValidators = [...normalizedValidate];
    baseValidators.push(require());
    return baseValidators;
  }, [validate, require]);

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
    validate: validators,
    onBlur,
    onChange,
    ...rest,
  });

  // const notify = useNotify();
  const [value, setValue] = useState(field.value || "");
  const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  // const [validateError, setValidateError] = useState<FieldError | null>(null);
  const [focused, setFocused] = useState(false);
  // const [asyncError, setAsyncError] = useState<string | undefined>();
  const [validMessage, setValidMessage] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);

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

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    field.onBlur();
    validteResult();
    // if (value === "") {
    //   const displayLabel = label ? label : StringUtils.capitalize(source);
    //   const fieldError = {
    //     error: true,
    //     message: `${displayLabel} is required`,
    //   };
    //   setValidateError(fieldError);
    //   setShake(true);
    //   setTimeout(() => setShake(false), 500);
    // }
  };

  const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  useEffect(() => {
    // const validateInput = async () => {
    //   const result = await serverValidator(value, `validate/${source}`);
    //   setValidateError(result);
    //   if (result?.invalid) {
    //     // notify(result.message, { type: "warning" });
    //     setShake(true);
    //     setTimeout(() => setShake(false), 500);
    //   }
    // };

    const validateAsync = async () => {
      setIsValidating(true); // Start validation
      setValidMessage("");
      try {
        const result = await serverValidator(value, `validate/${source}`);
        if (result.invalid) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setError(source, {
            type: "validate",
            message: result.message,
          }); // Error message is already translated in validateStrength
        } else {
          clearErrors(source);
          setValidMessage(result.message || "");
        }
        console.log(result);
      } catch (err) {
        setError(source, { type: "validate", message: "Validation failed" });
      } finally {
        setIsValidating(false); // End validation
      }
    };

    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
        // validateInput();
        validateAsync();
      }, typingInterval);
      return () => clearTimeout(timer);
    }
  }, [typing, value, source, typingInterval, setError, clearErrors]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(e?.target?.value ?? e);
  //   setTyping(true);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
    setTyping(true);
  };

  // Combine sync and async errors
  // const isError = invalid || !!asyncError;
  const errMsg = error?.message || validMessage || "";
  const renderHelperText = helperText !== false || invalid;
  const helper = !!(helperText || errMsg);
  console.log("hepler :", helper);
  // const isError = validateError?.invalid || invalid;
  // const errMsg = validateError?.message || error?.message;
  // console.log("Error: ", error?.message);

  return (
    <ResettableTextField
      id={id}
      {...field}
      value={value}
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
        formHelperText: {
          className: clsx({ helper: !helper }),
        },
      }}
      label={
        label !== "" && label !== false ? (
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        ) : null
      }
      resource={resource}
      error={invalid}
      // helperText={isError ? errMsg : ""}
      // helperText={validateError?.message || error?.message}
      // helperText={
      //   renderHelperText ? (
      //     <InputHelperText
      //       error={validateError?.message || error?.message}
      //       helperText={helperText}
      //     />
      //   ) : null
      // }
      // FormHelperTextProps={{
      //   className: "my-custom-helper-text", // Your custom class
      //   // Optional: Additional MUI props like 'sx'
      //   sx: { fontSize: "0.875rem" },
      // }}
      helperText={
        renderHelperText ? (
          <InputHelper error={errMsg} helperText={helperText} />
        ) : null
      }
      {...sanitizeInputRestProps(rest)}
    />
  );
};

export default ValidationInput;
