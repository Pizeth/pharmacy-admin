import * as React from "react";
import { forwardRef, useCallback } from "react";
import { styled, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import {
  CircularProgress,
  InputAdornment,
  TextField as MuiTextField,
} from "@mui/material";
import { useTranslate } from "ra-core";
import EndAdornment from "../CustomComponents/EndAdorment";
import { IconTextInputProps } from "../Types/types";

/**
 * An override of the default Material UI TextField which is resettable
 */
export const ResettableIconInputField = forwardRef<
  HTMLDivElement,
  IconTextInputProps
>((props: IconTextInputProps, ref) => {
  const {
    clearAlwaysVisible,
    slotProps,
    value,
    resettable,
    disabled,
    readOnly,
    variant = "outlined",
    margin,
    className,
    iconStart,
    iconEnd,
    isValidating,
    isSuccess,
    isFocused,
    helper,
    ...rest
  } = props;

  const translate = useTranslate();
  const theme = useTheme();

  const { error, onChange } = props;

  const handleClickClearButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onChange && onChange("");
    },
    [onChange],
  );

  const classes = ResettableIconInputStylesClasses;

  const inputProps = (slotProps && slotProps.input) || {};
  const { endAdornment, ...InputPropsWithoutEndAdornment } =
    typeof inputProps === "function" ? {} : inputProps;

  if (clearAlwaysVisible && endAdornment) {
    throw new Error(
      "ResettableTextField cannot display both an endAdornment and a clear button always visible",
    );
  }

  const endAdornmentElement = EndAdornment({
    props,
    classess: classes,
    endAdornment,
    translate,
    handleClickClearButton,
    handleMouseDownClearButton,
  });

  return (
    <StyledTextField
      value={value}
      ref={ref}
      slotProps={{
        input: {
          readOnly: readOnly,
          classes:
            props.select && variant === "outlined"
              ? {
                  adornedEnd: classes.inputAdornedEnd,
                  adornedStart: classes.inputAdornedStart,
                }
              : {},
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
          endAdornment: isValidating ? (
            <CircularProgress size={20} /> // Show loading spinner
          ) : iconEnd ? (
            <InputAdornment position="end">{iconEnd}</InputAdornment>
          ) : (
            endAdornmentElement
          ),
          ...InputPropsWithoutEndAdornment,
        },
        inputLabel: {
          shrink: isFocused || value !== "",
        },
        formHelperText: {
          className: clsx({ helper: !helper }),
          sx: {
            fontWeight:
              isSuccess && !error && !isValidating ? "bold" : undefined,
            color: isValidating
              ? theme.palette.primary.main
              : error
                ? theme.palette.error.main
                : theme.palette.success.main,
          },
        },
      }}
      disabled={disabled || readOnly}
      variant={variant}
      margin={margin}
      className={className}
      {...rest}
      inputRef={ref}
    />
  );
});

ResettableIconInputField.displayName = "ResettableIconInputField";

const handleMouseDownClearButton = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

const PREFIX = "RazethValidationInputField";

export const ResettableIconInputStylesClasses = {
  clearIcon: `${PREFIX}-clearIcon`,
  visibleClearIcon: `${PREFIX}-visibleClearIcon`,
  clearButton: `${PREFIX}-clearButton`,
  selectAdornment: `${PREFIX}-selectAdornment`,
  inputAdornedStart: `${PREFIX}-inputAdornedStart`,
  inputAdornedEnd: `${PREFIX}-inputAdornedEnd`,
};

export const ResettableIconInputStyles = {
  [`& .${ResettableIconInputStylesClasses.clearIcon}`]: {
    height: 16,
    width: 0,
  },
  [`& .${ResettableIconInputStylesClasses.visibleClearIcon}`]: {
    width: 16,
  },
  [`& .${ResettableIconInputStylesClasses.clearButton}`]: {
    height: 24,
    width: 24,
    padding: 0,
  },
  [`& .${ResettableIconInputStylesClasses.selectAdornment}`]: {
    position: "absolute",
    right: 24,
  },
  [`& .${ResettableIconInputStylesClasses.inputAdornedStart}`]: {
    paddingLeft: 0,
  },
  [`& .${ResettableIconInputStylesClasses.inputAdornedEnd}`]: {
    paddingRight: 0,
  },
};

const StyledTextField = styled(MuiTextField, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(ResettableIconInputStyles);

export default ResettableIconInputField;
