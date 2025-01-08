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

import React, { useEffect, useState } from "react";
import { TextInputProps, useInput, useNotify } from "react-admin";
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

const StyledTextField = styled(ResettableTextField)(({ theme, error }) => ({
  "& .MuiInputBase-root": {
    borderColor: error ? theme.palette.error.main : "inherit",
  },
  "& .MuiInputBase-input::placeholder": {
    color: error ? theme.palette.error.main : "inherit",
    transition: "color 0.5s",
  },
  // "& .MuiInputLabel-root": {
  //   verticalAlign: "middle", // Ensure the label doesn't shift down
  //   transformOrigin: "left center", // Ensure the label doesn't resize
  // },
}));

const ValidationInput = (props: TextInputProps) => {
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
  // const [validateError, setValidateError] = useState(null);
  const [validateError, setValidateError] = useState<FieldError | null>(null);
  const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds
  // const inputRef = useRef<HTMLInputElement>();

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

  // useEffect(() => {
  //   setValue(field.value || "");
  //   setValidateError(null); // Reset validation error on reset
  // }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value ?? e);
    setTyping(true);
    // if (onChange) {
    //   onChange(e); // Ensure parent component's onChange is called
    // }
  };

  // const handleChange = (eventOrValue: any) => {
  //   const newValue = eventOrValue?.target?.value ?? eventOrValue;
  //   setValue(newValue);
  //   setTyping(true);
  //   if (onChange) {
  //     onChange({ target: { value: newValue } }); // Ensure parent component's onChange is called
  //   }
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = event.target.value;
  //   setValue(newValue);
  //   setTyping(true);
  //   if (onChange) {
  //     onChange(event); // Ensure parent component's onChange is called
  //   }
  // };
  // const handleReset = () => {
  //   setValue("");
  //   setValidateError(null);
  //   setTyping(false);
  //   if (onChange) {
  //     onChange({
  //       target: { value: "" },
  //     } as unknown as React.ChangeEvent<HTMLInputElement>); // Reset the parent component's value
  //   }
  // };

  // const handleReset = () => {
  //   setValue("");
  //   setValidateError(null);
  //   setTyping(false);
  //   if (onChange) {
  //     onChange({ target: { value: "" } }); // Reset the parent component's value
  //   }
  // };

  const renderHelperText = helperText !== false || invalid;
  const isError = validateError?.error || invalid;

  return (
    <StyledTextField
      id={id}
      {...field}
      value={value}
      onChange={handleChange}
      // onClickClearButton={handleReset}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      variant="outlined"
      // InputLabelProps={{
      //   className: clsx({ shake: shake }),
      // }}
      InputLabelProps={{
        shrink: true, // Ensure the label stays at the top of the outline
        classes: { root: shake ? "shake" : "" },
      }}
      label={
        label !== "" && label !== false ? (
          // <span className={clsx({ shake: shake })}>
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        ) : /* </span> */
        null // <FieldTitle label={label} source={source} isRequired={isRequired} />
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
      // inputRef={inputRef}
    />
  );
};

export default ValidationInput;
