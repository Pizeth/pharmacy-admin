import React, { useEffect } from "react";
import { TextInput, useNotify, useInput, InputProps } from "react-admin";
import validator from "../Utils/validator";

// type UsernameInputProps = InputProps
const UsernameInput: React.FC<InputProps> = (props) => {
  const {
    field: { value },
  } = useInput(props);
  const error = validator(value as string | undefined);

  const notify = useNotify();

  useEffect(() => {
    if (error) {
      notify(error, { type: "warning" });
    }
  }, [error, notify]);

  return (
    <TextInput
      {...props}
      error={!!error}
      helperText={error ? error : " "}
      validate={error ? () => ({ message: error, args: {} }) : undefined}
    />
  );
};

export default UsernameInput;
