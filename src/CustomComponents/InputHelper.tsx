import { isValidElement } from "react";
import { useTranslate } from "ra-core";
import { InputHelperTextProps, ValidationError } from "react-admin";

export const InputHelper = (props: InputHelperTextProps) => {
  const { helperText, error } = props;
  const translate = useTranslate();

  if (error) {
    return <ValidationError error={error} />;
  }

  if (helperText === false) {
    return null;
  }

  if (isValidElement(helperText)) {
    return helperText;
  }

  if (typeof helperText === "string") {
    return <>{translate(helperText, { _: helperText })}</>;
  }

  // Material UI's HelperText cannot reserve space unless we pass a single
  // space as child, which isn't possible when the child is a component.
  // Therefore, we must reserve the space ourselves by passing the same
  // markup as Material UI.
  // @see https://github.com/mui/material-ui/blob/62e439b7022d519ab638d65201e204b59b77f8da/packages/material-ui/src/FormHelperText/FormHelperText.js#L85-L90
  // return <span dangerouslySetInnerHTML={defaultInnerHTML} />;
};
