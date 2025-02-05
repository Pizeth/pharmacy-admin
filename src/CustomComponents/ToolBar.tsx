import { Toolbar, SaveButton, ToolbarProps } from "react-admin";
import { useFormState } from "react-hook-form";

export const CustomToolbar = (props: ToolbarProps) => {
  const { errors } = useFormState(); // Access form state
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Toolbar {...props}>
      <SaveButton disabled={hasErrors} />
    </Toolbar>
  );
};

export default CustomToolbar;
