// import { useEffect, useState } from "react";
// import axios from "axios";
// import statusCode from "http-status-codes";

// type FieldError = {
//   error?: boolean;
//   message?: string;
// };

// const API_URL = import.meta.env.VITE_API_URL;

// export const ServerValidator = (
//   value: string | undefined,
//   resource: string,
// ): FieldError | null => {
//   const [error, setMsg] = useState<FieldError | null>(null);
//   useEffect(() => {
//     const validateUsername = async () => {
//       if (!value) return;
//       try {
//         const response = await axios.get<any>(
//           `${API_URL}/${resource}/${value}`,
//         );
//         const data = response.data;
//         if (data) {
//           const res: FieldError = {
//             error:
//               statusCode.getStatusCode(data.status) === statusCode.OK
//                 ? false
//                 : true,
//             message: data.message || null,
//           };
//           setMsg(res || null);
//         } else {
//           setMsg(null);
//         }
//       } catch (error) {
//         console.error(error);
//         setMsg({
//           error: true,
//           message: "An error occurred while validating the field!",
//         });
//       }
//     };

//     validateUsername();
//   }, [value, resource]);

//   return error;
// };

// export default ServerValidator;

// import { useEffect, useState } from "react";
import axios from "axios";
import statusCode from "http-status-codes";
import StringUtils from "./StringUtils";
import zxcvbn from "./lazyZxcvbn";
import {
  InputProps,
  isEmpty,
  useResourceContext,
  useTranslateLabel,
} from "react-admin";
import {
  FieldError,
  Memoize,
  MessageFunc,
  UseFieldOptions,
} from "../Types/types";

import lodashMemoize from "lodash/memoize";
import MsgUtils from "./MsgUtils";

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

const API_URL = import.meta.env.VITE_API_URL;

const zxcvbnAsync = await zxcvbn.loadZxcvbn();

