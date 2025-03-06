import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useInput, useTranslate } from "react-admin";
import { IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import { useAsyncValidator, useRequired } from "../Utils/validator";
import { FieldTitle, sanitizeInputRestProps } from "react-admin";
import "../Styles/style.css";
import { InputHelper } from "../CustomComponents/InputHelper";
import { useAtom, useAtomValue } from "jotai";
import {
  clearValidationMessageAtom,
  setValidationMessageAtom,
  validationMessagesAtom,
} from "../Stores/validationStore";
import ResettableIconInputField from "../Utils/ResettableIconInputField";
import { useFormContext } from "react-hook-form";

export const ValidationInput = forwardRef((props: IconTextInputProps, ref) => {
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
    ...rest
  } = props;

  const translate = useTranslate();
  const [, setMessage] = useAtom(setValidationMessageAtom);
  const [, clearMessage] = useAtom(clearValidationMessageAtom);

  // Use refs for transient UI states
  const shakeRef = useRef<HTMLDivElement>(null); // Ref for shake effect

  // const shakeTimeoutRef = useRef<NodeJS.Timeout>();
  // const inputRef = useRef<HTMLDivElement>(null);

  // Get required and async validators
  const require = useRequired(translate);
  const asyncValidate = useAsyncValidator(setMessage, clearMessage);
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState(false);
  const { clearErrors } = useFormContext();

  // Compute validators with normalization
  const validators = useMemo(() => {
    const normalizedValidate = Array.isArray(validate) ? validate : [validate];
    const baseValidators = [...normalizedValidate];
    baseValidators.push(require());
    baseValidators.push(asyncValidate());
    return baseValidators;
  }, [validate, require, asyncValidate]);

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
    validate: validators,
    onBlur,
    onChange,
    ...rest,
  });

  // Update the useEffect for handling async validation valid state and shake effect
  useEffect(() => {
    if (!isValidating && invalid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      clearErrors(source);
    }
  }, [isValidating, invalid, source, clearErrors]);

  // Handle shake effect without useState
  // useEffect(() => {
  //   if (!isValidating && invalid && shakeRef.current) {
  //     console.log("Shake effect");
  //     shakeRef.current?.classList.add("shake");
  //     setTimeout(() => {
  //       if (shakeRef.current) {
  //         shakeRef.current.classList.remove("shake");
  //       }
  //     }, 500); // Matches animation duration
  //   } else {
  //     // clearErrors(source);
  //   }
  // }, [isValidating, invalid, source, clearErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    field.onChange(newValue); // Ensure form data is in sync
  };
  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    field.onBlur();
  };

  // Combine sync and async errors
  const successMessage = useAtomValue(validationMessagesAtom);
  const errMsg = error?.message || successMessage[source];
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    successMessage ||
    invalid
  );
  const helper = !!(helperText || errMsg || isValidating);

  return (
    <ResettableIconInputField
      id={id}
      {...field}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      isValidating={isValidating}
      isFocused={focused}
      isShake={shake}
      helper={helper}
      label={
        label !== "" && label !== false ? (
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        ) : null
      }
      resource={resource}
      error={invalid}
      isSuccess={Object.keys(successMessage).length !== 0}
      // Show validation status in helper text
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

// // Update the useEffect for handling validation after typing and async completion
// useEffect(() => {
//   if (typing) {
//     const timer = setTimeout(() => {
//       setTyping(false);
//     }, typingInterval);
//     return () => clearTimeout(timer);
//   }
// }, [typing, typingInterval]);

// // New useEffect to handle validation completion
// useEffect(() => {
//   if (!typing && !isValidating) {
//     reValidate();
//   }
// }, [typing, isValidating]); // Trigger when either typing stops or validation completes

// // Simplify reValidate to use current validation state
// const reValidate = () => {
//   if (invalid) {
//     setShake(true);
//     setTimeout(() => setShake(false), 500);
//   }
// };

// Optimize valid state updates
// useEffect(() => {
//   if (typing) {
//     const timer = setTimeout(() => {
//       setTyping(false);
//       reValidate();
//     }, typingInterval);
//     return () => clearTimeout(timer);
//   }
// }, [typing, typingInterval]);
