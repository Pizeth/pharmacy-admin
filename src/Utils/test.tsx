import {
  Create,
  email,
  required,
  SaveButton,
  SimpleForm,
  Toolbar,
  ToolbarProps,
} from "react-admin";
import { useFormState } from "react-hook-form";
import ValidationInput from "../CustomFields/LiveValidationInput";
import {
  PermIdentity,
  MailOutline,
  Password,
  SwitchAccount,
} from "@mui/icons-material";
import { useState } from "react";
import PasswordValidationInput from "../fortest";
import IconInput from "../CustomFields/IconInput";

const CustomToolbar = (props: ToolbarProps) => {
  const { errors, isValid, isDirty } = useFormState();

  // const hasErrors = Object.keys(errors).length > 0;
  const hasErrors = Object.values(errors).some((error) => !!error);

  return (
    <Toolbar {...props}>
      <SaveButton disabled={hasErrors || !isValid || !isDirty} />
    </Toolbar>
  );
};

export const UserCreate = () => {
  const [password, setPassword] = useState<string>("");
  return (
    <Create>
      <SimpleForm
        toolbar={<CustomToolbar />}
        mode="all"
        reValidateMode="onBlur"
        sanitizeEmptyValues
      >
        <ValidationInput
          source="username"
          resettable
          className="icon-input"
          iconStart={<PermIdentity />}
          validate={[required()]}
        />
        <ValidationInput
          source="email"
          resettable
          className="icon-input"
          iconStart={<MailOutline />}
          type="email"
          validate={[required(), email()]}
        />
        <PasswordValidationInput
          source="password"
          iconStart={<Password />}
          className="icon-input"
          strengthMeter
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          validate={[required()]}
        />
        <PasswordValidationInput
          source="rePassword"
          passwordValue={password}
          iconStart={<Password />}
          className="icon-input"
          validate={[required()]}
        />
        <IconInput
          source="authMethod"
          className="icon-input"
          iconStart={<SwitchAccount />}
          validate={[required()]}
          resettable
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