export const serverValidator = async (
  value: string | undefined,
  resource: string,
  message = "razeth.validation.async",
): Promise<FieldError> => {
  // if (!value) return null;
  const field = StringUtils.capitalize(StringUtils.getLastSegment(resource));
  if (!value) {
    // return {
    //   error: true,
    //   message: `${StringUtils.capitalize(field)} is required!`,
    // };
    return {
      invalid: true,
      // message: `${StringUtils.capitalize(field)} is required!`,
      message: MsgUtils.setMsg("razeth.validation.required", {
        value,
        field: field,
      }),
      // message: {
      //   message: "razeth.validation.required",
      //   args: {
      //     value,
      //     field: StringUtils.capitalize(field),
      //   },
      // },
    };

    // const getMessage = (
    //   message: string | MessageFunc,
    //   messageArgs: any,
    //   value: any,
    //   values: any,
    // ) =>
    //   typeof message === "function"
    //     ? message({
    //         args: messageArgs,
    //         value,
    //         values,
    //       })
    //     : messageArgs
    //       ? {
    //           message,
    //           args: messageArgs,
    //         }
    //       : message;

    // return Object.assign(
    //   (value: any, values: any, props: InputProps) =>
    //     getMessage(
    //       message,
    //       {
    //         source: props.source,
    //         value,
    //         field,
    //       },
    //       value,
    //       values,
    //     ), // Return undefined if the value is not empty
    //   { invalid: true },
    // );
  }

  try {
    const response = await axios.get<any>(`${API_URL}/${resource}/${value}`);
    const data = response.data;
    const status = statusCode.getStatusCode(data.status);
    return {
      invalid: status !== statusCode.OK,
      // message: data.message || message,
      // args: {
      //   value,
      //   endPoint: resource,
      //   status: status,
      // },
      message: MsgUtils.setMsg(data.message || message, {
        value,
        endPoint: resource,
        status: status,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      invalid: true,
      message: MsgUtils.setMsg("razeth.validation.async", { error, field }),
      // message: "An error occurred while validating the field!",
      // args: { error },
    };
  }
};

// export const validateStrength = async (value: string) => {
//   if (!value) return { invalid: false };

//   const result = await zxcvbnAsync(value);
//   return {
//     invalid: result.score <= 2, // Example threshold
//     message: "razeth.validation.strength",
//     args: {
//       strength: result.score,
//       warning: result.feedback.warning,
//     },
//   };
// };

export const validateStrength = async (
  value: string,
  message = "razeth.validation.notmatch",
) => {
  if (!value)
    return {
      message: "Required",
      feedbackMsg: "",
      score: 0,
      invalid: false,
      args: { password: "" },
    };
  const result = await zxcvbnAsync(value);
  const warningMsg = result.feedback.warning;
  const suggestMsg = result.feedback.suggestions.join(" ");
  const score = result.score;
  const invalid = score <= 0;

  // setValidateError(isValid);
  // setErrMessage(warningMsg || "");
  // setPasswordStrength(result.score);
  // setPasswordFeedback(
  //   result ? suggestMsg : (warningMsg ?? "").concat(` ${suggestMsg}`),
  // );

  if (invalid) {
    // Adjust threshold as needed
    return {
      message: warningMsg || message,
      feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
      score: score,
      invalid: invalid,
      args: {
        password: StringUtils.truncate(value, 5),
        strength: result.score,
        warning: result.feedback.warning,
      },
    };
  }
  return {
    message: undefined,
    feedbackMsg: (warningMsg ?? "").concat(` ${suggestMsg}`),
    score: score,
    invalid: invalid,
    args: {
      password: StringUtils.truncate(value, 5),
      strength: result.score,
      warning: result.feedback.warning,
    },
  }; // No error
};

export const matchPassword = memoize(
  (passwordValue: string, message = "razeth.validation.notmatch") =>
    (value: string, values: any) =>
      value !== passwordValue
        ? MsgUtils.getMessage(message, { passwordValue }, value, values)
        : undefined,
);

// export const matchPassword = memoize(
//   (
//     passwordValue: string,
//     translate: (key: string, options?: any) => string,
//     message = "razeth.validation.notmatch", // Add translate to the parameters
//   ) =>
//     (value: string, values: any) =>
//       value !== passwordValue
//         ? getMessage(message, { passwordValue }, translate) // Pass translate function
//         : undefined,
// );

// export const matchPassword = memoize(
//   (passwordValue: string, message = "razeth.validation.notmatch") =>
//     (value: string) =>
//       value !== passwordValue ? message : undefined,
// );

// export const matchPassword = memoize(
//   (passwordValue: string) => (value: string) =>
//     value !== passwordValue
//       ? { message: "razeth.validation.notmatch", args: {} }
//       : undefined,
// );

/**
 * Required validator
 *
 * Returns an error if the value is null, undefined, or empty
 *
 * @param {string|Function} message
 *
 * @example
 *
 * const titleValidators = [required('The title is required')];
 * <TextInput name="title" validate={titleValidators} />
 */
// export const required = memoize((message = "razeth.validation.required") =>
//   // const translateLabel = useTranslateLabel();
//   Object.assign(
//     (value: any, values: any, props: InputProps) =>
//       isEmpty(value)
//         ? getMessage(
//             message,
//             {
//               source: props.source,
//               value,
//               field: /*translateLabel(*/ {
//                 label: props.label,
//                 source: props.source,
//               } /*)*/,
//             },
//             value,
//             values,
//           )
//         : undefined,
//     { isRequired: true },
//   ),
// );

export const useRequired = (
  options?: UseFieldOptions,
  message = "razeth.validation.required",
) => {
  // const dataProvider = useDataProvider();
  const translateLabel = useTranslateLabel();
  const resource = useResourceContext(options);
  if (!resource) {
    throw new Error("useField: missing resource prop or context");
  }

  const validateField = (resource?: string) => {
    // return (value: any, allValues: any, props: InputProps) => {
    //   if (isEmpty(value)) return undefined;
    //   return {
    //     message,
    //     args: {
    //       source: props.source,
    //       value,
    //       field: translateLabel({
    //         label: props.label,
    //         source: props.source,
    //         resource,
    //       }),
    //     },
    //     isRequired: true,
    //   };
    // };

    // return (value: any, allValues: any, props: InputProps) => {
    //   if (isEmpty(value)) {
    //     return {
    //       message,
    //       args: {
    //         source: props.source,
    //         value,
    //         field: translateLabel({
    //           label: props.label,
    //           source: props.source,
    //           resource,
    //         }),
    //       },
    //       isRequired: true,
    //     };
    //   }
    //   return undefined; // Return undefined if the value is not empty
    // };
    return Object.assign(
      (value: any, values: any, props: InputProps) =>
        isEmpty(value)
          ? MsgUtils.getMessage(
              message,
              {
                source: props.source,
                value,
                field: translateLabel({
                  label: props.label,
                  source: props.source,
                  resource,
                }),
              },
              value,
              values,
            )
          : undefined, // Return undefined if the value is not empty
      { isRequired: true },
    );
  };

  return validateField;
};

// export const required = memoize((message = "razeth.validation.required") =>
//   Object.assign(
//     (value: any, values: any) =>
//       isEmpty(value)
//         ? getMessage(message, undefined, value, values)
//         : undefined,
//     { isRequired: true },
//   ),
// );

// return {
//   message,
//   args: {
//     source: props.source,
//     value,
//     field: translateLabel({
//       label: props.label,
//       source: props.source,
//       resource,
//     }),
//   },
// };

// const getMessage = (
//   message: string, // Now always a translation key
//   messageArgs: any,
//   translate: (key: string, options?: any) => string, // Add translate function as a parameter
// ) => {
//   return translate(message, messageArgs); // Always translate
// };

export default { serverValidator, validateStrength, matchPassword };
