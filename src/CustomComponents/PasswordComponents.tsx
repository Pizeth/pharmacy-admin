import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Password } from "@mui/icons-material";
import PasswordValidationInput from "../fortest";

const PasswordFields = () => {
  // const [password, setPassword] = useState<string>("");
  const { watch, trigger } = useFormContext();

  // Watch the password field value
  const passwordValue = watch("password");

  // Trigger rePassword validation when password changes
  useEffect(() => {
    trigger("rePassword");
  }, [passwordValue, trigger]);

  return (
    <>
      <PasswordValidationInput
        source="password"
        iconStart={<Password />}
        className="icon-input"
        strengthMeter
      />
      <PasswordValidationInput
        source="rePassword"
        iconStart={<Password />}
        className="icon-input"
      />
    </>
  );
};

export default PasswordFields;
