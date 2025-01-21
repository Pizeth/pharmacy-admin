import * as React from "react";
import { useEffect, useState } from "react";
import { useInput, useTranslate } from "ra-core";
import { InputAdornment, IconButton, Typography, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputHelperText, TextInput } from "react-admin";
import { IconTextInputProps } from "./LiveValidationInput";
import { clsx } from "clsx";
import LinearProgressWithLabel from "../CustomComponents/LinearProgessWithLabel";
import {
  zxcvbn,
  zxcvbnOptions,
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

const PasswordInputMeter = (props: IconTextInputProps) => {
  const {
    initiallyVisible = false,
    iconStart,
    onChange,
    label,
    helperText,
    className,
    source,
    ...rest
  } = props;
  const {
    field,
    fieldState: { invalid, error },
    isRequired,
  } = useInput(props);
  const [visible, setVisible] = useState(initiallyVisible);
  const translate = useTranslate();

  const handleClick = () => {
    setVisible(!visible);
  };

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [value, setValue] = useState(field.value || "");
  const [errMessage, setErrMessage] = useState(error?.message || "");
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [validateError, setValidateError] = useState(false);
  const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

  const regexMatcher: Matcher = {
    Matching: class MatchRegex {
      regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
    // matchers: { regexMatcher },
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

  useEffect(() => {
    const validatePassword = async () => {
      zxcvbnAsync(value).then((res) => {
        const warningMsg = res.feedback.warning;
        const suggestMsg = res.feedback.suggestions.join(" ");
        setPasswordStrength(res.score);
        setPasswordFeedback(
          warningMsg ? warningMsg.concat(` ${suggestMsg}`) : suggestMsg,
        );
        setErrMessage(warningMsg || "");
        const result = res.score <= 0;
        setValidateError(result);
        if (result) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      });
    };

    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
        const debouncedValidation = debounce(validatePassword, 2500, true);
        debouncedValidation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [typing, value, typingInterval]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setValue(e?.target?.value ?? e);
    setTyping(true);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  // const renderHelperText = helperText !== false || invalid;
  const isError = validateError || invalid;
  console.log("isError", isError);

  // const renderHelperText = helperText !== false || invalid;
  // const isError = validateError?.error || invalid;

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
      <TextInput
        source={source}
        type={visible ? "text" : "password"}
        size="small"
        onChange={handlePasswordChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={isError}
        // helperText={isError ? error?.message : ""}
        // helperText={
        //   renderHelperText ? (
        //     <InputHelperText
        //       error={errMessage || error?.message}
        //       helperText={helperText}
        //     />
        //   ) : undefined
        // }
        fullWidth={true}
        className={clsx("ra-input", `ra-input-${source}`, className)}
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
        // label={
        //   label !== "" && label !== false ? (
        //     <FieldTitle label={label} source={source} isRequired={isRequired} />
        //   ) : null
        // }
        // {...rest}
      />
      <Box>
        <LinearProgressWithLabel
          variant="determinate"
          // color="success"
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

  //   return (
  //     <Box>
  //       <TextField
  //         {...rest}
  //         id={id}
  //         name={name}
  //         type="password"
  //         label={props.label}
  //         required={isRequired}
  //         value={value}
  //         onChange={handlePasswordChange}
  //         error={!!(touched && error)}
  //         helperText={touched && error ? error : ""}
  //         fullWidth
  //       />
  //       <Box mt={2}>
  //         <LinearProgress
  //           variant="determinate"
  //           value={(passwordStrength / 4) * 100}
  //           style={{ backgroundColor: getColor(passwordStrength) }}
  //         />
  //         <Typography variant="caption" color="textSecondary">
  //           {passwordFeedback}
  //         </Typography>
  //       </Box>
  //     </Box>
  //   );
};

export default PasswordInputMeter;
