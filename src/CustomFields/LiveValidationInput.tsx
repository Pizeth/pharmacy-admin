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
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import {
  ResettableTextFieldClasses,
  useInput,
  useTranslate,
} from "react-admin";
import { DEFAULT_DEBOUNCE, IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import { useAsyncValidator, useRequired } from "../Utils/validator";
import {
  ResettableTextField,
  FieldTitle,
  sanitizeInputRestProps,
} from "react-admin";
import "../Styles/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import { InputHelper } from "../CustomComponents/InputHelper";
// import { useFormContext } from "react-hook-form";
import { useAtomValue } from "jotai";
import { validationMessagesAtom } from "../Stores/validationStore";
import EndAdornment from "../CustomComponents/EndAdorment";

const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

const ValidationInput = forwardRef((props: IconTextInputProps, ref) => {
  const {
    className,
    defaultValue,
    label,
    // value,
    format,
    helperText,
    onBlur,
    onChange,
    parse,
    resource,
    source,
    slotProps,
    clearAlwaysVisible,
    resettable,
    disabled,
    readOnly,
    variant,
    validate,
    iconStart,
    iconEnd,
    ...rest
  } = props;

  const handleClickClearButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onChange && onChange("");
    },
    [onChange],
  );

  const translate = useTranslate();
  // const { setError, clearErrors } = useFormContext();
  // const { setError, clearErrors, dirtyFields } = useFormState();
  // Get required validator
  const require = useRequired(translate);
  // const { validate: asyncValidate, successMessage } = useAsyncValidator({
  //   debounce: DEFAULT_DEBOUNCE,
  // });
  const asyncValidate = useAsyncValidator({
    debounce: DEFAULT_DEBOUNCE,
  });
  // const [value, setValue] = useState(field.value || "");
  // const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  // const [validateError, setValidateError] = useState<FieldError | null>(null);
  const [focused, setFocused] = useState(false);
  // const [asyncError, setAsyncError] = useState<string | undefined>();
  // const [validMessage, setValidMessage] = useState<string | undefined>();

  // Compute validators with normalization
  // const validators = useMemo(() => {
  //   const normalizedValidate = Array.isArray(validate) ? validate : [validate];
  //   const baseValidators = [...normalizedValidate];
  //   baseValidators.push(require());
  //   baseValidators.push(asyncValidate());
  //   return baseValidators;
  // }, [validate, require, asyncValidate]);
  // }, [asyncValidate, require, validate]);

  // const asyncValidator = useMemo(
  //   () => async (value: string) => {
  //     // Clear previous timeout and request
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //     if (abortRef.current) abortRef.current.abort();

  //     return new Promise((resolve) => {
  //       timeoutRef.current = setTimeout(
  //         async () => {
  //           try {
  //             abortRef.current = new AbortController();
  //             lastValueRef.current = value;

  //             const response = await axios.get(
  //               `${API_URL}/validate/${source}/${value}`,
  //               { signal: abortRef.current.signal },
  //             );

  //             const data = response.data;
  //             if (data.status !== "OK") {
  //               resolve({
  //                 message: data.message,
  //                 args: {
  //                   source,
  //                   value,
  //                   field: translateLabel({
  //                     label: props.label,
  //                     source,
  //                     resource,
  //                   }),
  //                 },
  //               });
  //             } else {
  //               resolve(undefined);
  //             }
  //           } catch (error) {
  //             if (!axios.isCancel(error)) {
  //               resolve({ message: "ra.notification.http_error" });
  //             }
  //           }
  //         },
  //         Number(import.meta.env.VITE_DELAY_CALL) || 2500,
  //       );
  //     });
  //   },
  //   [source, resource, translateLabel, props.label],
  // );

  const {
    field,
    fieldState: { error, invalid, isValidating },
    formState: { dirtyFields },
    id,
    isRequired,
  } = useInput({
    defaultValue,
    format,
    parse,
    resource,
    source,
    type: "text",
    validate: [require(), asyncValidate()],
    // asyncValidator,
    // validate: [
    //   ...validators,
    //   async (value) => {
    //     const result = await asyncValidate()(value, props);
    //     if (!result) {
    //       return undefined; // No error
    //     }
    //     if (result.status === StatusCodes.OK) {
    //       return result;
    //     }
    //     return result;
    //   },
    // ],

    // Your other validators
    // async (value, allValues: any, props: IconTextInputProps) => {
    //   if (isEmpty(value))
    //     return {
    //       message: "razeth.validation.required",
    //       args: {
    //         source: source,
    //         value,
    //         field: translateLabel({
    //           label: props.label,
    //           source: source,
    //           resource,
    //         }),
    //       },
    //       isRequired: true,
    //     };
    //   // Clear previous timeout
    //   if (typingTimeout.current) {
    //     clearTimeout(typingTimeout.current);
    //   }
    //   // Cancel previous request
    //   if (abortController.current) {
    //     abortController.current.abort();
    //   }
    //   return new Promise((resolve) => {
    //     typingTimeout.current = setTimeout(async () => {
    //       abortController.current = new AbortController();
    //       try {
    //         const response = await axios.get(
    //           `${API_URL}/validate/${source}/${value}`,
    //           { signal: abortController.current.signal },
    //         );
    //         const data = response.data;
    //         console.log(data.status);
    //         if (data.status !== "OK") {
    //           resolve({
    //             message: data.message,
    //             args: {
    //               source: source,
    //               value,
    //               field: translateLabel({
    //                 label: props.label,
    //                 source: source,
    //                 resource,
    //               }),
    //             },
    //           });
    //         } else {
    //           resolve(undefined);
    //         }
    //       } catch (error) {
    //         if (!axios.isCancel(error)) {
    //           resolve({ message: "ra.notification.http_error", args: {} });
    //         }
    //       }
    //     }, typingInterval); // Your VITE_DELAY_CALL value
    //   });
    // },
    // async (value) => {
    // const result = await asyncValidator(value);
    // if (result?.status === "success") {
    //   setStatusMessage(result.message);
    //   return undefined; // No error
    // }
    // if (result?.status === "error") {
    //   setStatusMessage(""); // Clear success message
    //   return result.message;
    // }
    // return undefined;
    // const result = await asyncValidator({
    //   timeOut: typingTimeout,
    //   abortController: abortController,
    // });
    // if (!result) return undefined;
    // const validationResult = await result(value, source, props);
    // if (validationResult && validationResult.status === 200) {
    //   setStatusMessage(validationResult.message);
    //   return undefined;
    // }
    // setStatusMessage("");
    // return validationResult?.message;
    // },
    // async (value) => {
    //   const result = await validator.validate(value);
    //   setStatus(result);
    //   if (result.status === "error") {
    //     return result.message;
    //   }
    //   return undefined;
    // },
    // asyncValidator,
    // useAsyncValidator(source, {
    //   debounce: DEFAULT_DEBOUNCE,
    // }),
    onBlur,
    onChange,
    ...rest,
  });

  // const validateAsync = React.useCallback(async () => {
  //   setIsValidating(true); // Start validation
  //   // setValidMessage("");
  //   try {
  //     const result = await serverValidator(field.value, `validate/${source}`);
  //     if (result.invalid) {
  //       setShake(true);
  //       setTimeout(() => setShake(false), 500);
  //       setError(source, {
  //         type: "validate",
  //         message: result.message,
  //       }); // Error message is already translated in validateStrength
  //     } else {
  //       clearErrors(source);
  //       setValidMessage(result.message || "");
  //     }
  //     console.log(result);
  //   } catch (err) {
  //     setError(source, { type: "validate", message: "Validation failed" });
  //   } finally {
  //     // setIsValidating(false); // End validation
  //   }
  // }, [value, source, setError, clearErrors]);

  // useEffect(() => {
  //   // const validateAsync = async () => {
  //   //   setIsValidating(true); // Start validation
  //   //   setValidMessage("");
  //   //   try {
  //   //     const result = await serverValidator(value, `validate/${source}`);
  //   //     if (result.invalid) {
  //   //       setShake(true);
  //   //       setTimeout(() => setShake(false), 500);
  //   //       setError(source, {
  //   //         type: "validate",
  //   //         message: result.message,
  //   //       }); // Error message is already translated in validateStrength
  //   //     } else {
  //   //       console.log("why jol here?");
  //   //       clearErrors(source);
  //   //       setValidMessage(result.message || "");
  //   //     }
  //   //     console.log(result);
  //   //   } catch (err) {
  //   //     setError(source, { type: "validate", message: "Validation failed" });
  //   //   } finally {
  //   //     setIsValidating(false); // End validation
  //   //   }
  //   // };
  //   // if (!isValidating && !error && dirtyFields && !invalid) {
  //   //   clearErrors(source);
  //   // }

  //   if (typing) {
  //     const timer = setTimeout(() => {
  //       setTyping(false);
  //       // validateAsync();
  //     }, typingInterval);
  //     return () => clearTimeout(timer);
  //   }
  // }, [typing, source, typingInterval /*setError, clearErrors*/]);

  // Optimize valid state updates
  // useEffect(() => {}, [
  //   clearErrors,
  //   dirtyFields,
  //   error,
  //   invalid,
  //   isValidating,
  //   source,
  // ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    // setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
    // setTyping(true);
  };

  const reValidate = () => {
    const isInvalid = (isRequired && !field.value) || invalid;
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
    // setFocused(false);
    reValidate();
    field.onBlur();

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

  const handleMouseDownClearButton = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
  };

  const {
    // clearButton,
    // clearIcon,
    inputAdornedEnd,
    // selectAdornment,
    // visibleClearIcon,
  } = ResettableTextFieldClasses;
  // const d = ResettableTextFieldClasses;

  // const { input } = slotProps || {};
  // const inputProps = typeof input === "function" ? {} : input || {};
  // const { endAdornment, ...InputPropsWithoutEndAdornment } = inputProps;

  const inputProps = (slotProps && slotProps.input) || {};
  const { endAdornment, ...InputPropsWithoutEndAdornment } =
    typeof inputProps === "function" ? {} : inputProps;

  console.log("clearAlwaysVisible: ", clearAlwaysVisible);
  if (clearAlwaysVisible && endAdornment) {
    throw new Error(
      "ResettableTextField cannot display both an endAdornment and a clear button always visible",
    );
  }
  // const { endAdornment, ...InputPropsWithoutEndAdornment } =
  //   (slotProps && slotProps.input) ||
  //   (typeof slotProps?.input === "function" ? {} : slotProps?.input) ||
  //   {};
  const endAdornmentElement = EndAdornment({
    props,
    classess: ResettableTextFieldClasses,
    endAdornment,
    translate,
    handleClickClearButton,
    handleMouseDownClearButton,
  });

  // const getEndAdornment = () => {
  //   if (!resettable) {
  //     return endAdornment;
  //   } else if (!value) {
  //     if (clearAlwaysVisible) {
  //       // show clear button, inactive
  //       return (
  //         <InputAdornment
  //           position="end"
  //           className={props.select ? selectAdornment : undefined}
  //         >
  //           <IconButton
  //             className={clearButton}
  //             aria-label={translate("ra.action.clear_input_value")}
  //             title={translate("ra.action.clear_input_value")}
  //             disabled={true}
  //             size="large"
  //           >
  //             <ClearIcon className={clsx(clearIcon, visibleClearIcon)} />
  //           </IconButton>
  //         </InputAdornment>
  //       );
  //     } else {
  //       if (endAdornment) {
  //         return endAdornment;
  //       } else {
  //         // show spacer
  //         return (
  //           <InputAdornment
  //             position="end"
  //             className={props.select ? selectAdornment : undefined}
  //           >
  //             <span className={clearButton}>&nbsp;</span>
  //           </InputAdornment>
  //         );
  //       }
  //     }
  //   } else {
  //     // show clear
  //     return (
  //       <InputAdornment
  //         position="end"
  //         className={props.select ? selectAdornment : undefined}
  //       >
  //         <IconButton
  //           className={clearButton}
  //           aria-label={translate("ra.action.clear_input_value")}
  //           title={translate("ra.action.clear_input_value")}
  //           onClick={handleClickClearButton}
  //           onMouseDown={handleMouseDownClearButton}
  //           disabled={disabled || readOnly}
  //           size="large"
  //         >
  //           <ClearIcon
  //             className={clsx(clearIcon, {
  //               [visibleClearIcon]: clearAlwaysVisible || value,
  //             })}
  //           />
  //         </IconButton>
  //       </InputAdornment>
  //     );
  //   }
  // };

  // Combine sync and async errors
  // const isError = invalid || !!asyncError;
  // const successMessage = validationMessages.value[source];
  const successMessage = useAtomValue(validationMessagesAtom);
  const errMsg = error?.message || successMessage[source];
  // const renderHelperText = helperText !== false || invalid;
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    successMessage ||
    invalid
  );
  const helper = !!((helperText || errMsg) /*|| status.message*/);

  return (
    <ResettableTextField
      id={id}
      {...field}
      // value={value}
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
      // InputProps={{
      //   readOnly: readOnly,
      //   classes:
      //     props.select && variant === "filled"
      //       ? { adornedEnd: inputAdornedEnd }
      //       : {},
      //   endAdornment: endAdornmentElement,
      //   ...InputPropsWithoutEndAdornment,
      // }}
      slotProps={{
        input: {
          classes:
            props.select && variant === "filled"
              ? { adornedEnd: inputAdornedEnd }
              : {},
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
          // endAdornment: isValidating ? (
          //   <CircularProgress size={20} /> // Show loading spinner
          // ) : iconEnd ? (
          //   <InputAdornment position="end">{iconEnd}</InputAdornment>
          // ) : (
          //   endAdornmentElement
          // ),
          endAdornment: endAdornmentElement,
          ...InputPropsWithoutEndAdornment,
        },
        inputLabel: {
          shrink: focused || field.value !== "",
          className: clsx({ shake: shake }),
        },
        formHelperText: {
          className: clsx({ helper: !helper }),
          sx: {
            color: error ? "#F58700" : "#4CAF50",
            fontWeight: successMessage ? "bold" : undefined,
          },
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
      inputRef={ref}
    />
  );
});

export default ValidationInput;
