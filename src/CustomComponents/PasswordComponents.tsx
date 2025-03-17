import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import PasswordValidationInput from "../fortest";
import { PasswordFieldProps } from "../Types/types";

const PasswordFields = (props: PasswordFieldProps) => {
  const { className, iconStart, password, rePassword } = props;
  // const [password, setPassword] = useState<string>("");
  const { watch, trigger } = useFormContext();

  // Watch the password field value
  const passwordValue = watch("password");

  // Trigger rePassword validation when password changes
  useEffect(() => {
    trigger("rePassword");
  }, [trigger, passwordValue]);

  return (
    <>
      <PasswordValidationInput
        source={password}
        iconStart={iconStart}
        className={className}
        strengthMeter
      />
      <PasswordValidationInput
        source={rePassword}
        iconStart={iconStart}
        className={className}
        passwordValue={passwordValue}
      />
    </>
  );
};

export default PasswordFields;
