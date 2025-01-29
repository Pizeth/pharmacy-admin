import { ChangeEvent, useCallback, useEffect, useState } from "react";
import loadZxcvbn, { loadDebounce } from "../Utils/lazyZxcvbn";

const zxcvbnAsync = await loadZxcvbn();

export interface UsePasswordInputProps {
  initialPassword: string;
  initiallyVisible: boolean;
  passwordValue?: string;
  strengthMeter: boolean;
}

const usePasswordInput = ({
  initialPassword,
  initiallyVisible,
  passwordValue,
  strengthMeter,
}: UsePasswordInputProps) => {
  const [visible, setVisible] = useState(initiallyVisible);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(initialPassword || "");
  const [errMessage, setErrMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [validateError, setValidateError] = useState(false);
  const interval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  const validatePassword = useCallback(async () => {
    const result = await zxcvbnAsync(value);
    const warningMsg = result.feedback.warning;
    const suggestMsg = result.feedback.suggestions.join(" ");
    const isValid = result.score <= 0;

    setValidateError(isValid);
    setErrMessage(warningMsg || "");
    setPasswordStrength(result.score);
    setPasswordFeedback(
      result ? suggestMsg : (warningMsg ?? "").concat(` ${suggestMsg}`),
    );
    if (result) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [value]);

  useEffect(() => {
    if (strengthMeter) {
      if (value === "") {
        setValidateError(false);
        return;
      }

      if (typing) {
        const timer = setTimeout(async () => {
          setTyping(false);
          const debounce = await loadDebounce();
          debounce(validatePassword, 500)();
        }, interval);
        return () => clearTimeout(timer);
      }
    } else {
      const result = passwordValue !== value && value !== "";
      setValidateError(result);
      setErrMessage(result ? "Passwords do not match!" : "");
      if (result) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  }, [passwordValue, typing, value, interval, strengthMeter, validatePassword]);

  const handleClick = () => setVisible(!visible);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue);
    setTyping(true);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const isError = validateError;

  return {
    visible,
    passwordStrength,
    passwordFeedback,
    value,
    errMessage,
    focused,
    shake,
    validateError,
    isError,
    handleClick,
    handlePasswordChange,
    handleFocus,
    handleBlur,
  };
};

export default usePasswordInput;
