import { InputAdornment, IconButton, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { ResettableTextField, sanitizeInputRestProps } from "react-admin";
import { clsx } from "clsx";
// import { FieldTitle, useTranslate } from "ra-core";
// import { PasswordInputUIProps } from "../Types/types";

import {
  useTranslate,
  ResettableTextField,
  FieldTitle,
  sanitizeInputRestProps,
} from "react-admin";
import { PasswordInputUIProps } from "../Types/types";

// export const PasswordInputUI = ({
//   id,
//   field,
//   source,
//   className,
//   iconStart,
//   iconEnd,
//   label,
//   isRequired,
//   focused,
//   value,
//   shake,
//   visible,
//   validateError,
//   errMessage,
//   handleClick,
//   handlePasswordChange,
//   handleFocus,
//   handleBlur,
//   ...rest
// }: PasswordInputUIProps) => {
//   const translate = useTranslate();

//   return (
//     <Box width="100%">
//       <ResettableTextField
//         id={id}
//         {...field}
//         source={source}
//         type={visible ? "text" : "password"}
//         size="small"
//         onChange={handlePasswordChange}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         fullWidth
//         className={clsx("ra-input", `ra-input-${source}`, className)}
//         error={validateError}
//         helperText={validateError ? errMessage : ""}
//         InputProps={{
//           startAdornment: iconStart && (
//             <InputAdornment position="start">{iconStart}</InputAdornment>
//           ),
//           endAdornment: (
//             <InputAdornment position="end">
//               {iconEnd && (
//                 <InputAdornment position="end">{iconEnd}</InputAdornment>
//               )}
//               <IconButton
//                 aria-label={translate(
//                   visible
//                     ? "ra.input.password.toggle_visible"
//                     : "ra.input.password.toggle_hidden",
//                 )}
//                 onClick={handleClick}
//                 size="large"
//                 edge="end"
//               >
//                 {visible ? <Visibility /> : <VisibilityOff />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         InputLabelProps={{
//           shrink: focused || !!value,
//           className: clsx({ shake }),
//         }}
//         label={
//           label &&
//           label !== "" && (
//             <FieldTitle label={label} source={source} isRequired={isRequired} />
//           )
//         }
//         {...sanitizeInputRestProps(rest)}
//       />
//     </Box>
//   );
// };

// export default PasswordInputUI;

// export const PasswordInputUI = ({
//   id,
//   field,
//   source,
//   className,
//   iconStart,
//   iconEnd,
//   label,
//   isRequired,
//   validateError,
//   errMessage,
//   validation,
//   ...rest
// }: PasswordInputUIProps) => {
//   const translate = useTranslate();

//   return (
//     <Box width="100%">
//       <ResettableTextField
//         id={id}
//         {...field}
//         source={source}
//         type={validation.visible ? "text" : "password"}
//         size="small"
//         onChange={validation.handlePasswordChange}
//         onFocus={validation.handleFocus}
//         onBlur={validation.handleBlur}
//         fullWidth
//         className={clsx("ra-input", `ra-input-${source}`, className)}
//         error={validateError}
//         helperText={validateError ? errMessage : ""}
//         InputProps={{
//           startAdornment: iconStart && (
//             <InputAdornment position="start">{iconStart}</InputAdornment>
//           ),
//           endAdornment: (
//             <InputAdornment position="end">
//               {iconEnd && (
//                 <InputAdornment position="end">{iconEnd}</InputAdornment>
//               )}
//               <IconButton
//                 aria-label={translate(
//                   validation.visible
//                     ? "ra.input.password.toggle_visible"
//                     : "ra.input.password.toggle_hidden",
//                 )}
//                 onClick={validation.handleClick}
//                 size="large"
//                 edge="end"
//               >
//                 {validation.visible ? <Visibility /> : <VisibilityOff />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         InputLabelProps={{
//           shrink: validation.focused || !!field?.value,
//           className: clsx({ shake: validation.shake }),
//         }}
//         label={
//           label &&
//           label !== "" && (
//             <FieldTitle label={label} source={source} isRequired={isRequired} />
//           )
//         }
//         {...sanitizeInputRestProps(rest)}
//       />
//     </Box>
//   );
// };

// export default PasswordInputUI;
