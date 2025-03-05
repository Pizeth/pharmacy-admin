import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { useInput, useTranslate } from "react-admin";
import { DEFAULT_DEBOUNCE, IconTextInputProps } from "../Types/types";
import clsx from "clsx";
import { useAsyncValidator, useRequired } from "../Utils/validator";
import { FieldTitle, sanitizeInputRestProps } from "react-admin";
import "../Styles/style.css";
import { InputHelper } from "../CustomComponents/InputHelper";
import { useAtomValue } from "jotai";
import { validationMessagesAtom } from "../Stores/validationStore";
import ResettableIconInputField from "../Utils/ResettableIconInputField";

const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

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

  // Get required validator
  const require = useRequired(translate);
  const asyncValidate = useAsyncValidator({
    debounce: DEFAULT_DEBOUNCE,
  });
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    field.onChange(newValue); // Ensure form data is in sync
    setTyping(true);
  };

  // Update the useEffect for handling validation after typing and async completion
  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, typingInterval);
      return () => clearTimeout(timer);
    }
  }, [typing, typingInterval]);

  // New useEffect to handle validation completion
  useEffect(() => {
    if (!typing && !isValidating) {
      reValidate();
    }
  }, [typing, isValidating]); // Trigger when either typing stops or validation completes

  // Simplify reValidate to use current validation state
  const reValidate = () => {
    if (invalid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // const reValidate = () => {
  //   const isInvalid = (isRequired && !field.value) || invalid;
  //   console.log("field.value", field.value);
  //   console.log("isRequired", isRequired);
  //   console.log("is invalid", isInvalid);
  //   if (isInvalid) {
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

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    // reValidate();
    field.onBlur();
  };

  // Combine sync and async errors
  const successMessage = useAtomValue(validationMessagesAtom);
  const errMsg = error?.message || successMessage[source];
  console.log(helperText);
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    successMessage ||
    invalid
  );
  const helper = !!(helperText || errMsg);

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
      // helperText={
      //   renderHelperText ? (
      //     <InputHelper error={errMsg} helperText={helperText} />
      //   ) : null
      // }
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
