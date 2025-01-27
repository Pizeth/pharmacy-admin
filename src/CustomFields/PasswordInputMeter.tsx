import { ChangeEvent, useEffect, useState } from "react";
import { FieldTitle, useInput, useTranslate } from "ra-core";
import { InputAdornment, IconButton, Typography, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import { IconTextInputProps } from "./LiveValidationInput";
import { clsx } from "clsx";
import LinearProgressWithLabel from "../CustomComponents/LinearProgessWithLabel";
import {
  zxcvbnOptions,
  zxcvbn,
  zxcvbnAsync,
  debounce,
  Match,
  Matcher,
  MatchEstimated,
  MatchExtended,
} from "@zxcvbn-ts/core";
import { matcherPwnedFactory as PwnedMatcher } from "@zxcvbn-ts/matcher-pwned";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";

const MESSAGE = import.meta.env.VITE_PASSWORD_HINT;

// Initialize options and matcher once at the top level
const regexMatcher: Matcher = {
  Matching: class MatchRegex {
    regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

    match({ password }: { password: string }) {
      const matches: Match[] = [];
      const result = this.regex.exec(password);
      if (!result) {
        matches.push({
          pattern: "passRegex",
          token: password,
          i: 0,
          j: password.length - 1,
          lenght: password.length,
        });
      }
      return matches;
    }
  },
  feedback(match: MatchEstimated, isSoleMatch?: boolean) {
    return {
      warning: "Your password does not meet the required criteria.",
      suggestions: [
        "Password must be at least 8 characters,",
        "include uppercase,",
        "lowercase,",
        "number,",
        "and special character!",
      ],
    };
  },
  scoring(match: MatchExtended) {
    // Customize the scoring as per the match strength
    return match.token.length * 5; // Example scoring
  },
};

const matcherPwned = PwnedMatcher(fetch, zxcvbnOptions);

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);
zxcvbnOptions.addMatcher("passRegex", regexMatcher);
zxcvbnOptions.addMatcher("pwned", matcherPwned);

const PasswordInputMeter = (props: IconTextInputProps) => {
  const {
    className,
    defaultValue,
    label,
    format,
    onBlur,
    onChange,
    parse,
    resource,
    source,
    validate,
    iconStart,
    initiallyVisible = false,
    ...rest
  } = props;

  const {
    field,
    fieldState: { invalid, error },
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

  const translate = useTranslate();
  const [visible, setVisible] = useState(initiallyVisible);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(field.value || "");
  const [errMessage, setErrMessage] = useState(error?.message || "");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [validateError, setValidateError] = useState(false);
  const interval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  useEffect(() => {
    const validatePassword = async () => {
      if (value === "") {
        setValidateError(false);
        return;
      }
      const result = await zxcvbnAsync(value);
      // .then((res) => {
      //   const warningMsg = res.feedback.warning;
      //   const suggestMsg = res.feedback.suggestions.join(" ");
      //   const result = res.score <= 0;

      //   setValidateError(result);
      //   setErrMessage(warningMsg || "");
      //   setPasswordStrength(res.score);
      //   setPasswordFeedback(
      //     result
      //       ? suggestMsg
      //       : warningMsg
      //         ? warningMsg.concat(` ${suggestMsg}`)
      //         : suggestMsg,
      //   );
      //   if (result) {
      //     setShake(true);
      //     setTimeout(() => setShake(false), 500);
      //   }
      // });
      const warningMsg = result.feedback.warning;
      const suggestMsg = result.feedback.suggestions.join(" ");
      const isValid = result.score <= 0;

      setValidateError(isValid);
      setErrMessage(warningMsg || "");
      setPasswordStrength(result.score);
      setPasswordFeedback(
        result
          ? suggestMsg
          : warningMsg
            ? warningMsg.concat(` ${suggestMsg}`)
            : suggestMsg,
      );
      if (result) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    };

    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
        // validatePassword();
        const debouncedValidation = debounce(validatePassword, interval, true);
        debouncedValidation();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [typing, value, interval]);

  const handleClick = () => {
    setVisible(!visible);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue); // Ensure value state is updated
    field.onChange(newValue); // Ensure form data is in sync
    setTyping(true);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const isError = validateError || invalid;
  const errMsg = errMessage || error?.message;

  const getColor = (score: number) => {
    switch (score) {
      case 0:
        return "darkred";
      case 1:
        return "orange";
      case 2:
        return "yellow";
      case 3:
        return "blue";
      case 4:
        return "green";
      default:
        return "#dd741d";
    }
  };

  return (
    <Box width="100%">
      <ResettableTextField
        id={id}
        {...field}
        source={source}
        type={visible ? "text" : "password"}
        size="small"
        onChange={handlePasswordChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        fullWidth={true}
        className={clsx("ra-input", `ra-input-${source}`, className)}
        error={isError}
        helperText={isError ? errMsg : ""}
        InputProps={{
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={translate(
                  visible
                    ? "ra.input.password.toggle_visible"
                    : "ra.input.password.toggle_hidden",
                )}
                onClick={handleClick}
                size="large"
              >
                {visible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: focused || value !== "",
          className: clsx({ shake: shake }),
        }}
        label={
          label !== "" && label !== false ? (
            <FieldTitle label={label} source={source} isRequired={isRequired} />
          ) : null
        }
        {...sanitizeInputRestProps(rest)}
      />
      <Box>
        <LinearProgressWithLabel
          variant="determinate"
          value={(passwordStrength / 4) * 100}
          style={{ backgroundColor: getColor(passwordStrength) }}
        />
        <Typography variant="caption" color="textSecondary">
          {/* {passwordFeedback} */}
          {field.value ? passwordFeedback : MESSAGE}
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordInputMeter;
