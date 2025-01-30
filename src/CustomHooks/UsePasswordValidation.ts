import { useCallback, useState } from "react";
import { PasswordValidationState } from "../Types/types";
import { zxcvbnAsync } from "@zxcvbn-ts/core";

// 2. usePasswordLogic.ts (custom hook)
export const usePasswordValidation = (
  initialValue = "",
  strengthCheck = false,
) => {
  const [state, setState] = useState<PasswordValidationState>({
    visible: false,
    value: initialValue,
    focused: false,
    shake: false,
    strength: 0,
    feedback: "",
  });

  const updateState = (partial: Partial<PasswordValidationState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const validate = useCallback(async (value: string) => {
    try {
      const result = await zxcvbnAsync(value);
      updateState({
        strength: result.score,
        feedback:
          result.feedback.warning || result.feedback.suggestions.join(" "),
        shake: result.score < 3,
      });
    } catch (error) {
      console.error("Validation error:", error);
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      updateState({ value, shake: false });
      if (strengthCheck) validate(value);
    },
    [validate, strengthCheck],
  );

  return {
    state,
    actions: {
      toggleVisibility: () => updateState({ visible: !state.visible }),
      handleFocus: () => updateState({ focused: true }),
      handleBlur: () => updateState({ focused: false }),
      handleChange,
    },
  };
};

export default usePasswordValidation;
