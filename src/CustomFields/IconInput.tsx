import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  FieldTitle,
  sanitizeInputRestProps,
  isEmpty,
  useInput,
  useTranslate,
} from "react-admin";
import { IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import "../Styles/style.css";
import { InputHelper } from "../CustomComponents/InputHelper";
import ResettableIconInputField from "../Utils/ResettableIconInputField";

const ValidationInput = forwardRef((props: IconTextInputProps, ref) => {
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
    validate = [],
    ...rest
  } = props;

  const translate = useTranslate();
  const initialValueRef = useRef("");
  const inputRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLLabelElement | null>(null); // Ref for shake effect
  const [focused, setFocused] = useState(false);
  // const { clearErrors } = useFormContext();

  const {
    field,
    fieldState: { error, invalid, isValidating },
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

  // const [value, setValue] = useState(field.value || "");
  // const [shake, setShake] = useState(false);

  // const validteResult = () => {
  //   const isInvalid = isRequired && !value;
  //   // setValidateError(isInvalid);
  //   if (isInvalid) {
  //     setShake(true);
  //     setTimeout(() => setShake(false), 500);
  //     // const displayLabel = label ? label : StringUtils.capitalize(source);
  //     // setErrMessage(`${displayLabel} is required`);
  //   }
  //   // if (isError || (isRequired && value == "")) {
  //   //   setShake(true);
  //   //   setTimeout(() => setShake(false), 500);
  //   // }
  // };

  // Handle shake effect without useState
  useEffect(() => {
    if (!isValidating && invalid && inputRef.current) {
      shakeRef.current = inputRef.current.querySelector(".MuiInputLabel-root");
      if (shakeRef.current) {
        shakeRef.current.classList.add("shake");
        setTimeout(() => {
          if (shakeRef.current) {
            shakeRef.current.classList.remove("shake");
          }
        }, 500); // Matches animation duration
      }
    }
    // } else {
    //   clearErrors(source);
    // }
  }, [isValidating, invalid, source]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    // setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    if (
      field.value !== initialValueRef.current ||
      (isRequired && isEmpty(field.value))
    ) {
      field.onBlur();
    }
  };

  const errMsg = error?.message;
  const renderHelperText = !!(helperText || errMsg || invalid);
  const helper = !!(helperText || errMsg || isValidating);

  return (
    <ResettableIconInputField
      id={id}
      {...field}
      ref={inputRef}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      isValidating={isValidating}
      isFocused={focused}
      // slotProps={{
      //   input: {
      //     startAdornment: iconStart ? (
      //       <InputAdornment position="start">{iconStart}</InputAdornment>
      //     ) : null,
      //     endAdornment: iconEnd ? (
      //       <InputAdornment position="end">{iconEnd}</InputAdornment>
      //     ) : null,
      //     // endAdornment: isValidating ? (
      //     //   <CircularProgress size={20} /> // Show loading spinner
      //     // ) : iconEnd ? (
      //     //   <InputAdornment position="end">{iconEnd}</InputAdornment>
      //     // ) : null,
      //   },
      //   inputLabel: {
      //     shrink: focused || value !== "",
      //     className: clsx({ shake: shake }),
      //   },
      // }}
      helper={helper}
      label={
        label !== "" && label !== false ? (
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        ) : null
      }
      resource={resource}
      error={invalid}
      helperText={
        renderHelperText && (
          <InputHelper
            error={
              // Show validation message only when NOT in validating state
              isValidating ? undefined : errMsg
            }
            helperText={
              // Show "Validating..." text during async validation
              isValidating
                ? translate("razeth.validation.validating")
                : helperText
            }
          />
        )
      }
      {...sanitizeInputRestProps(rest)}
      inputRef={ref}
    />
  );
});

export default ValidationInput;
