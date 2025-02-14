/* eslint-disable @typescript-eslint/no-explicit-any */
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
  asyncDebounce,
  InputProps,
  isEmpty,
  useDataProvider,
  useResourceContext,
  useTranslate,
  useTranslateLabel,
} from "react-admin";
import { FieldError, Memoize, UseFieldOptions } from "../Types/types";

import lodashMemoize from "lodash/memoize";
import MsgUtils from "./MsgUtils";
import { useCallback, useRef } from "react";
import { merge, set } from "lodash";

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_DEBOUNCE = import.meta.env.VITE_DELAY_CALL || 2500; // Time in milliseconds

const zxcvbnAsync = await zxcvbn.loadZxcvbn();

// validate: async (resource: string, param: string) => {
//   const response = await fetchUtils.fetchJson(
//     `${API_URL}/validate/${resource}/${param}`,
//   );
//   return {
//     data: response.json.data,
//   };
// },

const validate = async (value: string, resource: string) => {
  const response = await axios.get<any>(`${API_URL}/${resource}/${value}`);
  return response;
};

export const useAsync = (options?: UseFieldOptions) => {
  const resource = useResourceContext(options);
  if (!resource) {
    throw new Error("useAsync: missing resource prop or context");
  }

  const debouncedResult = useRef(
    // The initial value is here to set the correct type on useRef
    asyncDebounce(validate, options?.debounce ?? DEFAULT_DEBOUNCE),
  );

  const validateAsync = useCallback(
    (callTimeOptions?: UseFieldOptions) => {
      const { message, debounce: interval } = merge<UseFieldOptions, any, any>(
        {
          message: "ra.validation.unique",
          debounce: DEFAULT_DEBOUNCE,
        },
        options,
        callTimeOptions,
      );

      debouncedResult.current = asyncDebounce(validate, interval);
      return async (value: any) => {
        const field = StringUtils.capitalize(
          StringUtils.getLastSegment(resource),
        );
        if (isEmpty(value)) {
          return {
            invalid: true,
            // message: `${StringUtils.capitalize(field)} is required!`,
            message: MsgUtils.setMsg("razeth.validation.required", {
              value,
              field: field,
            }),
          };
        }

        try {
          const response = await debouncedResult.current(value, resource);
          // const response = await axios.get<any>(
          //   `${API_URL}/${resource}/${value}`,
          // );
          if (response) {
            const data = response.data;
            const status = statusCode.getStatusCode(data.status);
            return {
              invalid: status !== statusCode.OK,
              message: MsgUtils.setMsg(data.message || message, {
                value,
                endPoint: resource,
                status: status,
              }),
            };
          }
        } catch (error) {
          console.error(error);
          return {
            invalid: true,
            message: MsgUtils.setMsg("razeth.validation.async", {
              error,
              field,
            }),
          };
        }

        return undefined;
      };
    },
    [options, resource],
  );

  return validateAsync;
};

export const asyncValidator = memoize(
  (resource: string, message = "razeth.validation.async") =>
    async (value: string): Promise<FieldError> => {
      const field = StringUtils.capitalize(
        StringUtils.getLastSegment(resource),
      );
      if (!value) {
        return {
          invalid: true,
          // message: `${StringUtils.capitalize(field)} is required!`,
          message: MsgUtils.setMsg("razeth.validation.required", {
            value,
            field: field,
          }),
        };
      }

      try {
        const response = await axios.get<any>(
          `${API_URL}/${resource}/${value}`,
        );
        const data = response.data;
        const status = statusCode.getStatusCode(data.status);
        return {
          invalid: status !== statusCode.OK,
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
        };
      }
    },
);

export const serverValidator = async (
  value: string | undefined,
  resource: string,
  message = "razeth.validation.async",
): Promise<FieldError> => {
  const field = StringUtils.capitalize(StringUtils.getLastSegment(resource));
  if (!value) {
    return {
      invalid: true,
      // message: `${StringUtils.capitalize(field)} is required!`,
      message: MsgUtils.setMsg("razeth.validation.required", {
        value,
        field: field,
      }),
    };
  }

  try {
    const response = await axios.get<any>(`${API_URL}/${resource}/${value}`);
    const data = response.data;
    const status = statusCode.getStatusCode(data.status);
    return {
      invalid: status !== statusCode.OK,
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
export const useRequired = (
  options?: UseFieldOptions,
  message = "razeth.validation.required",
) => {
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

// const getMessage = (
//   message: string, // Now always a translation key
//   messageArgs: any,
//   translate: (key: string, options?: any) => string, // Add translate function as a parameter
// ) => {
//   return translate(message, messageArgs); // Always translate
// };

export default { serverValidator, validateStrength, matchPassword };
