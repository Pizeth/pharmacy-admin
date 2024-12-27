import React, { useEffect } from "react";
import { TextInputProps, useInput, useNotify } from "react-admin";
import clsx from "clsx";
import validator from "../Utils/validator";
import {
  ResettableTextField,
  FieldTitle,
  InputHelperText,
  sanitizeInputRestProps,
} from "react-admin";

const EmailInput = (props: TextInputProps) => {
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

  const usernameError = validator(
    field.value as string | undefined,
    `user/${source}`,
  );

  const notify = useNotify();

  useEffect(() => {
    if (usernameError?.error) {
      notify(usernameError.message, { type: "warning" });
    }
  }, [usernameError, notify]);

  const renderHelperText = helperText !== false || invalid;
  const isError = usernameError?.error || invalid;
  // console.log(usernameError?.error);
  return (
    <ResettableTextField
      id={id}
      {...field}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      label={
        label !== "" && label !== false ? (
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        ) : null
      }
      error={isError}
      helperText={
        renderHelperText ? (
          <InputHelperText
            error={usernameError?.message || error?.message}
            helperText={helperText}
          />
        ) : null
      }
      {...sanitizeInputRestProps(rest)}
    />
  );
};

export default EmailInput;
