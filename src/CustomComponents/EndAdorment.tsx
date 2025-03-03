import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment, IconButton } from "@mui/material";
import { GetEndAdornmentParams } from "../Types/types";

const EndAdornment = ({
  props,
  classess,
  endAdornment,
  translate,
  handleClickClearButton,
  handleMouseDownClearButton,
}: GetEndAdornmentParams) => {
  console.log("EndAdornment: props", props);
  console.log("EndAdornment: props.resettable is ", props.resettable);
  console.log("EndAdornment: props.value is ", props.value);
  if (!props.resettable) {
    // console.log("EndAdornment: props.resettable is false");
    return endAdornment;
  } else if (!props.value) {
    console.log("EndAdornment: props.value is false");
    if (props.clearAlwaysVisible) {
      console.log("EndAdornment: props.clearAlwaysVisible is true");
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
      console.log("EndAdornment: props.clearAlwaysVisible is false");
      if (endAdornment) {
        console.log("EndAdornment: endAdornment is true");
        return endAdornment;
      } else {
        console.log("EndAdornment: endAdornment is false");
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
