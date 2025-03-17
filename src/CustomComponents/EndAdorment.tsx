import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment, IconButton } from "@mui/material";
import { GetEndAdornmentParams } from "../Types/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const EndAdornment = ({
  props,
  classess,
  endAdornment,
  translate,
  handleClickClearButton,
  handleMouseDownClearButton,
}: GetEndAdornmentParams) => {
  if (!props.resettable) {
    return endAdornment;
  }
  // else if (props.isPassword) {
  //   console.log("jol password");
  //   return (
  //     <InputAdornment position="end">
  //       <IconButton
  //         aria-label={translate(
  //           props.visible
  //             ? "ra.input.password.toggle_visible"
  //             : "ra.input.password.toggle_hidden",
  //         )}
  //         onClick={props.onTogglePassword}
  //         size="large"
  //       >
  //         {props.visible ? <Visibility /> : <VisibilityOff />}
  //       </IconButton>
  //     </InputAdornment>
  //   );
  // }
  else if (!props.value) {
    if (props.clearAlwaysVisible) {
      // show clear button, inactive
      return (
        <InputAdornment
          position="end"
          className={props.select ? classess.selectAdornment : undefined}
        >
          <IconButton
            className={classess.clearButton}
            aria-label={translate("ra.action.clear_input_value")}
            title={translate("ra.action.clear_input_value")}
            disabled={true}
            size="large"
          >
            <ClearIcon
              className={clsx(classess.clearIcon, classess.visibleClearIcon)}
            />
          </IconButton>
        </InputAdornment>
      );
    } else {
      if (endAdornment) {
        return endAdornment;
      } else {
        // show spacer
        return (
          <InputAdornment
            position="end"
            className={props.select ? classess.selectAdornment : undefined}
          >
            <span className={classess.clearButton}>&nbsp;</span>
          </InputAdornment>
        );
      }
    }
  } else {
    // show clear
    return (
      <InputAdornment
        position="end"
        className={props.select ? classess.selectAdornment : undefined}
      >
        <IconButton
          className={classess.clearButton}
          aria-label={translate("ra.action.clear_input_value")}
          title={translate("ra.action.clear_input_value")}
          onClick={handleClickClearButton}
          onMouseDown={handleMouseDownClearButton}
          disabled={props.disabled || props.readOnly}
          size="large"
        >
          <ClearIcon
            className={clsx(classess.clearIcon, {
              [classess.visibleClearIcon]:
                props.clearAlwaysVisible || props.value,
            })}
          />
        </IconButton>
      </InputAdornment>
    );
  }
};

export default EndAdornment;
