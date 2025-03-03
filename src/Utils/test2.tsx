import * as React from "react";
import { forwardRef, useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { InputAdornment, TextField as MuiTextField } from "@mui/material";
import { useInput, useTranslate } from "ra-core";
import { DEFAULT_DEBOUNCE, IconTextInputProps } from "../Types/types";
import { useAsyncValidator, useRequired } from "./validator";
import EndAdornment from "../CustomComponents/EndAdorment";
import { useAtomValue } from "jotai";
import { validationMessagesAtom } from "../Stores/validationStore";
import { FieldTitle, sanitizeInputRestProps } from "react-admin";
import { InputHelper } from "../CustomComponents/InputHelper";

const typingInterval = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds
/**
 * An override of the default Material UI TextField which is resettable
 */
export const ValidationInput1 = forwardRef((props: IconTextInputProps, ref) => {
  const {
    clearAlwaysVisible,
    slotProps,
    value,
    resettable,
    disabled,
    readOnly,
    variant,
    margin,
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
    iconStart,
    iconEnd,
    ...rest
  } = props;

  const translate = useTranslate();
  const require = useRequired(translate);
  const asyncValidate = useAsyncValidator({
    debounce: DEFAULT_DEBOUNCE,
  });
  // const [value, setValue] = useState(field.value || "");
  //   const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState(false);

  // Compute validators with normalization

  const {
    field,
    fieldState: { error, invalid, isValidating },
    // formState: { dirtyFields },
    id,
    isRequired,
  } = useInput({
    defaultValue,
    format,
    parse,
    resource,
    source,
    type: "text",
    validate: [require(), asyncValidate()],
    onBlur,
    onChange,
    ...rest,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target?.value ?? e;
    field.onChange(newValue); // Ensure form data is in sync
    // setTyping(true);
  };

  const reValidate = () => {
    const isInvalid = (isRequired && !field.value) || invalid;
    if (isInvalid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    reValidate();
    field.onBlur();
  };

  const handleClickClearButton = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      onChange && onChange("");
    },
    [onChange],
  );

  const { inputAdornedEnd } = ValidationInputFieldClasses;

  //   const { endAdornment, ...InputPropsWithoutEndAdornment } = InputProps || {};

  const inputProps = (slotProps && slotProps.input) || {};
  const { endAdornment, ...InputPropsWithoutEndAdornment } =
    typeof inputProps === "function" ? {} : inputProps;

  console.log("clearAlwaysVisible: ", clearAlwaysVisible);
  if (clearAlwaysVisible && endAdornment) {
    throw new Error(
      "ResettableTextField cannot display both an endAdornment and a clear button always visible",
    );
  }

  const endAdornmentElement = EndAdornment({
    props,
    classess: ValidationInputFieldClasses,
    endAdornment,
    translate,
    handleClickClearButton,
    handleMouseDownClearButton,
  });

  const successMessage = useAtomValue(validationMessagesAtom);
  const errMsg = error?.message || successMessage[source];
  const renderHelperText = !!(
    helperText ||
    errMsg ||
    successMessage ||
    invalid
  );
  const helper = !!(helperText || errMsg);

  //   const getEndAdornment = () => {
  //     if (!resettable) {
  //       return endAdornment;
  //     } else if (!value) {
  //       if (clearAlwaysVisible) {
  //         // show clear button, inactive
  //         return (
  //           <InputAdornment
  //             position="end"
  //             className={props.select ? selectAdornment : undefined}
  //           >
  //             <IconButton
  //               className={clearButton}
  //               aria-label={translate("ra.action.clear_input_value")}
  //               title={translate("ra.action.clear_input_value")}
  //               disabled={true}
  //               size="large"
  //             >
  //               <ClearIcon className={clsx(clearIcon, visibleClearIcon)} />
  //             </IconButton>
  //           </InputAdornment>
  //         );
  //       } else {
  //         if (endAdornment) {
  //           return endAdornment;
  //         } else {
  //           // show spacer
  //           return (
  //             <InputAdornment
  //               position="end"
  //               className={props.select ? selectAdornment : undefined}
  //             >
  //               <span className={clearButton}>&nbsp;</span>
  //             </InputAdornment>
  //           );
  //         }
  //       }
  //     } else {
  //       // show clear
  //       return (
  //         <InputAdornment
  //           position="end"
  //           className={props.select ? selectAdornment : undefined}
  //         >
  //           <IconButton
  //             className={clearButton}
  //             aria-label={translate("ra.action.clear_input_value")}
  //             title={translate("ra.action.clear_input_value")}
  //             onClick={handleClickClearButton}
  //             onMouseDown={handleMouseDownClearButton}
  //             disabled={disabled || readOnly}
  //             size="large"
  //           >
  //             <ClearIcon
  //               className={clsx(clearIcon, {
  //                 [visibleClearIcon]: clearAlwaysVisible || value,
  //               })}
  //             />
  //           </IconButton>
  //         </InputAdornment>
  //       );
  //     }
  //   };

  return (
    <StyledTextField
      value={value}
      id={id}
      disabled={disabled || readOnly}
      variant={variant}
      margin={margin}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={clsx("ra-input", `ra-input-${source}`, className)}
      slotProps={{
        input: {
          readOnly: readOnly,
          classes:
            props.select && variant === "filled"
              ? { adornedEnd: inputAdornedEnd }
              : {},
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
          // endAdornment: isValidating ? (
          //   <CircularProgress size={20} /> // Show loading spinner
          // ) : iconEnd ? (
          //   <InputAdornment position="end">{iconEnd}</InputAdornment>
          // ) : (
          //   endAdornmentElement
          // ),
          endAdornment: endAdornmentElement,
          ...InputPropsWithoutEndAdornment,
        },
        inputLabel: {
          shrink: focused || field.value !== "",
          className: clsx({ shake: shake }),
        },
        formHelperText: {
          className: clsx({ helper: !helper }),
          sx: {
            color: error ? "#F58700" : "#4CAF50",
            fontWeight: successMessage ? "bold" : undefined,
          },
        },
      }}
      //   InputProps={{
      //     readOnly: readOnly,
      //     classes:
      //       props.select && variant === "filled"
      //         ? { adornedEnd: inputAdornedEnd }
      //         : {},
      //     endAdornment: endAdornmentElement,
      //     ...InputPropsWithoutEndAdornment,
      //   }}
      label={
        label !== "" && label !== false ? (
          <FieldTitle label={label} source={source} isRequired={isRequired} />
        ) : null
      }
      resource={resource}
      error={invalid}
      helperText={
        renderHelperText ? (
          <InputHelper error={errMsg} helperText={helperText} />
        ) : null
      }
      {...sanitizeInputRestProps(rest)}
      inputRef={ref}
    />
  );
});

ValidationInput1.displayName = "ValidationInputField";

const handleMouseDownClearButton = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

const PREFIX = "RazethValidationInputField";

export const ValidationInputFieldClasses = {
  clearIcon: `${PREFIX}-clearIcon`,
  visibleClearIcon: `${PREFIX}-visibleClearIcon`,
  clearButton: `${PREFIX}-clearButton`,
  selectAdornment: `${PREFIX}-selectAdornment`,
  inputAdornedEnd: `${PREFIX}-inputAdornedEnd`,
};

export const ValidationInputFieldStyles = {
  [`& .${ValidationInputFieldClasses.clearIcon}`]: {
    height: 16,
    width: 0,
  },
  [`& .${ValidationInputFieldClasses.visibleClearIcon}`]: {
    width: 16,
  },
  [`& .${ValidationInputFieldClasses.clearButton}`]: {
    height: 24,
    width: 24,
    padding: 0,
  },
  [`& .${ValidationInputFieldClasses.selectAdornment}`]: {
    position: "absolute",
    right: 24,
  },
  [`& .${ValidationInputFieldClasses.inputAdornedEnd}`]: {
    paddingRight: 0,
  },
};

const StyledTextField = styled(MuiTextField, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(ValidationInputFieldStyles);
